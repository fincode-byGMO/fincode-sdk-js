export class FincodeSDKError extends Error {
    /**
     * Error this one was raised from, when there is one.
     *
     * Set when a request fails before a response arrives, so the reason
     * (CORS, name resolution, the connection being refused) is not lost.
     */
    public readonly cause?: unknown

    constructor(message: string, cause?: unknown) {
        super(`[fincode SDK] ${message}`);
        this.name = "FincodeSDKError";
        this.cause = cause;
    }
}
