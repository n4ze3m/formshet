import * as crypto from "crypto";
export const generateApiKey = () => {
  const apiKey = crypto.randomBytes(16).toString("hex");
  return `FORMSHEET_${apiKey}`;
};
