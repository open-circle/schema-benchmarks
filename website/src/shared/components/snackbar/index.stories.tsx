import { toast } from "react-hot-toast";
import preview from "#storybook/preview";
import { Button } from "../button";
import { Snackbars } from ".";

function SnackbarsDemo() {
  return (
    <>
      <Snackbars />
      <Button onClick={() => toast("Hello World")}>Default</Button>
      <Button color="success" onClick={() => toast.success("Success!")}>
        Success
      </Button>
      <Button
        color="error"
        onClick={() =>
          toast.error((t) => (
            <>
              <b>Error!</b>
              <Button onClick={() => toast.dismiss(t.id)}>Dismiss</Button>
            </>
          ))
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toast.promise(
            new Promise<void>((resolve, reject) =>
              setTimeout(() => (Math.random() > 0.5 ? resolve() : reject()), 2000),
            ),
            {
              loading: "Loading...",
              success: "Success!",
              error: "Error!",
            },
          )
        }
      >
        Loading
      </Button>
    </>
  );
}

const meta = preview.meta({
  title: "Components/Snackbar",
  component: SnackbarsDemo,
});

export const Default = meta.story();
