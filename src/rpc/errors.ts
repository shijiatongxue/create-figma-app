export class ParseError extends Error {
  data: any;
  statusCode: number;

  constructor(data: any) {
    super('Parse error');
    this.data = data;
    this.statusCode = -32700;
  }
}

export class InvalidRequest extends Error {
  data: any;
  statusCode: number;

  constructor(data: any) {
    super('Invalid Request');
    this.data = data;
    this.statusCode = -32600;
  }
}

export class MethodNotFound extends Error {
  data: any;
  statusCode: number;

  constructor(data: any) {
    super('Method not found');
    this.data = data;
    this.statusCode = -32601;
  }
}

export class InvalidParams extends Error {
  data: any;
  statusCode: number;

  constructor(data: any) {
    super('Invalid params');
    this.data = data;
    this.statusCode = -32602;
  }
}

export class InternalError extends Error {
  data: any;
  statusCode: number;

  constructor(data: any) {
    super('Internal error');
    this.data = data;
    this.statusCode = -32603;
  }
}
