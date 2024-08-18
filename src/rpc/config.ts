import { JsonRpcOptions } from './interface';

const config: JsonRpcOptions & {
  methods: Record<string, (...args: any[]) => any>;
} = {
  target: null,
  methods: {},
  targetOrigin: '*',
  timeout: 3000,
};

export function initConfig(options: JsonRpcOptions) {
  Object.assign(config, options);
}

export { config };
