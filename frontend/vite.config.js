import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),

    // Optional: compress images during build
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.9], speed: 4 },
      svgo: {},
      webp: { quality: 75 },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",       // modern browsers
    outDir: "dist",
    sourcemap: false,       // disable source maps in prod
    minify: "esbuild",      // very fast minification
    cssCodeSplit: true,     // split CSS per chunk
    rollupOptions: {
      output: {
        // Optimize chunks
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? "")) return "assets/css/[name]-[hash][extname]";
          if (/\.(png|jpe?g|webp|gif|svg)$/.test(name ?? "")) return "assets/images/[name]-[hash][extname]";
          return "assets/[name]-[hash][extname]";
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Split vendor code into separate chunk
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));
