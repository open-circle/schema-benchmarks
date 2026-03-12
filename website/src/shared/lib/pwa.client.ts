import { registerSW } from "virtual:pwa-register";

export const updateSW = registerSW({
  immediate: true,
  onRegisterError: console.error,
});
