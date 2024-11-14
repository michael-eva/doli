import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React chunks
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "react-core";
          }

          // Router related
          if (id.includes("react-router") || id.includes("react-router-dom")) {
            return "router";
          }

          // Supabase related
          if (id.includes("@supabase/")) {
            return "supabase";
          }

          // UI Components and utilities
          if (
            id.includes("react-icons") ||
            id.includes("react-hot-toast") ||
            id.includes("react-share")
          ) {
            return "ui-components";
          }

          // Third party utilities
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
    },
    // Increase the warning limit if needed
    chunkSizeWarningLimit: 600,
  },
});
