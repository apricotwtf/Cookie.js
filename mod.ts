/**
 * Cookie.js
 * Copyright 2012-14 Roman Shtylman
 * Copyright 2015 Douglas Christopher Wilson
 * Copyright 2022 Weredime
 * MIT License
 */


/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

interface ParseOptions {
    decode?: (cookie: string) => string;
}
interface SerializeOptions {
    encode?: (cookie: string) => string;
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    priority?: 'low' | 'medium' | 'high';
}

export function parse(str: string, options: ParseOptions = {
    decode: (v) => (v.indexOf("%") !== -1 ? decodeURIComponent(v) : v),
}): { [key: string]: string } {
    const cookie: { [key: string]: string } = {};

    for (let i = 0; i < str.length;) {
        const eqIdx = str.indexOf("=", i);
        if (eqIdx === -1) break;

        let endIdx = str.indexOf(";", i);
        if (endIdx === -1) {
            endIdx = str.length;
        } else if (endIdx < eqIdx) {
            i = str.lastIndexOf(";", eqIdx - 1) + 1;
            continue;
        }

        const key = str.slice(i, eqIdx).trim();
        if (typeof cookie[key] === "undefined") {
            let v = str.slice(eqIdx + 1, endIdx).trim();

            if (v.charCodeAt(0) === 0x22) v = v.slice(1, -1);

            try {
                v = options.decode ? options.decode(v) : (v.indexOf("%") !== -1 ? decodeURIComponent(v) : v);
            } catch {
                // We don't need to handle error
            }
            cookie[key] = v;
        }

        i = endIdx + 1;
    }

    return cookie;
}
export function serialize(name: string, value: string | null, { encode, maxAge, domain, path, expires, httpOnly, secure, priority, sameSite }: SerializeOptions = { encode: encodeURIComponent }): string {
    encode = encode || encodeURIComponent;

    if (!fieldContentRegExp.test(name)) {
        throw new TypeError("Invalid cookie name");
    }
    value = encode(value || '');
    if (!fieldContentRegExp.test(value) && value !== "") {
        throw new TypeError("Invalid cookie value");
    }

    let str = `${name}=${value}`;

    if (typeof maxAge !== "undefined") {
        if (isNaN(maxAge) || isFinite(maxAge)) {
            throw new TypeError("Invalid max age");
        }
        str += `; Max-Age=${Math.floor(maxAge)}`;
    }
    if (typeof domain !== "undefined") {
        if (!fieldContentRegExp.test(domain)) {
            throw new TypeError("Invalid domain");
        }
        str += `; Domain=${domain}`;
    }
    if (typeof path !== "undefined") {
        if (!fieldContentRegExp.test(path)) {
            throw new TypeError("Invalid path");
        }
        str += `; Path=${path}`;
    }
    if (typeof expires !== "undefined") {
        str += `; Expires=${expires.toUTCString()}`;
    }
    if (httpOnly) {
        str += "; HttpOnly";
    }
    if (secure) {
        str += "; Secure";
    }
    if (typeof priority !== "undefined") {
        const prio = priority.charAt(0).toUpperCase() + priority.slice(1);
        str += `; Priority=${prio}`;
    }
    if (typeof sameSite !== "undefined") {
        const s = sameSite.charAt(0).toUpperCase() + sameSite.slice(1);
        str += `; SameSite=${s}`;
    }

    return str;
}