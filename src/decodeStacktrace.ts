import {Position, SourceMapConsumer} from "source-map-js";

export interface StacktraceEntry {
    original: string;
    parsed?: {
        indent: number;
        modifiers: string[];
        name: string | null;
        path: string;
        position: Position;
    }
}

export function parseStacktraceEntry(entry: string): StacktraceEntry {
    let match: RegExpMatchArray | null;
    match = entry.match(/^(?<indent> +)at ((?<modifiers>(\S+ )*\S+) )?(?<name>\S+)? \((?<path>.+):(?<line>\d+):(?<column>\d+)\)$/);
    if (!match) {
        match = entry.match(/^(?<indent> +)at ((?<modifiers>(\S+ )*\S+) )?(?<path>.+):(?<line>\d+):(?<column>\d+)$/)
    }
    if (!match?.groups) {
        return {original: entry};
    }
    const line = parseInt(match.groups.line);
    const column = parseInt(match.groups.column);
    const path = match.groups.path;
    const indent = match.groups.indent.length;
    const name = match.groups.name;
    const modifiers = match.groups.modifiers?.split(" ") ?? [];

    return {
        original: entry,
        parsed: {
            indent,
            modifiers,
            name,
            path,
            position: {line, column}
        }
    };
}

export function decodeStacktraceEntry(
    consumer: SourceMapConsumer,
    entry: StacktraceEntry
): StacktraceEntry {
    if (!entry.parsed) {
        // not decodable
        return entry;
    }
    if (entry.parsed.path.startsWith("webpack:///")) {
        // already decoded
        return entry;
    }

    if (!consumer) {
        console.debug("could not get source map consumer: ", entry.parsed.path);
        return entry;
    }
    const mapped = consumer.originalPositionFor(entry.parsed.position);
    if (!mapped) {
        console.debug("could not find original position: ", entry.parsed);
        return entry;
    }

    return {
        original: entry.original,
        parsed: {
            ...entry.parsed,
            path: mapped.source ?? "",
            position: {
                line: mapped.line ?? 0,
                column: mapped.column ?? 0
            }
        }
    };
}

export function formatStacktraceEntry(entry: StacktraceEntry): string {
    if (!entry.parsed) {
        return entry.original;
    }
    let result = ["at"];
    if (entry.parsed.modifiers) {
        result.push(...entry.parsed.modifiers);
    }
    if (entry.parsed.name) {
        result.push(entry.parsed.name);
    }

    const position = [
        entry.parsed.path,
        entry.parsed.position.line,
        entry.parsed.position.column
    ].join(":");

    if (entry.parsed.name) {
        result.push("(" + position + ")");
    } else {
        result.push(position);
    }

    return " ".repeat(entry.parsed.indent) + result.join(" ");
}
