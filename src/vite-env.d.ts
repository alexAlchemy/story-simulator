/// <reference types="vite/client" />

declare module "alpinejs" {
  const Alpine: {
    data: (name: string, callback: (...args: any[]) => unknown) => void;
    start: () => void;
  };

  export default Alpine;
}
