import { createRpcApi } from '../../rpc/index';
import handlers from './handlers';

/**
 * sandbox.js 是真正需要编写 figma sandbox 代码的地方，你可以在这里
 *
 * - 使用 figma 的 api
 * - 编写供 ui 面板调用的 rpc handlers
 */

createRpcApi({
  postmessage: (message: unknown) =>
    figma.ui.postMessage(message, { origin: '*' }),
  onmessage: (handler) => {
    figma.ui.onmessage = (message) => {
      console.log('sandbox message', message);
      handler(message);
    };
  },
  rpcMethods: handlers,
});

// 编写全局的监听函数也是可以的
figma.on('selectionchange', () => {
  console.log('selectionchange');
});

export type { SandboxHandlers } from './handlers';
