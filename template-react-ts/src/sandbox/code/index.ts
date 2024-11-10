import { createRpcApi } from 'jsonrpc-over-postmessage';

import { codeHandlers } from './handlers';

/**
 * code.js 是 figma sandbox 的入口 js 文件，这个文件做了以下事情
 *
 * - 展示 ui 面板
 * - 初始化一个 rpc handlers，包含 executeScript 和 executeScriptURL 方法
 */

figma.showUI(__html__);

createRpcApi({
  postmessage: (message: unknown) =>
    figma.ui.postMessage(message, { origin: '*' }),
  onmessage: (handler) => {
    figma.ui.onmessage = (message) => {
      console.log('code message', message);
      handler(message);
    };
  },
  rpcMethods: codeHandlers,
});
