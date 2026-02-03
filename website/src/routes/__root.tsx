import { MDXProvider } from "@mdx-js/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { create } from "mutative";
import { ssrBehavior } from "react-md-spinner";
import { generateMetadata } from "tanstack-meta";
import { Banner } from "#/shared/components/banner";
import { ConfirmDialog } from "#/shared/components/dialog/confirm";
import { Footer } from "#/shared/components/footer";
import { Header } from "#/shared/components/header";
import * as mdxComponents from "#/shared/components/mdx";
import { ScrollToTop } from "#/shared/components/scroll-to-top";
import { Sidebar } from "#/shared/components/sidebar";
import { SidebarProvider } from "#/shared/components/sidebar/context";
import { Snackbars } from "#/shared/components/snackbar";
import appCss from "#/shared/styles/index.css?url";
import { symbolsUrl } from "../../vite/symbols";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () =>
    create(
      generateMetadata({
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
            },
            {
              url: "/favicon_light.ico",
              media: "(prefers-color-scheme: light)",
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
      }),
      ({ links }) => {
        links.push(
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
            href: "https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&family=Google+Sans+Flex:opsz,slnt,wdth,wght,GRAD,ROND@6..144,-10..0,25..151,1..1000,0..100,0..100&display=swap",
          },
          {
            rel: "stylesheet",
            href: symbolsUrl,
          },
        );
      },
    ),
  staticData: { crumb: "Benchmarks" },
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {ssrBehavior.getStylesheetComponent()}
      </head>
      <body>
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
