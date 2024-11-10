import crypto from "crypto";

export function hashContent(content: Buffer) {
  return crypto.createHash("sha1").update(content).digest("hex");
}
