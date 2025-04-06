export const base64Encrypt = (val: string): string => {
  return Buffer.from(val, "utf-8").toString("base64");
};

export const base64Decrypt = (val: string): string => {
  return Buffer.from(val, "base64").toString("utf-8");
};
