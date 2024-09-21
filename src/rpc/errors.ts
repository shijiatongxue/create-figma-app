export class ParseError extends Error {
  data: unknown;
  statusCode: number;

  constructor(data: unknown) {
    super('Parse error');
    this.data = data;
    this.statusCode = -32700;
  }
}

export class InvalidRequest extends Error {
  data: unknown;
  statusCode: number;

  constructor(data: unknown) {
    super('Invalid Request');
    this.data = data;
    this.statusCode = -32600;
  }
}

export class MethodNotFound extends Error {
  data: unknown;
  statusCode: number;

  constructor(data: unknown) {
    super('Method not found');
    this.data = data;
    this.statusCode = -32601;
  }
}

export class InvalidParams extends Error {
  data: unknown;
  statusCode: number;

  constructor(data: unknown) {
    super('Invalid params');
    this.data = data;
    this.statusCode = -32602;
  }
}

export class InternalError extends Error {
  data: unknown;
  statusCode: number;

  constructor(data: unknown) {
    super('Internal error');
    this.data = data;
    this.statusCode = -32603;
  }
}
