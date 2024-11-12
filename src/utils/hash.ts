import crypto from "crypto";
import { TreeObject } from "../entities";

export function hashContent(content: Buffer) {
  return crypto.createHash("sha1").update(content).digest("hex");
}
