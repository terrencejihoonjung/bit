import { existsSync } from "fs";
import fs from "fs/promises";

export async function readIndex(
  indexPath: string
): Promise<Map<string, string>> {
  // Check if index exists
  if (!existsSync(indexPath)) {
    return new Map<string, string>();
  }

  // Read index file
  const contents = await fs.readFile(indexPath, "utf-8");

  // Parse index content into a Map
  const lines = contents.split("\n").filter((line) => line.trim() !== "");
  return new Map(
    lines.map((line) => {
      const [file, hash] = line.split(" ");
      return [file, hash];
    })
  );
}

export async function writeIndex(
  indexPath: string,
  index: Map<string, string>
) {
  // Convert index Map to string
  const content = Array.from(index.entries())
    .map(([file, hash]) => `${file} ${hash}`)
    .join("\n");

  // Write string to index file
  await fs.writeFile(indexPath, content);
}
