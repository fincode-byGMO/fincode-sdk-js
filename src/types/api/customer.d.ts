export namespace Customer {
    /**
     * Customer object
     */
    export type CustomerObject = {
        /**
         * Customer ID
         */
        id: string

        /**
         * Customer's name
         */
        name: string | null;
        
        /**
         * Customer's email
         */
        email: string | null;

        /**
         * Country Code of customer's phone.
         */
        phone_cc: string | null;
        
        /**
         * Number of customer's phone.
         */
        phone_no: string | null;
        
        /**
         * City of the customer's billing address.
         */
        addr_city: string | null;
        
        /**
         * ISO 3166-1 numeric country code of the customer's billing address.
         */
        addr_country: string | null;

        /**
         * 1st line of the customer's billing address.
         */
        addr_line1: string | null;
        
        /**
         * 2nd line of the customer's billing address.
         */
        addr_line2: string | null;

        /**
         * 3rd line of the customer's billing address.
         */
        addr_line3: string | null;

        /**
         * Postal code of the customer's billing address.
         */
        addr_post_code: string | null;

        /**
         * ISO 3166-2 state code of the customer's billing address.
         */
        addr_state: string | null;

        /**
         * Date this customer was created.
         * 
         * Format: YYYY/MM/dd HH:mm:ss.SSS
         */
        created: string

        /**
         * Date this customer was updated.
         * 
         * Format: YYYY/MM/dd HH:mm:ss.SSS
         */
        updated: string

        /**
         * Some card (payment method) has been registered for this customer or not.
         * 
         * - `0`: There is no card (payment method).
         * - `1`: Some card (payment method) have already been registered.
         */
        card_registration: "0" | "1"
    }

    /**
     * Request object of Creating customer (used in POST /v1/customers)
     */
    export type CreatingRequest = {
        /**
         * Customer ID
         */
        id: string

        /**
         * Customer's name
         */
        name: string | null;
        
        /**
         * Customer's email
         */
        email: string | null;

        /**
         * Country Code of customer's phone.
         */
        phone_cc: string | null;
        
        /**
         * Number of customer's phone.
         */
        phone_no: string | null;
        
        /**
         * City of the customer's billing address.
         */
        addr_city: string | null;
        
        /**
         * ISO 3166-1 numeric country code of the customer's billing address.
         */
        addr_country: string | null;

        /**
         * 1st line of the customer's billing address.
         */
        addr_line1: string | null;
        
        /**
         * 2nd line of the customer's billing address.
         */
        addr_line2: string | null;

        /**
         * 3rd line of the customer's billing address.
         */
        addr_line3: string | null;

        /**
         * Postal code of the customer's billing address.
         */
        addr_post_code: string | null;

        /**
         * ISO 3166-2 state code of the customer's billing address.
         */
        addr_state: string | null;
    }

    /**
     * Request object of Updating customer (used in PUT /v1/customers/{id})
     */
    export type UpdatingRequest = {
        /**
         * Customer's name
         */
        name: string | null;
        
        /**
         * Customer's email
         */
        email: string | null;

        /**
         * Country Code of customer's phone.
         */
        phone_cc: string | null;
        
        /**
         * Number of customer's phone.
         */
        phone_no: string | null;
        
        /**
         * City of the customer's billing address.
         */
        addr_city: string | null;
        
        /**
         * ISO 3166-1 numeric country code of the customer's billing address.
         */
        addr_country: string | null;

        /**
         * 1st line of the customer's billing address.
         */
        addr_line1: string | null;
        
        /**
         * 2nd line of the customer's billing address.
         */
        addr_line2: string | null;

        /**
         * 3rd line of the customer's billing address.
         */
        addr_line3: string | null;

        /**
         * Postal code of the customer's billing address.
         */
        addr_post_code: string | null;

        /**
         * ISO 3166-2 state code of the customer's billing address.
         */
        addr_state: string | null;
    }

    /**
     * Response object of Deleting customer (used in DELETE /v1/customers/{id})
     */
    export type DeletingResponse = {
        /**
         * Customer ID that has been deleted.
         */
        id: string;

        /**
         * Flag this customer has already been deleted or not.
         * 
         * - `0`: Not deleted. This customer is still available.
         * - `1`: Deleted. This customer is no longer available.
         */
        delete_flag: "0" | "1";
    }
}

