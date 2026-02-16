import preview from "#storybook/preview";

import { BlogCard, type BlogCardProps } from ".";

import "./index.css";

const blog: BlogCardProps["blog"] = {
  slug: "welcome",
  title: "Welcome",
  description: "Welcome to the Schema Benchmarks blog!",
  published: new Date(),
  authors: ["EskiMojo14", "fabian-hiller"],
  cover: {
    src: "/logo_dark.svg",
    alt: "Schema Benchmarks Logo",
    fit: "contain",
  },
};

const meta = preview.meta({
  title: "Features/Blog/Card",
  component: BlogCard,
  args: { blog },
});

export const Default = meta.story();

export const TextCover = meta.story({
  args: {
    blog: {
      ...blog,
      cover: "Schema Benchmarks",
    },
  },
});
