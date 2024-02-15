export class FincodeSDKError extends Error {
    constructor(message) {
        super(`[fincode SDK] ${message}`);
        this.name = "FincodeSDKError";
    }
}
