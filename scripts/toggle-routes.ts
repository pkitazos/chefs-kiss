#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { ROUTES } from "../routes.config.js";

/**
 * Route Toggle Script
 *
 * This script enables/disables Next.js routes by renaming folders.
 * Disabled routes are prefixed with an underscore (_), which Next.js ignores.
 *
 * Usage:
 *   pnpm toggle-routes
 *
 * Configuration:
 *   Edit routes.config.ts to enable/disable routes.
 */

// ============================================================================
// SCRIPT LOGIC
// ============================================================================

const APP_DIR = path.join(process.cwd(), "app");

interface ToggleResult {
  path: string;
  action: "enabled" | "disabled" | "unchanged" | "skipped";
  reason?: string;
}

function toggleRoute(routePath: string, shouldEnable: boolean): ToggleResult {
  const segments = routePath.split("/");
  const folderPath = path.join(APP_DIR, ...segments);
  const parentPath = path.dirname(folderPath);
  const folderName = path.basename(folderPath);

  // Check if path starts with underscore (disabled)
  const isCurrentlyDisabled = folderName.startsWith("_");
  const actualFolderName = isCurrentlyDisabled
    ? folderName.substring(1)
    : folderName;
  const actualFolderPath = path.join(parentPath, actualFolderName);
  const disabledFolderPath = path.join(parentPath, `_${actualFolderName}`);

  // Determine which path currently exists
  const enabledExists = fs.existsSync(actualFolderPath);
  const disabledExists = fs.existsSync(disabledFolderPath);

  if (!enabledExists && !disabledExists) {
    return {
      path: routePath,
      action: "skipped",
      reason: "Route folder does not exist",
    };
  }

  const currentPath = enabledExists ? actualFolderPath : disabledFolderPath;
  const currentlyEnabled = enabledExists && !disabledExists;

  // Check if action is needed
  if (currentlyEnabled === shouldEnable) {
    return {
      path: routePath,
      action: "unchanged",
      reason: shouldEnable ? "Already enabled" : "Already disabled",
    };
  }

  // Perform the toggle
  const targetPath = shouldEnable ? actualFolderPath : disabledFolderPath;

  try {
    fs.renameSync(currentPath, targetPath);
    return {
      path: routePath,
      action: shouldEnable ? "enabled" : "disabled",
    };
  } catch (error) {
    return {
      path: routePath,
      action: "skipped",
      reason: `Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

function main() {
  console.log("Toggling routes...\n");

  const results: ToggleResult[] = [];

  // Process each route in the config
  for (const [routePath, shouldEnable] of Object.entries(ROUTES)) {
    const result = toggleRoute(routePath, shouldEnable);
    results.push(result);
  }

  // Print results
  const enabled = results.filter((r) => r.action === "enabled");
  const disabled = results.filter((r) => r.action === "disabled");
  const unchanged = results.filter((r) => r.action === "unchanged");
  const skipped = results.filter((r) => r.action === "skipped");

  if (enabled.length > 0) {
    console.log("[ENABLED]");
    enabled.forEach((r) => console.log(`  ${r.path}`));
    console.log("");
  }

  if (disabled.length > 0) {
    console.log("[DISABLED]");
    disabled.forEach((r) => console.log(`  ${r.path}`));
    console.log("");
  }

  if (unchanged.length > 0) {
    console.log("[UNCHANGED]");
    unchanged.forEach((r) => console.log(`  ${r.path} (${r.reason})`));
    console.log("");
  }

  if (skipped.length > 0) {
    console.log("[SKIPPED]");
    skipped.forEach((r) => console.log(`  ${r.path} - ${r.reason}`));
    console.log("");
  }

  // Summary
  console.log("----------------------------------------");
  console.log(`Total: ${results.length} routes`);
  console.log(`  Enabled: ${enabled.length}`);
  console.log(`  Disabled: ${disabled.length}`);
  console.log(`  Unchanged: ${unchanged.length}`);
  console.log(`  Skipped: ${skipped.length}`);
  console.log("----------------------------------------");

  if (enabled.length > 0 || disabled.length > 0) {
    console.log(
      "\nRoutes have been toggled. Run `pnpm build` to rebuild with the new configuration."
    );
  }
}

main();
