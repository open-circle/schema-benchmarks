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
import { Banner } from "@/components/banner";
import { useSmallScreenBanner } from "@/components/banner/small-screen";
import { ConfirmDialog } from "@/components/dialog/confirm";
import { Footer } from "@/components/footer";
import * as mdxComponents from "@/components/mdx";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SidebarProvider } from "@/components/sidebar/context";
import { generateMetadata } from "@/data/meta";
import { symbolsUrl } from "../../vite/symbols";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { Snackbars } from "../components/snackbar";
import appCss from "../styles.css?url";

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
  useSmallScreenBanner();
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
