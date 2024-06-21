import { defineConfig } from "tsup";
import { peerDependencies } from "./package.json";
import vue from "unplugin-vue/esbuild";

export default defineConfig({
  entry: ["src/**/*.(ts|js|vue)"],
  format: ["esm", "cjs"],
  target: "node18",
  bundle: true,
  // Handled by vue-tsc
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  external: [...Object.keys(peerDependencies)],
  tsconfig: "tsconfig.json",
  esbuildPlugins: [vue()],
  publicDir: true,
});
