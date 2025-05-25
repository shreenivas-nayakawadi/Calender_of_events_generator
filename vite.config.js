import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
      base: "/Calender_of_events_generator/",
      plugins: [react()],
});
