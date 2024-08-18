import { sendRequest } from './rpc';

export function createApiProxy() {
  const target = {
    sendRequest,
  };
  const proxy = new Proxy(target, {
    get: function (target, prop: string) {
      if (prop === 'sendRequest') {
        return target[prop].bind(target);
      } else {
        return (...params: any[]) => target.sendRequest(prop, params);
      }
    },
  });
  return proxy;
}
