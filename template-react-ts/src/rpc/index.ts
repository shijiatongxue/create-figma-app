import { initConfig } from './config';
import { JsonRpcOptions } from './interface';
import { createApiProxy } from './proxy';

/**
 * create a rpc api object
 */
export const createRpcApi = <T extends Record<string, (...args: any[]) => any>>(
  options: JsonRpcOptions
) => {
  initConfig(options);
  return createApiProxy() as unknown as T;
};
