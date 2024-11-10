import { createRpcApi } from 'jsonrpc-over-postmessage';

import { SandboxHandlers } from '@sandbox/sandbox';
import manifest from '../../../manifest.json';
import { getSandboxContent } from '../utils';
// @ts-ignore ignore
import sandbox from './sandbox.js';

/**
 * ui rpc 文件负责以下事情
 *
 * - 创建一个接收 postMessage 的监听器
 * - 通过 rpc 包将 postMessage 包装为 rpc 方法
 * - 通过调用 code.js 的 executeScriptURL 注册 sandbox.js
 */

export const sandboxApi = createRpcApi<SandboxHandlers>({
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

// 注册 sandbox.js
export const registerSandboxApi = async () => {
  const sandboxContent = await getSandboxContent(sandbox);
  if (sandboxContent) {
    return sandboxApi.executeScript(sandboxContent);
  }
};
