import usedSymbols from "virtual:used-symbols";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ssrBehavior } from "react-md-spinner";
import { Banner } from "@/components/banner";
import { ConfirmDialog } from "@/components/dialog/confirm";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SidebarProvider } from "@/components/sidebar/context";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { Snackbars } from "../components/snackbar";
import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Schema Benchmarks",
      },
    ],
    links: [
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
        href: "https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap",
      },
      {
        rel: "stylesheet",
        // TODO: narrow to used icons and axes https://developers.google.com/fonts/docs/material_symbols#optimize_the_icon_font
        href: `https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200${/*import.meta.env.DEV ? "" : */ `&icon_names=${usedSymbols.join(",")}`}`,
      },
    ],
  }),
  loader: () => ({ crumb: "Benchmarks" }),
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
