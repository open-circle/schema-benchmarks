import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogCard, type BlogCardProps } from ".";
import "./index.css";

const blog: BlogCardProps["blog"] = {
  slug: "welcome",
  title: "Welcome",
  description: "Welcome to the Schema Benchmarks blog!",
  published: new Date(),
  authors: ["EskiMojo14", "fabian-hiller"],
  cover: {
    src: "/logo.svg",
    alt: "Schema Benchmarks Logo",
    fit: "contain",
  },
};

const meta = {
  title: "Features/Blog/Card",
  component: BlogCard,
  args: { blog },
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TextCover: Story = {
  args: {
    blog: {
      ...blog,
      cover: "Schema Benchmarks",
    },
  },
};
