import crypto from "crypto";
export function hashContent(content) {
    return crypto.createHash("sha1").update(content).digest("hex");
}
