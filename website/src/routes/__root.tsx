import { MDXProvider } from "@mdx-js/react";
import { promiseAllKeyed } from "@schema-benchmarks/utils";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { generateMetadata } from "tanstack-meta";
import { useRegisterSW } from "virtual:pwa-register/react";

import { Banner } from "#/shared/components/banner";
import { ConfirmDialog } from "#/shared/components/dialog/confirm";
import { PreferencesDialog } from "#/shared/components/dialog/pref";
import { Footer } from "#/shared/components/footer";
import { Header } from "#/shared/components/header";
import * as mdxComponents from "#/shared/components/mdx";
import { NpmSiteProvider, StyleProvider, ThemeProvider } from "#/shared/components/prefs/provider";
import { ScrollToTop } from "#/shared/components/scroll-to-top";
import { Sidebar } from "#/shared/components/sidebar";
import { SidebarProvider } from "#/shared/components/sidebar/context";
import { Snackbars } from "#/shared/components/snackbar";
import { getNpmSiteFn, getStyleFn, getThemeFn } from "#/shared/lib/prefs";

import { symbolsUrl } from "../../vite/symbols";

import appCss from "#/shared/styles/index.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: () =>
    promiseAllKeyed({ theme: getThemeFn(), style: getStyleFn(), npmSite: getNpmSiteFn() }),
  staticData: { crumb: undefined },

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
      manifest: "/manifest.webmanifest",
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
            url: "/logo_dark.svg",
            media: "(prefers-color-scheme: dark)",
            type: "image/svg+xml",
          },
          {
            url: "/logo_light.svg",
            media: "(prefers-color-scheme: light)",
            type: "image/svg+xml",
          },
        ],
        apple: {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
        },
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
          crossOrigin: "anonymous",
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
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme, style, npmSite } = Route.useLoaderData();
  useRegisterSW({ immediate: true });
  const [prefsOpen, setPrefsOpen] = useState(false);
  return (
    <html lang="en" data-theme={theme} data-style={style} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <StyleProvider style={style}>
            <NpmSiteProvider npmSite={npmSite}>
              <MDXProvider components={mdxComponents}>
                <div className="sidebar-container">
                  <SidebarProvider>
                    <Sidebar />
                    <div className="header-container" id="scroll-container">
                      <Header onPrefs={() => setPrefsOpen(true)} />
                      <Banner />
                      <main>{children}</main>
                      <Footer />
                      <ScrollToTop />
                      <Snackbars />
                      <ConfirmDialog />
                      <PreferencesDialog open={prefsOpen} onClose={() => setPrefsOpen(false)} />
                    </div>
                  </SidebarProvider>
                </div>
              </MDXProvider>
            </NpmSiteProvider>
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
