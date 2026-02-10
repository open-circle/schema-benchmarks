import type { QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { radEventListeners } from "rad-event-listeners";
import { up } from "up-fetch";

export interface PrefetchContext {
  queryClient: QueryClient;
  signal?: AbortSignal;
}

export const upfetch = up(fetch);

export const preloadImage = createIsomorphicFn()
  .client(
    (src: string) =>
      new Promise<void>((resolve, reject) => {
        const image = new Image();
        const unsub = radEventListeners(
          image,
          {
            load() {
              resolve();
              unsub();
            },
            error(event) {
              reject((event as ErrorEvent).error);
              unsub();
            },
          },
          { once: true },
        );
        image.src = src;
      }),
  )
  .server(() => Promise.resolve());

export const preloadImages = (sources: Iterable<string>) =>
  Promise.all(Array.from(sources, (src) => preloadImage(src)));
