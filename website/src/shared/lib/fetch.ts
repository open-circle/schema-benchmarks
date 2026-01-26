import { createIsomorphicFn } from "@tanstack/react-start";
import { up } from "up-fetch";

export const upfetch = up(fetch);

export const preloadImage = createIsomorphicFn()
  .client(
    (src: string) =>
      new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve());
        image.addEventListener("error", (e) => reject(e.message));
        image.src = src;
      }),
  )
  .server(() => Promise.resolve());
