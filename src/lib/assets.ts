import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Whether a file exists under public/ — checked at build time.
 *
 * Used for artwork the design references but that has not been supplied yet
 * (the event flyers). Lets a component fall back to a placeholder instead of
 * emitting an <img> that 404s, and start rendering the real image as soon as
 * the file is dropped in.
 *
 * @param publicPath Root-relative path as written in markup, e.g. "/assets/x.png"
 */
export function hasPublicAsset(publicPath: string): boolean {
  const relative = publicPath.replace(/^\/+/, "");
  return existsSync(join(process.cwd(), "public", relative));
}
