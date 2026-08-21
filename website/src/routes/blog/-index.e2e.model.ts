import { PageObjectModel } from "#e2e/fixtures/base";

export class BlogPage extends PageObjectModel {
  url = "/blog";
  title = /Blog/;

  blogGrid = this.main.getByRole("list");

  getBlogCardByTitle(title: string) {
    return this.blogGrid.getByRole("listitem", { name: title });
  }
}
