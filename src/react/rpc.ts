import { createRpcHandler, createRpcApi } from '../rpc';
import manifest from '../../manifest.json';
import { Handlers } from '../sandbox/index';

export const codeApi = createRpcApi<Handlers>({
  target: parent,
  targetOrigin: '*',
  transformMessage: (message: any) => {
    return {
      pluginMessage: message,
      pluginId: manifest.id,
    };
  },
});

createRpcHandler({
  onmessage: (handler) => {
    window.onmessage = (event) => {
      handler(event.data.pluginMessage);
    };
  },
  localMethods: {},
});
