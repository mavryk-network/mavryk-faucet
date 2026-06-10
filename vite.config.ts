import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import pkgJson from "./package.json"

const isDevelopment = (mode) => mode === "development"

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  build: {
    outDir: "build",
    sourcemap: isDevelopment(mode) || "hidden",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes("node_modules") ? "vendor" : null),
      },
      external: ["virtual:terminal"],
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  plugins: [
    react(),
    // In dev, let console.log go to terminal and console output. `console` arg
    // for vite-plugin-terminal doesn't work . See this issue.
    // https://github.com/patak-dev/vite-plugin-terminal/issues/23
    ...[
      isDevelopment(mode) &&
        (await import("vite-plugin-terminal")).default({
          output: ["terminal", "console"],
        }),
    ],
  ],
  define: {
    "import.meta.env.APP_DESCRIPTION": JSON.stringify(pkgJson.description),
    "import.meta.env.APP_VERSION": JSON.stringify(pkgJson.version),
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      util: "rollup-plugin-node-polyfills/polyfills/util",
      process: "rollup-plugin-node-polyfills/polyfills/process-es6",
      // http: "rollup-plugin-node-polyfills/polyfills/http",
      // https: "rollup-plugin-node-polyfills/polyfills/http",
      // zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
    },
  },
}))
