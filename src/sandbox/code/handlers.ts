export const codeHandlers = {
  executeScript: (content: string) => {
    try {
      new Function(content)();
    } catch (e: unknown) {
      console.error(e);
    }
  },
  executeScriptURL: async (url: string) => {
    const result = await fetch(url);
    const { status, statusText } = result;
    if (status === 200) {
      const content = await result.text();
      codeHandlers.executeScript(content);
      return {
        url,
        status,
        statusText,
        message: `sandbox ${url} 注册成功`,
      };
    } else {
      return {
        url,
        status,
        statusText,
        message: `sandbox ${url} 注册失败`,
      };
    }
  },
};

export type CodeHandlers = typeof codeHandlers;
