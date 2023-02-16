export namespace FincodeError {
    export type FincodeErrorObject = {
        error_code: string;
        error_message: string;
    }

    export type APIResponse = {
        errors: FincodeErrorObject[]
    }
}