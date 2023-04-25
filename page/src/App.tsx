import {useEffect, useMemo, useState} from 'preact/hooks';
import {RawSourceMap, SourceMapConsumer} from "source-map";
import {
    decodeStacktraceEntry,
    formatStacktraceEntry,
    parseStacktraceEntry,
    StacktraceEntry
} from "./decodeStacktrace.js";
import browser from "webextension-polyfill";

const consumerCache = new Map<string, SourceMapConsumer | null>();

async function fetchConsumer(path: string): Promise<SourceMapConsumer | null> {
    try {
        const data = await fetch(path).then(it => it.json());
        return await new SourceMapConsumer(data as RawSourceMap);
    } catch (e) {
        return null;
    }
}

function getOrigins(domain: string): string[] {
    if (domain.startsWith("vector://")) {
        return ["https://develop.element.io/", "https://staging.element.io/", "https://app.element.io/"]
    } else {
        return [domain]
    }
}

async function getConsumer(path: string): Promise<SourceMapConsumer | null> {
    if (consumerCache.has(path)) {
        return consumerCache.get(path) ?? null;
    }
    const consumer = path.startsWith("vector://vector/webapp/")
        ? await fetchConsumer(path.replace("vector://vector/webapp/", "https://develop.element.io/") + ".map")
        ?? await fetchConsumer(path.replace("vector://vector/webapp/", "https://staging.element.io/") + ".map")
        ?? await fetchConsumer(path.replace("vector://vector/webapp/", "https://app.element.io/") + ".map")
        : await fetchConsumer(path + ".map");
    if (consumer) {
        consumerCache.get(path)?.destroy();
        consumerCache.set(path, consumer);
    }
    return consumer;
}

function getDomainFromStacktraceEntry(entry: StacktraceEntry): string | null {
    if (!entry.parsed) {
        return null;
    }

    if (entry.parsed.path.startsWith("vector://")) {
        return "vector://"
    }

    try {
        let url = new URL(entry.parsed.path);
        url.pathname = "";
        url.hash = "";
        url.search = "";
        if (url.protocol === "webpack") {
            return null;
        }
        return url.toString();
    } catch (e) {
        return null;
    }
}

function getDomainsFromStacktraceEntries(entries: StacktraceEntry[]): string[] {
    const result = new Set<string>();
    for (const entry of entries) {
        const domain = getDomainFromStacktraceEntry(entry);
        if (domain) {
            result.add(domain);
        }
    }
    return Array.from(result).sort();
}

function shouldStacktraceEntryBeDecoded(entry: StacktraceEntry, allowedDomains: string[]): boolean {
    if (!entry.parsed) {
        return false;
    }
    const domain = getDomainFromStacktraceEntry(entry);
    if (!domain) {
        return false;
    }
    return allowedDomains.includes(domain);
}

function decodeStacktrace(trace: StacktraceEntry[], consumers: Map<string, SourceMapConsumer | null>): string {
    const result: string[] = [];
    for (const entry of trace) {
        if (!entry.parsed) {
            result.push(entry.original);
        } else {
            const consumer = consumers.get(entry.parsed!.path);
            if (!consumer) {
                result.push(entry.original);
            } else {
                result.push(formatStacktraceEntry(decodeStacktraceEntry(consumer, entry)));
            }
        }
    }
    return result.join("\n");
}

async function loadConsumers(trace: StacktraceEntry[], allowedDomains: string[]): Promise<Map<string, SourceMapConsumer | null>> {
    const urls = Array.from(new Set(
        trace.filter(it => shouldStacktraceEntryBeDecoded(it, allowedDomains)).map(it => it.parsed!.path)
    ));
    const entries = urls.map(
        async (it: string): Promise<[string, SourceMapConsumer | null]> => [it, await getConsumer(it)]
    )
    return new Map(await Promise.all(entries));
}

function App() {
    const [content, setContent] = useState<string>("");
    const trace = useMemo(() => content.split("\n").map(parseStacktraceEntry), [content]);
    const domains = useMemo(() => getDomainsFromStacktraceEntries(trace), [trace]);
    const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
    const [consumers, setConsumers] = useState<Map<string, SourceMapConsumer | null>>(new Map());
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        let active = true;

        setLoading(true);
        loadConsumers(trace, allowedDomains).then(result => {
            if (active) {
                setError("");
                setLoading(false);
                setConsumers(result);
            }
        }).catch(e => {
            if (active) {
                setError(e);
            }
        });
        return () => {
            active = false;
        }
    }, [trace, allowedDomains]);
    const decodedTrace = useMemo(() => decodeStacktrace(trace, consumers), [trace, consumers]);

    return (
        <div id="app">
            <ul>
                {domains.map(domain => (
                    <li key={domain}>
                        <label>
                            <input type="checkbox"
                                   checked={allowedDomains.includes(domain)}
                                   onChange={async ({currentTarget: { checked }}) => {
                                       if (checked && !allowedDomains.includes(domain)) {
                                           const permissions = {
                                               origins: getOrigins(domain).map(it => ""+it+"*.js.map"),
                                           };
                                           await browser.permissions.request(permissions);
                                           setAllowedDomains([...allowedDomains, domain])
                                       } else if (!checked && allowedDomains.includes(domain)) {
                                           setAllowedDomains([...allowedDomains.filter(it => it !== domain)])
                                       }
                                   }}
                            />
                            {domain}
                        </label>
                    </li>
                ))}
            </ul>
            <progress style={{opacity: loading ? 1 : 0}}/>
            { error && (
                <p><strong>Error</strong>: {error}</p>
            )}
            <main>
                <textarea value={content}
                          onChange={({currentTarget: {value}}) => setContent(value)}
                          onInput={({currentTarget: {value}}) => setContent(value)}
                ></textarea>
                <textarea readOnly value={decodedTrace}/>
            </main>
        </div>
    );
}

export default App;
