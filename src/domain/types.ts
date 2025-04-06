export type SignFn = (val: string) => { signature: string };
export type EncryptFn = (val: string) => string;
export type DecryptFn = (val: string) => string;
export type IsEncrypted = (val: string) => boolean;
