import { createRpcApi } from 'jsonrpc-over-postmessage';

import { CodeHandlers } from '../../react/rpc/handlers';
import handlers from './handlers';

/**
 * sandbox.js 是真正需要编写 figma sandbox 代码的地方，你可以在这里
 *
 * - 使用 figma 的 api
 * - 编写供 ui 面板调用的 rpc handlers
 */
const uiApi = createRpcApi<CodeHandlers>({
  postmessage: (message: unknown) =>
    figma.ui.postMessage(message, { origin: '*' }),
  onmessage: (handler) => {
    figma.ui.onmessage = (message) => {
      console.log('code message', message);
      handler(message);
    };
  },
  rpcMethods: handlers,
});

/**
 * 监听 figma 选中元素的变化
 * 调用 uiApi
 */
figma.on('selectionchange', () => {
  const _selection = figma.currentPage.selection;
  const selection = _selection.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
  }));
  console.log('selectionchange', selection);
  uiApi.handleSelectionChange(selection);
});

export type { SandboxHandlers } from './handlers';
