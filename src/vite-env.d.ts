/// <reference types="vite/client" />

declare module "alpinejs" {
  const Alpine: {
    start: () => void;
  };

  export default Alpine;
}
