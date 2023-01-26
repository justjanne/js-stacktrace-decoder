import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import {RawSourceMap, SourceMapConsumer} from "source-map-js";
import {formatStacktraceEntry, parseStacktraceEntry, decodeStacktraceEntry, StacktraceEntry} from "./decodeStacktrace";

const consumerCache = new Map<string, SourceMapConsumer | null>();

async function getConsumer(path: string): Promise<SourceMapConsumer | null> {
    if (consumerCache.has(path)) {
        return consumerCache.get(path) ?? null;
    }
    try {
        const url = path
            .replace(/^vector:\/\/vector\/webapp\//, "https://app.element.io/")
            .concat(".map");
        const data = await fetch("http://localhost:5000/?url=" + url).then(it => it.json());
        const consumer = await new SourceMapConsumer(data as RawSourceMap);
        consumerCache.set(path, consumer);
        return consumer;
    } catch (e) {
        console.warn("could not build source map consumer: ", e);
        consumerCache.set(path, null);
        return null;
    }
}

function getDomainFromStacktraceEntry(entry: StacktraceEntry): string | null {
    if (entry.parsed) {
        let url = new URL(entry.parsed.path.replace(/^vector:\/\/vector\/webapp\//, "https://app.element.io/"));
        url.pathname = "";
        url.hash = "";
        url.search = "";
        if (url.protocol === "webpack") {
            return null;
        }
        return url.toString();
    } else {
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
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        let active = true;

        setLoading(true);
        loadConsumers(trace, allowedDomains).then(result => {
            if (active) {
                setLoading(false);
                setConsumers(result);
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
                                   onChange={({target: {checked}}) => {
                                       if (checked && !allowedDomains.includes(domain)) {
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
            <main>
                <textarea value={content} onChange={({target: {value}}) => setContent(value)}></textarea>
                <textarea readOnly value={decodedTrace}/>
            </main>
        </div>
    );
}

export default App;
