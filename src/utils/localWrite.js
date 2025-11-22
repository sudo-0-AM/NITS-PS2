import fs from "fs";

export const writeFileSync = (path, data) => {
  try {
    fs.writeFileSync(path, data);
  } catch (e) {
    console.warn("⚠ File write blocked in browser build (safe for preview only)");
  }
};
