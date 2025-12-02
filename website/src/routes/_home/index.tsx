import { createFileRoute } from "@tanstack/react-router";
import Content from "./content.mdx";

export const Route = createFileRoute("/_home/")({ component: App });

function App() {
  return <Content />;
}
