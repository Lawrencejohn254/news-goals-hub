import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    // Live site is on Vercel (dispatch-nu-seven.vercel.app) — confirmed from
    // the deployed robots.txt. Swap this string if you move hosts later
    // (e.g. "cloudflare-module", "node-server", "bun").
    nitro({ preset: "vercel" }),
  ],
  resolve: {
    // Prevents duplicate React/router instances if any dependency bundles
    // its own copy — cheap safety net, standard practice.
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
  
});