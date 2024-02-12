import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { name as PKG_NAME } from "./package.json";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      cleanVueFileName: true,
    }),
  ],
  build: {
    lib: {
      name: PKG_NAME,
      fileName: "index",
      entry: resolve(dirname(fileURLToPath(import.meta.url)), "src/index.ts"),
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
