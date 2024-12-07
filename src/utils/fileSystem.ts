import { existsSync } from "fs";
import path from "path";

// BIT REPO
export const getBitPath = () => {
  if (!existsSync(".bit")) {
    throw new Error(
      "Bit repository not found. Please initialize a bit repository."
    );
  }

  return path.resolve(".bit");
};

export const getHeadPath = () => {
  const bitPath = getBitPath();
  const headPath = path.join(bitPath, "HEAD");

  if (!existsSync(headPath)) {
    throw new Error("HEAD not found. Please initialize a bit repository.");
  }

  return headPath;
};

export const getIndexPath = () => {
  const bitPath = getBitPath();
  const indexPath = path.join(bitPath, "index");

  if (!existsSync(indexPath)) {
    throw new Error(
      "Index not found. Please stage file(s) to create an index."
    );
  }

  return indexPath;
};

export const getBitIgnorePath = () => {
  const bitIgnorePath = "./.bitignore";
  if (!existsSync(bitIgnorePath)) return null;
  return bitIgnorePath;
};
