import { build, emptyDir } from "https://deno.land/x/dnt@0.28.0/mod.ts";

await emptyDir("./node");
await build({
    entryPoints: ["./mod.ts", "./client.ts"],
    outDir: "./node",
    shims: {
        deno: true,
    },
    package: {
        name: "@weredime/cookie",
        version: Deno.args[0],
        description: "A library to parse and serialize cookies.",
        license: "BSD-3",
        repository: {
            type: "git",
            url: "git+https://github.com/Weredime/Cookie.js"
        },
        bugs: {
            url: "https://github.com/Weredime/Cookie.js/issues"
        },
        browser: "./esm/client.js"
    },
    typeCheck: false,
});

Deno.copyFileSync("LICENSE", "./node/LICENSE");
Deno.copyFileSync("README.md", "./node/README.md");