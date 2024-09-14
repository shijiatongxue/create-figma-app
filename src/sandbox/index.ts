import { createRpcApi } from '../rpc/index';
import handlers, { Handlers } from './handlers';

export type { Handlers };

figma.showUI(__html__);

createRpcApi({
  postmessage: (message: unknown) =>
    figma.ui.postMessage(message, { origin: '*' }),
  onmessage: (handler) => {
    figma.ui.onmessage = (message) => {
      handler(message);
    };
  },
  rpcMethods: handlers,
});
