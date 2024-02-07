import { FincodeInstance } from "./js/fincode";
export type FincodeEnv = "test" | "live";
export type FincodeLoaderFn = (initArgs: {
    publicKey: string;
    isLiveMode?: boolean;
}) => Promise<FincodeInstance>;
/**
 * initialize fincode.js and return fincode instance
 *
 * @param initArgs - initialization arguments
 * @param initArgs.publicKey - public API key for fincode.js
 * @param initArgs.isLiveMode - whether to use live environment. If true, it will use live environment. Otherwise, it will use test environment.
 */
export declare const initFincode: FincodeLoaderFn;
//# sourceMappingURL=main.d.ts.map