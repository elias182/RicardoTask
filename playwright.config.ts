import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    // Aquí puedes establecer la configuración de los navegadores, como si deseas que se ejecute en Chromium, Firefox, WebKit, etc.
    browserName: "chromium", // Puedes usar 'firefox' o 'webkit' también
    headless: true, // Ejecutar sin abrir una ventana del navegador (modo headless)
    baseURL: "http://localhost:3000", // La URL base donde está corriendo tu app de React
  },
});
