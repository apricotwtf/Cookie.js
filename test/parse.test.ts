import { parse } from "../mod.ts";

import { assertEquals } from "https://deno.land/x/std@0.148.0/testing/asserts.ts";

Deno.test("parses cookie string to object", () => {
    const cookie = parse("foo=bar; baz=qux;");
    assertEquals(cookie, {
        foo: "bar",
        baz: "qux",
    });
})
Deno.test("ignores whitespace", () => {
    assertEquals(parse("FOO    = bar;   baz  =   raz"), {
        FOO: "bar",
        baz: "raz",
    })
})
Deno.test("parses cookie with empty value", () => {
    assertEquals(parse("foo= ; bar="), { foo: '', bar: '' });
})
Deno.test("URL-decodes values", () => {
    assertEquals(parse("foo=bar; baz=%22qux%22"), {
        foo: "bar",
        baz: '"qux"',
    });
})
Deno.test("returns original value on escape error", () => {
    assertEquals(parse("foo=%1;bar=bar"), {
        foo: "%1",
        bar: 'bar',
    });
})
Deno.test("ignore cookies without value", () => {
    assertEquals(parse("foo=bar;fizz  ;  buzz"), { foo: 'bar' });
    assertEquals(parse('  fizz; foo=  bar'), { foo: 'bar' })
})
Deno.test("ignores duplicate cookies", () => {
    assertEquals(parse("foo=bar; foo=baz"), { foo: 'bar' });
})