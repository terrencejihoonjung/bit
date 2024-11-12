import path from "path";
import fs from "fs/promises";
// Initialize config file
export async function initializeConfig(rootPath, username) {
    const initialConfig = [
        "[branch]",
        "  default = main",
        "[user]",
        `  name = ${username}`,
        "",
    ].join("\n");
    await fs.writeFile(path.join(rootPath, "config"), initialConfig);
}
// Read config file
export async function readConfig(rootPath) {
    const contents = await fs.readFile(rootPath, "utf-8");
    const lines = contents.split("\n").map((line) => line.trim());
    const configInfo = {};
    for (const line of lines) {
        if (!line)
            continue;
        else if (line.startsWith("[") && line.endsWith("]"))
            continue;
        else {
            const [key, value] = line.split("=").map((part) => part.trim());
            configInfo[key] = value;
        }
    }
    return { name: configInfo.name, defaultBranch: configInfo.default };
}
