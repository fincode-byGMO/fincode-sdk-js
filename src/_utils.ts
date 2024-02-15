export class FincodeSDKError extends Error {
    constructor(message: string) {
        super(`[fincode SDK] ${message}`);
        this.name = "FincodeSDKError";
    }
}
