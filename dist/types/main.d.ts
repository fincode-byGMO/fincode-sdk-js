import { FincodeInstance } from "./js/fincode";
export type FincodeConfig = {};
export type FincodeLoaderFn = (publicKey: string, isProduction?: boolean, config?: FincodeConfig) => () => Promise<FincodeInstance | null>;
export declare const initFincode: FincodeLoaderFn;
//# sourceMappingURL=main.d.ts.map