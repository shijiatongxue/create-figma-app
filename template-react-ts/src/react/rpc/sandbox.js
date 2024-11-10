"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // node_modules/.pnpm/jsonrpc-over-postmessage@0.0.2/node_modules/jsonrpc-over-postmessage/dist/errors.js
  var InvalidRequest = class extends Error {
    constructor(data) {
      super("Invalid Request");
      this.data = data;
      this.statusCode = -32600;
    }
  };
  var MethodNotFound = class extends Error {
    constructor(data) {
      super("Method not found");
      this.data = data;
      this.statusCode = -32601;
    }
  };

  // node_modules/.pnpm/jsonrpc-over-postmessage@0.0.2/node_modules/jsonrpc-over-postmessage/dist/rpc.js
  var rpcIndex = 0;
  var pending = {};
  function sendRaw(message) {
    const { target, targetOrigin, transformMessage, postmessage } = config;
    const raw = transformMessage ? transformMessage(message) : message;
    if (typeof postmessage === "function") {
      postmessage(raw);
    } else {
      target === null || target === void 0 ? void 0 : target.postMessage(raw, targetOrigin);
    }
  }
  function sendJson(json) {
    try {
      sendRaw(json);
    } catch (e) {
      console.error(e);
    }
  }
  function sendRequest(method, params) {
    const { timeout } = config;
    return new Promise((resolve, reject) => {
      const id = rpcIndex;
      rpcIndex += 1;
      const callback = (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      };
      callback.timeout = setTimeout(() => {
        delete pending[id];
        reject(new Error("Request " + method + " timed out."));
      }, timeout);
      pending[id] = callback;
      sendJson({
        jsonrpc: "2.0",
        method,
        params,
        id
      });
    });
  }
  function sendResult(id, result) {
    sendJson({
      jsonrpc: "2.0",
      id,
      result
    });
  }
  function sendError(id, error) {
    const errorObject = {
      code: error.code,
      message: error.message,
      data: error.data
    };
    sendJson({
      jsonrpc: "2.0",
      id,
      error: errorObject
    });
  }
  function handleRaw(raw) {
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
  function handleRequest(json) {
    if (!json.method) {
      sendError(json.id, new InvalidRequest("Missing method"));
      return;
    }
    try {
      const result = onRequest(json.method, json.params);
      if (result && typeof result.then === "function") {
        result.then((res) => sendResult(json.id, res)).catch((err) => sendError(json.id, err));
      } else {
        sendResult(json.id, result);
      }
    } catch (err) {
      sendError(json.id, err);
    }
  }
  function handleRpc(json) {
    const { id, result, error, method } = json;
    if (typeof id !== "undefined") {
      if (typeof result !== "undefined" || error || typeof method === "undefined") {
        const callback = pending[id];
        if (!callback) {
          sendError(id, new InvalidRequest("Missing callback for " + json.id));
          return;
        }
        if (callback.timeout) {
          clearTimeout(callback.timeout);
        }
        delete pending[id];
        callback(error, result);
      } else {
        handleRequest(json);
      }
    } else {
      handleNotification(json);
    }
  }
  function onRequest(method, params) {
    const { rpcMethods } = config;
    if (!rpcMethods[method]) {
      throw new MethodNotFound(method);
    }
    return rpcMethods[method](...params);
  }
  function handleNotification(json) {
    if (!json.method) {
      return;
    }
    onRequest(json.method, json.params);
  }

  // node_modules/.pnpm/jsonrpc-over-postmessage@0.0.2/node_modules/jsonrpc-over-postmessage/dist/config.js
  var config = {
    target: null,
    targetOrigin: "*",
    rpcMethods: {},
    timeout: 6e4
  };
  function initConfig(options) {
    const { onmessage } = options;
    Object.assign(config, options);
    if (typeof onmessage === "function") {
      onmessage(handleRaw);
    }
  }

  // node_modules/.pnpm/jsonrpc-over-postmessage@0.0.2/node_modules/jsonrpc-over-postmessage/dist/proxy.js
  function createApiProxy() {
    const target = {
      sendRequest
    };
    const proxy = new Proxy(target, {
      get: function(target2, prop) {
        if (prop === "sendRequest") {
          return target2[prop].bind(target2);
        } else {
          return (...params) => target2.sendRequest(prop, params);
        }
      }
    });
    return proxy;
  }

  // node_modules/.pnpm/jsonrpc-over-postmessage@0.0.2/node_modules/jsonrpc-over-postmessage/dist/index.js
  var createRpcApi = (options) => {
    initConfig(options);
    return createApiProxy();
  };

  // src/sandbox/code/handlers.ts
  var codeHandlers = {
    executeScript: (content) => {
      try {
        new Function(content)();
      } catch (e) {
        console.error(e);
      }
    },
    executeScriptURL: async (url) => {
      const result = await fetch(url);
      const { status, statusText } = result;
      if (status === 200) {
        const content = await result.text();
        codeHandlers.executeScript(content);
        return {
          url,
          status,
          statusText,
          message: `sandbox ${url} \u6CE8\u518C\u6210\u529F`
        };
      } else {
        return {
          url,
          status,
          statusText,
          message: `sandbox ${url} \u6CE8\u518C\u5931\u8D25`
        };
      }
    }
  };

  // src/sandbox/sandbox/handlers.ts
  function createRectangles(count) {
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
  var handlers = __spreadProps(__spreadValues({}, codeHandlers), {
    createRectangles
  });
  var handlers_default = handlers;

  // src/sandbox/sandbox/index.ts
  var uiApi = createRpcApi({
    postmessage: (message) => figma.ui.postMessage(message, { origin: "*" }),
    onmessage: (handler) => {
      figma.ui.onmessage = (message) => {
        console.log("code message", message);
        handler(message);
      };
    },
    rpcMethods: handlers_default
  });
  figma.on("selectionchange", () => {
    const _selection = figma.currentPage.selection;
    const selection = _selection.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type
    }));
    console.log("selectionchange", selection);
    uiApi.handleSelectionChange(selection);
  });
})();
