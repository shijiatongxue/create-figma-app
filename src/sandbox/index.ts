import { createRpcHandler, createRpcApi } from '../rpc/index';
import handlers, { Handlers } from './handlers';

export type { Handlers };

figma.showUI(__html__);

createRpcHandler({
  onmessage: (handler) => {
    figma.ui.onmessage = (message) => {
      handler(message);
    };
  },
  localMethods: handlers,
});

export const uiApi = createRpcApi<{}>({
  postmessage: (message: any) => figma.ui.postMessage(message, { origin: '*' }),
});
