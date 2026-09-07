export type APIErrorResponse = {
    errors: APIError[]
}

export type APIError = {
    error_code: string
    error_message: string
}