import { assertEquals } from "https://deno.land/x/std@0.148.0/testing/asserts.ts";
import { serialize } from "../mod.ts"

Deno.test("serialize name and value", () => {
    assertEquals(serialize("foo", "bar"), "foo=bar");
});
Deno.test("url-encodes name and value", () => {
    assertEquals(serialize("foo bar", "baz qux"), "foo bar=baz%20qux");
});
Deno.test("serialize name and empty value", () => {
    assertEquals(serialize("foo", ""), "foo=");
});
Deno.test("serialize name and null value", () => {
    assertEquals(serialize("foo", null), "foo=");
});