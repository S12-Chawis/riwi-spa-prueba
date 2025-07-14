import { defineConfig } from "vite"

export default defineConfig({
  // Configuración básica de Vite
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
})
