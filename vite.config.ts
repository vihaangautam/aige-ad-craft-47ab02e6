import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import open from "open"; 

// Plugin to open /auth on dev server start
const openAuthOnStart = () => {
  return {
    name: "vite-plugin-open-auth",
    configureServer(server: any) {
      server.httpServer?.once("listening", () => {
        const address = server.httpServer?.address();
        const port = typeof address === "object" && address?.port;
        if (port) {
          const url = `http://localhost:${port}/auth`;
          open(url);
        }
      });
    },
  };
};

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && openAuthOnStart(), // 👈 Add this only in dev
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  preview: {
    port: 8080,
    host: "::",
  },
}));
