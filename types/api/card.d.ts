export namespace Card {
    /**
     * Card object
     */
    export type CardObject = {}    

    /**
     * Card brands user can use in fincode.
     * 
     * - `VISA`: Visa card.
     * - `MASTER`: MasterCard card.
     * - `JCB`: JCB card.
     * - `AMEX`: American Express card.
     * - `Diners`: DinersClub card.
     */
    export type Brand = "VISA" | "MASTER" | "JCB" | "AMEX" | "DINERS";

    /**
     * Request object of Registering Card (used in POST /v1/customers/{customer_id}/cards)
     */
    export type RegisteringRequest = {
        /**
         * Flag that means the customer uses this card by default or not.
         * 
         * - `0`: OFF
         * - `1`: ON
         */
        default_flag: "0" | "1";

        /**
         * Card token responded from fincodeJS (Fincode.tokens(...))
         */
        token: string;

        /**
         * Card holder's name
         */
        holder_name: string | null;

        /**
         * Security code (CVC/CVV)
         */
        security_code: string | null;
    }

    /**
     * Request object of Updating Card (used in PUT /v1/customers/{customer_id}/cards/{id})
     */
    export type UpdatingRequest = {
        /**
         * Flag that means the customer uses this card by default or not.
         * 
         * - `0`: OFF
         * - `1`: ON
         */
        default_flag: "0" | "1" | null;

        /**
         * Card token responded from fincodeJS (Fincode.tokens(...))
         */
        token: string | null;

        /**
         * Card holder's name
         */
        holder_name: string | null;

        /**
         * The expiring date of the card used in this payment.
         * 
         * Format: YYMM
         */
        expire: string | null;
    }

    /**
     * Response object of Deleting Card (used in DELETE /v1/customers/{customer_id}/cards/{id})
     */
    export type DeletingResponse = {
        /**
         * Customer's customer ID deleted card was tied to.
         */
        customer_id: string;

        /**
         * Card ID that has just been deleted.
         */
        id: string;

        /**
         * Flag this card has already been deleted or not.
         * 
         * - `0`: Not deleted. This customer is still available.
         * - `1`: Deleted. This customer is no longer available.
         */
        delete_flag: "0" | "1";
    }
}