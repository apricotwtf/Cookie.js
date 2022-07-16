import { parse } from "./mod.ts";

export function get(name: string) {
    const cookies = parse(document.cookie);
    return cookies[name];
} 