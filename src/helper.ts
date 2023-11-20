import { otherMessage, errorMessage } from "./logger";
import { readdirSync, statSync } from "fs";
import { Application } from "express";
import { basename, join } from "path";

export const loadEndpoints = (directory: string, app: Application) => {
  try {
    const items = readdirSync(directory);
    console.log(items);

    let skipped = 0;
    let loaded = 0;

    for (const item of items) {
      const itemPath = join(directory, item);
      const stats = statSync(itemPath);
      if (stats.isDirectory()) {
        const result = loadEndpoints(itemPath, app);
        if (result) {
          skipped += result.skipped;
          loaded += result.loaded;
        }
      } else if (item.toLowerCase().endsWith(".ts")) {
        if (item.toLowerCase().includes("disabled")) {
          skipped++;
          continue;
        }
        loaded++;
        const route = require(itemPath).default;
        route(app);
        otherMessage(`Loaded ${basename(itemPath).split(".ts")[0]} endpoint`);
      }
    }
    return { loaded, skipped };
  } catch (error: any) {
    errorMessage(`Error loading endpoints: ${error}`);
  }
};
