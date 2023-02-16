export namespace Token {
    /**
     * Response object of Issuing card token (used in Fincode.tokens())
     */
    export type IssuingResponse = {
        /**
         * List of tokens.
         */
        list: {
            token: string;
        }[];

        /**
         * Masked card number used in this payment. (e.g. `************9999`)
         */
        card_no: string;
        
        /**
         * expiring time of these tokens.
         * 
         * Format: yyyy/MM/dd HH:mm:ss.SSS
         */
        expore: string;

        /**
         * Flag that security code was set or not.
         * 
         * - `0`: Security code was unset.
         * - `1`: Security code was set.
        */
        security_code_set: "0" | "1";
    }
}