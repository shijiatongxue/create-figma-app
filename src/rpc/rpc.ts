import { JsonData, PendingCallback } from './interface';
import { config } from './config';
import * as RPCError from './errors';

let rpcIndex = 0;
let pending: Record<string, PendingCallback> = {};

function sendRaw(message: any) {
  const { target, targetOrigin, transformMessage, postmessage } = config;
  const raw = transformMessage ? transformMessage(message) : message;
  postmessage ? postmessage(raw) : target?.postMessage(raw, targetOrigin as string);
}

function sendJson(json: JsonData) {
  try {
    sendRaw(json);
  } catch (e) {
    console.error(e);
  }
}

export function sendRequest(method: string, params?: any[]) {
  const { timeout } = config;
  return new Promise((resolve, reject) => {
    const id = rpcIndex;
    rpcIndex += 1;
    const callback: PendingCallback = (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
    callback.timeout = setTimeout(() => {
      delete pending[id];
      reject(new Error('Request ' + method + ' timed out.'));
    }, timeout);
    pending[id] = callback;
    sendJson({
      jsonrpc: '2.0',
      method,
      params,
      id,
    });
  });
}

function sendResult(id: number, result: any) {
  sendJson({
    jsonrpc: '2.0',
    id,
    result,
  });
}

function sendError(id: number, error: any) {
  const errorObject = {
    code: error.code,
    message: error.message,
    data: error.data,
  };
  sendJson({
    jsonrpc: '2.0',
    id,
    error: errorObject,
  });
}

export function handleRaw(raw: any) {
  try {
    if (!raw) {
      return;
    } else {
      handleRpc(raw);
    }
  } catch (err) {
    console.error(err);
    console.error(raw);
  }
}

function handleRequest(json: JsonData) {
  if (!json.method) {
    sendError(json.id, new RPCError.InvalidRequest('Missing method'));
    return;
  }
  try {
    const result = onRequest(json.method, json.params);
    if (result && typeof result.then === 'function') {
      result.then((res: a) => sendResult(json.id, res)).catch((err) => sendError(json.id, err));
    } else {
      sendResult(json.id, result);
    }
  } catch (err) {
    sendError(json.id, err);
  }
}

function handleRpc(json: JsonData) {
  const { id, result, error, method } = json;
  if (typeof id !== 'undefined') {
    // json result
    if (typeof result !== 'undefined' || error || typeof method === 'undefined') {
      const callback = pending[id];
      if (!callback) {
        sendError(id, new RPCError.InvalidRequest('Missing callback for ' + json.id));
        return;
      }
      if (callback.timeout) {
        clearTimeout(callback.timeout);
      }
      delete pending[id];
      callback(error, result);
    } else {
      // json call
      handleRequest(json);
    }
  } else {
    handleNotification(json);
  }
}

function onRequest(method, params) {
  const { methods } = config;
  if (!methods[method]) {
    throw new RPCError.MethodNotFound(method);
  }
  return methods[method](...params);
}

function handleNotification(json: JsonData) {
  if (!json.method) {
    return;
  }
  onRequest(json.method, json.params);
}
