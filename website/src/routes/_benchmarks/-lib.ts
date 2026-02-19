export function formatLibraryName(libraryName: string) {
  return libraryName.replace(/___/g, "@");
}
