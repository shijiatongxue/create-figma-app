
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ["./src/index"],
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: true,
    }
  }
});