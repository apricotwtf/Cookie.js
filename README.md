# Cookie.js
Simple cookie parser module, for deno, Node.js and the browser.

## Example
```js
import { parse, serialize } from "@weredime/cookie";

const cookie = parse("foo=bar;");

console.log(cookie.foo); // bar

console.log(serialize("foo", "bar")) // foo=bar;
```