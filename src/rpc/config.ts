import { JsonRpcOptions } from './interface';
import { handleRaw } from './rpc';

const config: JsonRpcOptions = {
  target: null,
  targetOrigin: '*',
  rpcMethods: {},
  timeout: 60000,
};

export function initConfig(options: JsonRpcOptions) {
  const { onmessage } = options;
  Object.assign(config, options);
  if (typeof onmessage === 'function') {
    onmessage(handleRaw);
  }
}

export { config };
