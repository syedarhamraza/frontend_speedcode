import he from "he";

export function decodeHTML(str: string): string {
  return he.decode(str);
}
