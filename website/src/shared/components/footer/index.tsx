import { trackedLinkProps } from "#/shared/lib/analytics";

export function Footer() {
  return (
    <footer className="footer">
      <span>
        Created by <a {...trackedLinkProps("https://eskimojo.neocities.org")}>eskimojo</a> for{" "}
        <a {...trackedLinkProps("https://github.com/open-circle")}>Open Circle</a>
      </span>
    </footer>
  );
}
