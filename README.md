
# create-figma-app [![NPM Version](https://img.shields.io/npm/v/create-figma-app)](https://www.npmjs.com/package/create-figma-app) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

Quick create a [Figma plugin app](https://www.figma.com/plugin-docs/).

## Usage

```bash
# npm 
# my-figma-app is project dir name
npm create figma-app@latest my-figma-app

# pnpm
pnpm create figma-app@latest my-figma-app
```

## Current supported template


### react-ts

- using react、tailwind、typescript、rspack

It has the following advantages:

- Simplify postmessage communication between ui and sandbox
- Sandbox is published together with ui, no need to publish sandbox in Figma
- Good TypeScript type definition, ui and sandbox know each other's function interface
- Extremely small sandbox code size, only contains sandbox code

See [More about this template](./template-react-ts/README.md)

![](https://figma-plugin-template-1307850796.cos.ap-beijing.myqcloud.com/plugin-screenshot.png)

## Plugins using this template

- [Quick Replace Font](https://www.figma.com/community/plugin/1241949869279607046/quick-replace-font): Replace fonts with one click. used by 3.5k users.

![](https://site-1307850796.cos.ap-beijing.myqcloud.com/quick-replace-font.png)

## Contribution

See [CONTRIBUTING Guide](./CONTRIBUTING.md).

## License

[MIT](./LICENSE).