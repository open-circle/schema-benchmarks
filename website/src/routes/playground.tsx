import { libraries } from "@schema-benchmarks/schemas/libraries";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageFilters } from "@/components/page-filter";
import { PageFilterChips } from "@/components/page-filter/chips";
import { Route as LibraryRoute } from "./playground/$library";
import Content from "./playground/content.mdx";

const allLibraries = Object.keys(libraries).map((key) =>
  key.replace("./", "").replace("/benchmarks.ts", ""),
);

export const Route = createFileRoute("/playground")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Content components={{ wrapper: "div" }} />
      <PageFilters>
        <PageFilterChips
          options={allLibraries}
          title="Library"
          labels={Object.fromEntries(
            allLibraries.map((library) => [
              library,
              { label: <code>{library}</code>, icon: "deployed_code" },
            ]),
          )}
          getLinkOptions={(option) => ({
            from: Route.fullPath,
            to: LibraryRoute.fullPath,
            params: { library: option },
            replace: true,
            resetScroll: false,
          })}
        />
      </PageFilters>
      <Outlet />
    </>
  );
}
