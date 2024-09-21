# figma-plugin-template

A figma template using React, Typescript, JSON RPC.

<img width="1728" alt="image" src="https://github.com/user-attachments/assets/07858825-23be-46e7-b723-b0da8cdf0cc9">

## Install

```bash
pnpm install
```

## Development

```bash
npm run dev
```

- we use [rspack](https://rspack.dev/) to bundle web project
- we use [esbuild](https://esbuild.github.io/) to bundle sandbox code

## Build

```bash
npm run build
```

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

<img width="1728" alt="image" src="https://github.com/user-attachments/assets/99f722e8-451d-4e24-9828-c9abcedf6cbb">

## One more thing

We use JSON rpc with typings, so that we can know each interface.

- before

```typescript
// plugin ui postmessage to sandbox code
parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
```

```typescript
// sandbox code listen and do sothing
figma.ui.onmessage = (msg: { type: string, count: number }) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }] as any;
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
```

- after

```typescript
// plugin ui call codeApi by JSON rpc
codeApi.createRectangles(count);
```

```typescript
// sandbox code declare handler
function createRectangles(count: number) {
  const nodes: SceneNode[] = [];
  for (let i = 0; i < count; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }] as any;
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}
// other handlers

const handlers = {
  createRectangles,
};

export default handlers;
```

And we don't have to bundle plugin api's handlers to code api or vice versa using [Proxy](./src/rpc/proxy.ts)！

## Thanks

- JSON rpc work is inspired by [figma-JSONRPC](https://github.com/Lona/figma-jsonrpc/tree/master)