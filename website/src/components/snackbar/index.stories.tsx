import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "react-hot-toast";
import { getButtonClasses } from "../button";
import { Snackbars } from ".";

function SnackbarsDemo() {
  return (
    <>
      <Snackbars />
      <button
        type="button"
        className={getButtonClasses()}
        onClick={() => toast("Hello World")}
      >
        Default
      </button>
      <button
        type="button"
        className={getButtonClasses({ color: "success" })}
        onClick={() => toast.success("Success!")}
      >
        Success
      </button>
      <button
        type="button"
        className={getButtonClasses({ color: "error" })}
        onClick={() =>
          toast.error((t) => (
            <>
              <b>Error!</b>
              <button
                type="button"
                className={getButtonClasses()}
                onClick={() => toast.dismiss(t.id)}
              >
                Dismiss
              </button>
            </>
          ))
        }
      >
        Error
      </button>
      <button
        type="button"
        className={getButtonClasses()}
        onClick={() =>
          toast.promise(
            new Promise<void>((resolve, reject) =>
              setTimeout(
                () => (Math.random() > 0.5 ? resolve() : reject()),
                1000,
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
      </button>
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
