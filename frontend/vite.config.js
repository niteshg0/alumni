import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Load environment variables
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy:{
        // "/api/":`http://localhost:${env.VITE_BACKEND_PORT}`

         "/api/": {
          target: env.VITE_BACKEND_URL, // New backend URL
          changeOrigin: true,
          secure: true, // Enable if backend uses HTTPS
        },
        
      },
      port: parseInt(env.VITE_PORT) || 5173 // Read from .env, fallback to 5173
    },
  };
});

