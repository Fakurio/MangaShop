import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [svelte()],
    server: {
      host: "0.0.0.0",
      port: parseInt(env.VITE_CLIENT_PORT || "8080"),
    },
    resolve: {
      alias: {
        $lib: path.resolve("./src/lib"),
      },
    },
  };
});
