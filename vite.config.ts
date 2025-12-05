import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@services": path.resolve(__dirname, "src/services"),
      "@types": path.resolve(__dirname, "src/types"),
      "@app": path.resolve(__dirname, "src/app"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@controllers": path.resolve(__dirname, "src/controllers"),
      "@models": path.resolve(__dirname, "src/models"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@databases": path.resolve(__dirname, "src/databases"),
      "@middlewares": path.resolve(__dirname, "src/middlewares")
    }
  }
});
