import { JsonRpcOptions, JsonData } from './interface';
import { createApiProxy } from './proxy';
import { handleRaw } from './rpc';
import { initConfig, config } from './config';

/**
 * create a rpc api object
 */
export const createRpcApi = <T extends Record<string, (...args: any[]) => any>>(options: JsonRpcOptions) => {
  initConfig(options);
  return createApiProxy() as unknown as T;
};

export const createRpcHandler = (options: {
  /**
   * you should listen message based on your environment
   */
  onmessage: (handler: (json: JsonData) => void) => void;
  /**
   * when received a rpc call, will call local method automatically
   */
  localMethods: Record<string, (...args: any[]) => any>;
}) => {
  const { onmessage, localMethods } = options;
  config.methods = localMethods;
  onmessage(handleRaw);
};
