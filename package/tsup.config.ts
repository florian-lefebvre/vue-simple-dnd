import { defineConfig } from "tsup";
import { peerDependencies } from "./package.json";
import vue from "unplugin-vue/esbuild";
import { copyFile } from "node:fs/promises";

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
  onSuccess: async () => {
    await copyFile(
      new URL("./public/style.css", import.meta.url),
      new URL("./dist/style.css", import.meta.url)
    );
  },
});
