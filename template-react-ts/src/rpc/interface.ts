export interface JsonRpcOptions {
  /** 发送 postmessage 的 target  */
  target?: Window | null;
  /** 限制发送的 target 的域，默认是 *  */
  targetOrigin?: string;
  /** 从发送到接收响应的超时时间，单位毫秒，默认 60000  */
  timeout?: number;
  /**
   * 把发送的消息进行封装后发送
   */
  transformMessage?: (message: Record<string, any>) => Record<string, any>;
  /**
   * 自定义 postmessage 方法
   *
   * 如果传入了 postmessage，则不需要传入 target 和 targetOrigin
   */
  postmessage?: (message: any) => void;
  /**
   * 接收 post message 的处理函数
   */
  onmessage?: (handler: (json: JsonData) => void) => void;
  /**
   * 提供给远程调用的函数
   */
  rpcMethods?: Record<string, (...args: any[]) => any>;
}

export interface JsonData {
  jsonrpc: '2.0';
  id?: number;
  method?: string;
  params?: any[];
  result?: any;
  error?: {
    code: number | undefined;
    message: string | undefined;
    data: any;
  };
}
