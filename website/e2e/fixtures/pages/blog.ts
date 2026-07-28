import { BasePOM } from "#e2e/fixtures/base";

export class BlogPage extends BasePOM {
  url = "/blog";

  blogGrid = this.main.getByRole("list");

  getBlogCardByTitle(title: string) {
    return this.blogGrid.getByRole("listitem", { name: title });
  }
}
