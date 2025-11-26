import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/button";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [shouldThrow, setShouldThrow] = useState(false);
  if (shouldThrow) throw new Error("Hello World");
  return (
    <Button
      onClick={() => {
        setShouldThrow(true);
      }}
    >
      Throw
    </Button>
  );
}
