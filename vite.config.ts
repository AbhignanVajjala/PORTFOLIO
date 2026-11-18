import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { prerenderPortfolio } from "./prerender";

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderPortfolio()],
});
