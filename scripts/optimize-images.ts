/**
 * Image optimisation script for Chef's Kiss.
 *
 * Reads raw source images from `images-raw/`, resizes and re-encodes them
 * for web delivery, and writes the results to `public/images/`.
 *
 * - JPEGs and PNGs with photographic content are re-encoded as JPEG (q82).
 * - PNGs with transparency are preserved as PNG (lossless, palette-optimised).
 * - SVGs are copied through untouched.
 * - All raster images are capped at 2400px on the long edge.
 *
 * Usage:
 *   pnpm tsx scripts/optimize-images.ts            # incremental (skips up-to-date)
 *   pnpm tsx scripts/optimize-images.ts --force    # re-process everything
 */

import { readdir, mkdir, stat, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW_DIR = path.resolve("images-raw");
const OUT_DIR = path.resolve("public/images");
const MAX_EDGE = 2400;
const JPEG_QUALITY = 82;

const force = process.argv.includes("--force");

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return [full];
    }),
  );
  return files.flat();
}

/** Should we skip because the output is newer than the input? */
async function isUpToDate(srcPath: string, outPath: string): Promise<boolean> {
  if (force) return false;
  if (!existsSync(outPath)) return false;
  const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(outPath)]);
  return outStat.mtimeMs >= srcStat.mtimeMs;
}

/** Does this PNG actually use its alpha channel, or is it opaque? */
async function pngHasTransparency(srcPath: string): Promise<boolean> {
  const { hasAlpha, channels } = await sharp(srcPath).metadata();
  if (!hasAlpha || channels !== 4) return false;
  // Check whether any pixel is actually transparent.
  const { data, info } = await sharp(srcPath)
    .extractChannel("alpha")
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < info.width * info.height; i++) {
    if (data[i] < 255) return true;
  }
  return false;
}

async function processImage(
  srcPath: string,
): Promise<"written" | "skipped" | "copied"> {
  const relPath = path.relative(RAW_DIR, srcPath);
  const ext = path.extname(srcPath).toLowerCase();
  const base = relPath.slice(0, -ext.length);

  // Pass SVGs through unchanged.
  if (ext === ".svg") {
    const outPath = path.join(OUT_DIR, relPath);
    if (await isUpToDate(srcPath, outPath)) return "skipped";
    await mkdir(path.dirname(outPath), { recursive: true });
    await copyFile(srcPath, outPath);
    return "copied";
  }

  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    return "skipped";
  }

  // Decide output format: PNG only if we actually need transparency.
  let outExt: ".jpg" | ".png" = ".jpg";
  if (ext === ".png" && (await pngHasTransparency(srcPath))) {
    outExt = ".png";
  }

  const outPath = path.join(OUT_DIR, base + outExt);
  if (await isUpToDate(srcPath, outPath)) return "skipped";

  await mkdir(path.dirname(outPath), { recursive: true });

  const pipeline = sharp(srcPath).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (outExt === ".jpg") {
    await pipeline
      .flatten({ background: "#ffffff" }) // strip any alpha on opaque PNGs
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outPath);
  } else {
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(outPath);
  }

  return "written";
}

async function main() {
  if (!existsSync(RAW_DIR)) {
    console.error(
      `No ${RAW_DIR} directory found. Create it and drop your source images in.`,
    );
    process.exit(1);
  }

  const all = await walk(RAW_DIR);
  const counts = { written: 0, skipped: 0, copied: 0 };

  for (const srcPath of all) {
    try {
      const result = await processImage(srcPath);
      counts[result]++;
      if (result !== "skipped") {
        const rel = path.relative(process.cwd(), srcPath);
        console.log(`  ${result.padEnd(7)} ${rel}`);
      }
    } catch (err) {
      console.error(
        `  failed  ${srcPath}:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.log(
    `\nDone. ${counts.written} written, ${counts.copied} copied, ${counts.skipped} up-to-date.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
