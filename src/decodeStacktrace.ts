import {Position, SourceMapConsumer} from "source-map-js";

export interface StacktraceEntry {
    original: string;
    parsed?: {
        indent: number;
        modifiers: string[];
        name: string | null;
        path: string;
        position: Position;
        format: string;
    }
}

export function parseStacktraceEntry(entry: string): StacktraceEntry {
    let match: RegExpMatchArray | null;
    let format: string;
    match = entry.match(/^(?<indent> +)at ((?<modifiers>(\S+ )*\S+) )?(?<name>\S+)? \((?<path>.+):(?<line>\d+):(?<column>\d+)\)$/);
    format = "{indent}at {modifiers} {name} ({path}:{line}:{column})";
    if (!match) {
        match = entry.match(/^(?<indent> +)at ((?<modifiers>(\S+ )*\S+) )?(?<path>.+):(?<line>\d+):(?<column>\d+)$/);
        format = "{indent}at {modifiers} {path}:{line}:{column}";
    }
    if (!match) {
        match = entry.match(/(?<indent> *)((?<name>\S+)@)?(?<path>.+):(?<line>\d+):(?<column>\d+)$/);
        format = "{indent}{name}@{path}:{line}:{column}";
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
            position: {line, column},
            format
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

    let result = entry.parsed.format;
    result = result.replaceAll("{indent}", " ".repeat(entry.parsed.indent));
    result = result.replaceAll("{name}", entry.parsed.name ?? "");
    result = result.replaceAll("{path}", entry.parsed.path);
    result = result.replaceAll("{line}", entry.parsed.position.line.toString());
    result = result.replaceAll("{column}", entry.parsed.position.column.toString());
    result = result.replaceAll("{modifiers}", entry.parsed.modifiers.join(" "));
    return result;
}
