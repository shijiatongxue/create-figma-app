export interface JsonRpcOptions {
  target?: Window | null;
  targetOrigin?: string;
  /** millisecond, default 3000  */
  timeout?: number;
  transformMessage?: (message: Record<string, any>) => Record<string, any>;
  /**
   * custom post message
   *
   * if passing postmessage, target and target origin is not required
   */
  postmessage?: (message: any) => void;
}

export type PendingCallback = {
  (err: any, result: any): void;
  timeout: number;
};

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
