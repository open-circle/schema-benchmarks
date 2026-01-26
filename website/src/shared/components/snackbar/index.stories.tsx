import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "react-hot-toast";
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
              setTimeout(
                () => (Math.random() > 0.5 ? resolve() : reject()),
                2000,
              ),
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

const meta = {
  title: "Components/Snackbar",
  component: SnackbarsDemo,
} satisfies Meta<typeof Snackbars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
