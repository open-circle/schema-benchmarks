import type { ReactNode } from "react";
import { useEffect, useState, useMemo } from "react";
import bem from "react-bem-helper";
import { createRequiredContext } from "required-react-context";

import type { DateInput } from "#/shared/components/date";
import { DateDisplay } from "#/shared/components/date";

const cls = bem("timeline");

interface IntersectionObserverContext {
  intersectionObserver: IntersectionObserver | null;
  mostIntersecting: IntersectionObserverEntry | null;
}

const { useIntersectionObserver, IntersectionObserverProvider } =
  createRequiredContext<IntersectionObserverContext>().with({
    name: "intersectionObserver",
    providerProp: "value",
  });

export function Timeline({ children }: { children: ReactNode }) {
  const [mostIntersecting, setMostIntersecting] = useState<IntersectionObserverEntry | null>(null);
  const [entriesByTarget] = useState(() => new Map<Element, IntersectionObserverEntry>());
  const [intersectionObserver, setIntersectionObserver] = useState<IntersectionObserver | null>(
    null,
  );
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entriesByTarget.set(entry.target, entry);
        }

        const mostIntersecting = Array.from(entriesByTarget.values()).reduceRight(
          (mostIntersecting, entry) =>
            entry.intersectionRatio > mostIntersecting.intersectionRatio ? entry : mostIntersecting,
        );

        setMostIntersecting(mostIntersecting);
      },
      {
        root: document.getElementById("scroll-container"),
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    setIntersectionObserver(intersectionObserver);
    return () => {
      intersectionObserver?.disconnect();
    };
  }, [entriesByTarget]);
  const contextValue = useMemo(
    (): IntersectionObserverContext => ({ intersectionObserver, mostIntersecting }),
    [intersectionObserver, mostIntersecting],
  );
  return (
    <IntersectionObserverProvider value={contextValue}>
      <ol {...cls()}>{children}</ol>
    </IntersectionObserverProvider>
  );
}

export interface TimelineItemProps {
  date: DateInput;
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}

export function TimelineItem({ date, icon, title, subtitle, children }: TimelineItemProps) {
  const [ref, setRef] = useState<HTMLLIElement | null>(null);
  const { intersectionObserver, mostIntersecting } = useIntersectionObserver();
  useEffect(() => {
    if (!intersectionObserver || !ref) return;
    intersectionObserver.observe(ref);
    return () => {
      intersectionObserver.unobserve(ref);
    };
  }, [ref, intersectionObserver]);
  return (
    <li
      {...cls({ element: "item", modifiers: { intersecting: mostIntersecting?.target === ref } })}
      ref={setRef}
    >
      <div {...cls({ element: "container" })}>
        {!!icon && <div {...cls({ element: "icon" })}>{icon}</div>}
        <hgroup {...cls("header")}>
          <p {...cls({ element: "date", extra: "typo-caption" })}>
            <DateDisplay date={date} />
          </p>
          <h3 {...cls({ element: "title", extra: "typo-headline5" })}>{title}</h3>
          {!!subtitle && (
            <p {...cls({ element: "subtitle", extra: "typo-subtitle2" })}>{subtitle}</p>
          )}
        </hgroup>
        <div {...cls({ element: "body" })}>{children}</div>
      </div>
    </li>
  );
}
