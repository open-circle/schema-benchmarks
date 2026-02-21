import { MDXProvider } from "@mdx-js/react";
import { promiseAllKeyed } from "@schema-benchmarks/utils";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { generateMetadata } from "tanstack-meta";

import { Banner } from "#/shared/components/banner";
import { ConfirmDialog } from "#/shared/components/dialog/confirm";
import { Footer } from "#/shared/components/footer";
import { Header } from "#/shared/components/header";
import * as mdxComponents from "#/shared/components/mdx";
import { StyleProvider, ThemeProvider } from "#/shared/components/prefs/provider";
import { ScrollToTop } from "#/shared/components/scroll-to-top";
import { Sidebar } from "#/shared/components/sidebar";
import { SidebarProvider } from "#/shared/components/sidebar/context";
import { Snackbars } from "#/shared/components/snackbar";
import { getStyleFn, getThemeFn } from "#/shared/lib/prefs";

import { symbolsUrl } from "../../vite/symbols";

import appCss from "#/shared/styles/index.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => {
    const { meta, links } = generateMetadata({
      charSet: "utf-8",
      viewport: {
        width: "device-width",
        initialScale: 1,
        themeColor: [
          { color: "#eff1f3", media: "(prefers-color-scheme: light)" },
          { color: "#21222c", media: "(prefers-color-scheme: dark)" },
        ],
      },
      icons: {
        icon: [
          {
            url: "/favicon_dark.ico",
            media: "(prefers-color-scheme: dark)",
            sizes: "any",
          },
          {
            url: "/favicon_light.ico",
            media: "(prefers-color-scheme: light)",
            sizes: "any",
          },
          {
            url: "/icon_dark.svg",
            media: "(prefers-color-scheme: dark)",
            type: "image/svg+xml",
          },
          {
            url: "/icon_light.svg",
            media: "(prefers-color-scheme: light)",
            type: "image/svg+xml",
          },
        ],
      },
    });
    return {
      meta,
      links: [
        ...links,
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: symbolsUrl,
        },
      ],
      scripts: [
        // umami tracking script
        {
          async: true,
          src: "https://umami.schemabenchmarks.dev/script.js",
          "data-website-id": "dac94c70-edd1-411e-9eb4-cbc36e228435",
          "data-domains": "schemabenchmarks.dev",
          "data-strip-search": "true",
        },
      ],
    };
  },
  staticData: { crumb: undefined },

  loader: () => promiseAllKeyed({ theme: getThemeFn(), style: getStyleFn() }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme, style } = Route.useLoaderData();
  return (
    <html lang="en" data-theme={theme} data-style={style} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <StyleProvider style={style}>
            <MDXProvider components={mdxComponents}>
              <div className="sidebar-container">
                <SidebarProvider>
                  <Sidebar />
                  <div className="header-container">
                    <Header />
                    <Banner />
                    <main>{children}</main>
                    <Footer />
                    <ScrollToTop />
                    <Snackbars />
                    <ConfirmDialog />
                  </div>
                </SidebarProvider>
              </div>
            </MDXProvider>
          </StyleProvider>
        </ThemeProvider>
        <TanStackDevtools
          config={{
            triggerHidden: true,
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
