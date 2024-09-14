import manifest from '../../manifest.json';
import { createRpcApi } from '../rpc';
import { Handlers } from '../sandbox/index';

export const sandboxApi = createRpcApi<Handlers>({
  target: parent,
  transformMessage: (message: unknown) => {
    return {
      pluginMessage: message,
      pluginId: manifest.id,
    };
  },
  onmessage: (handler) => {
    window.onmessage = (event) => {
      handler(event.data.pluginMessage);
    };
  },
});

export {};
