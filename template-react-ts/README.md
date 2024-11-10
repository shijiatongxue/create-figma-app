# figma-plugin-template

A figma template using React, Tailwind, Typescript, JSON RPC.

- Simplify postmessage communication between ui and sandbox
- Sandbox is published together with ui, no need to publish sandbox in Figma
- Good TypeScript type definition, ui and sandbox know each other's function interface
- Extremely small sandbox code size, only contains sandbox code

![](https://figma-plugin-template-1307850796.cos.ap-beijing.myqcloud.com/plugin-screenshot.png)

## Development

```bash
pnpm install
npm run dev
```

### Code Structure

```
├── react               // react project
│   ├── App.tsx
│   ├── index.css
│   ├── index.html
│   ├── index.tsx
│   ├── rpc
|   |  ├── index.ts    // create postmessage handler in ui
|   |  ├── handlers.ts // ui handlers for sandbox event
|   |  └── sandbox.js  // [auto generated, no need to modify this file] ui will get the sandbox code (a url, same origin with ui), and then postmessage it to the sandbox and execute it
│   └── utils
└── sandbox
|    ├── code           // sandbox init code. When the plugin is first published in Figma, this file (`code.js` in dist) needs to be published
|    └── sandbox        // sandbox core code, will be bundled to `react/rpc/sandbox.js`
|      ├── index.ts     // create postmessage handler in sandbox
|      └── handlers.ts  // sandbox handlers for ui event
```


## Build

```bash
npm run build
```

![](https://figma-plugin-template-1307850796.cos.ap-beijing.myqcloud.com/build.png)

Here are the bundles:

```
├── code.js
├── manifest.json
├── ui.html
└── web
    ├── index.35ed7150.css
    ├── index.ef782c3a.js
    └── index.html
```

- Figma plugin: manifest.json, code.js, ui.html
- Web project: font-page code are in `web` dir, and you need upload these files(html,js,css) into your CDN

Don't forget to replace the html url with your CDN address.

![](https://figma-plugin-template-1307850796.cos.ap-beijing.myqcloud.com/replace-your-cdn.png)

Your entrance page will be here, check it.

![](https://figma-plugin-template-1307850796.cos.ap-beijing.myqcloud.com/check-cdn.png)


> If you need to customize the build process, [rspack doc](https://rspack.dev/) and [esbuild doc](https://esbuild.github.io/) will be helpful.

## Publish

- First publish: All you need is drop `dist/web` to your cdn, and check the effect in the development environment.

- Subsequent publish: like first time, or you can automate this process through CI, depending on the code management tool or pipeline you use (Github, Gitlab, Jenkins, and so on)

## Performance

You can choose any one of the following, or use a combination of

- [Rsdoctor](https://rspack.dev/zh/guide/optimization/use-rsdoctor): `npm run build:rsdoctor`

![](https://figma-plugin-template-1307850796.cos.ap-beijing.myqcloud.com/rsdoctor.png)

- [webpack-bundle-analyzer](https://rspack.dev/zh/guide/optimization/analysis#webpack-bundle-analyzer): `npm run build:analyze`

![](https://figma-plugin-template-1307850796.cos.ap-beijing.myqcloud.com/webpack-bundle-analyzer.png)


## Thanks

- JSON rpc work is inspired by [figma-JSONRPC](https://github.com/Lona/figma-jsonrpc/tree/master)