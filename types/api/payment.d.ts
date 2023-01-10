import { Card } from "./card";

export namespace Payment {

    /**
     * Registering Payment Request Object (used in POST /v1/payments)
     */
    export type RegisteringRequest = {

        /**
         * Payment ID. (sometimes called "Order ID")
         */
        id: string | null;

        /**
         * Accepted payment method in this payment.
         * 
         * - `Card`: this payment accepts card.
         */
        pay_type: "Card";

        /**
         * Job category of this payment.
         * 
         * - `CHECK`: fincode checks if the card is valid.
         * - `AUTH`: fincode authorizes a charge with sum of "amount" and "tax".
         * - `CAPTURE`: fincode captures authorized charge.
         */
        job_code: "CHECK" | "AUTH" | "CAPTURE";

        /**
         * Amount of this payment. this value must be in range of 0 to 9999999.
         * If "job_code" param's value is "AUTH" or "CAPTURE", then this param become required.
         */
        amount: string | null;

        /**
         * Tax and shipping fee. if this param is set, "amount" param must also be set.
         */
        tax: string | null;

        /**
         * Free text fields. Requester can set any string values and fincode will save them.
         */
        client_field_1: string | null;
        client_field_2: string | null;
        client_field_3: string | null;
        
        /**
         * (Warning!) This field is no longer used.
         */
        send_url: string | null;

        /**
         * Defines the behavior of 3D Secure 2.0
         * 
         * - `0`: Not use.
         * - `2`: Use 3D Secure 2.0 Authentication
         */
        tds_type: "0" | "2" | null;

        /**
         * The value will be used as your business name in redirect page of 3D Secure. 
         */
        td_tenant_name: string | null;

        /**
         * This field will be filled if this payment is created by subscription payment.
         */
        subscription_id: string | null;

        /**
         * Defines the behavior of this payment when the card used in this payment does not support 3D Secure 2.0 
         * 
         * - `2`: fincode API will return HTTP Error(400) and not execute this payment.
         * - `3`: fincode API will execute this payment without 3D Secure 2.0 authentication. 
         */
        tds2_type: "2" | "3" | null;
    }

    /**
     * Registering Payment Response Object (used in POST /v1/payments)
     */
    export type RegisteringResponse = Readonly<_RegisteringResponse>
    type _RegisteringResponse = {
        /**
         * Shop ID that registered this payment.
         */
        shop_id: string;

        /**
         * Payment ID. (sometimes called "Order ID")
         */
        id: string;

        /**
         * Accepted payment method in this payment. 
         * 
         * - `Card`: this payment accepts card.
         */
        pay_type: "Card";

        /**
         * Status of this payment.
         * 
         * - `UNPROCESSED`: This payment has been registered but no action has been taken yet.
         * - `CHECK`: This payment is only used for checking if the card is valid or not.
         * - `AUTHORIZED`: Card authorization was already accepted. So this payment is waiting for capturing.
         * - `CAPTURED`: The sale from this payment has already been captured.
         * - `CANCELED`: This payment is canceled by request.
         * - `AUTHENTICATED`: 3D Secure Authentication has already finished. So this payment is awaiting for Payment-After-3DSecure (PUT /v1/payments/{id}/secure)
         */
        status: Status;

        /**
         * This value will be used in this payment context.
         */
        access_id: string;

        /**
         * The date this payment was processed.
         */
        process_date: string;

        /**
         * Job category of this payment.
         * 
         * - `CHECK`: fincode checks if the card is valid.
         * - `AUTH`: fincode authorizes a charge.
         * - `CAPTURE`: fincode captures authorized payment.
         */
        job_code: "CHECK" | "AUTH" | "CAPTURE";

        /**
         * Code string identifying the product category.
         */
        item_code: string;

        /**
         * Amount of this payment. this value must be in range of 0 to 9999999.
         * If "job_code" param's value is "AUTH" or "CAPTURE", then this param become required.
         */
        amount: number;

        /**
         * Tax and shipping fee. if this param is set, "amount" param must also be set.
         */
        tax: number;

        /**
         * Sum of "amount" and "tax".
         */
        total_amount: number;

        /**
         * If your shop type is "platform" and does not shareing customers between tenants, this param will be set some group id.
         */
        customer_group_id: string | null;

        /**
         * If some customer is used in this payment, this field will be filled it's id (Customer ID).
         */
        customer_id: string | null;

        /**
         * Masked card number used in this payment. (e.g. `************9999`)
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        card_no: string | null;

        /**
         * Card ID used in this payment.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        card_id: string | null;

        /**
         * The expiring date of the card used in this payment. (format: `yymm`, e.g. `3011` means 2030/11)
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        expire: string | null;

        /**
         * Holder name of the card used in this payment.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        holder_name: string | null;

        /**
         * hashed card number the card used in this payment.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        card_no_hash: string | null;

        /**
         * Billing behavior of card payment.
         * 
         * - `1`: The customer will be charged for this payment in a lump-sum.
         * - `2`: The customer will be charged for this payment in several installments.
         */
        method: "1" | "2" | null;

        /**
         * The number of installments that will charge to the customer in this payment registered as installment payment.
         */
        pay_times: string | null;

        /**
         * Value that identifies the company to which fincode requests payment processing.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        forward: string | null;

        /**
         * Issuer of the card used in this payment.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        issuer: string | null;
        
        /**
         * Transaction ID of this payment.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        transaction_id: string | null;

        /**
         * Approval number of this payment issued by the card acquirer.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        approve: string | null;

        /**
         * Limit date you can capture this authenticated payment.
         */
        auth_max_date: string | null;

        /**
         * Free text fields set by registerer who created this payment.
         */
        client_field_1: string | null;
        client_field_2: string | null;
        client_field_3: string | null;

        /**
         * Defines the behavior of 3D Secure 2.0
         * 
         * - `0`: Not use 3D Secure 2.0.
         * - `2`: Use 3D Secure 2.0 Authentication
         */
        tds_type: "0" | "2";

        /**
         * Defines the behavior of this payment when the card used in this payment does not support 3D Secure 2.0 
         * 
         * - `2`: fincode API will return HTTP Error(400) and not execute this payment.
         * - `3`: fincode API will execute this payment without 3D Secure 2.0 authentication. 
         */
        tds2_type: "2" | "3" | null;

        /**
         * Returning URL of your website when 3D Secure 2.0 authentication is completed.
         * 
         * For the URL specified in this field, the following values are passed with the redirect.
         * 
         * - MD: this value equals "access_id" and will return as query string.
         * - requestorTransId: this value will return as "application/x-www-form-urlencoded"
         * - event: this value will return as "application/x-www-form-urlencoded"
         * - param: this value will be used in 3D Secure 2.0 authentication after redirecting this url and return as "application/x-www-form-urlencoded".
         */
        tds2_ret_url: string | null;

        /**
         * The processing status of 3D Secure 2.0 authentication.
         * 
         * - `2`: fincode API will return HTTP Error(400) and not execute this payment.
         * - `3`: fincode API will execute this payment without 3D Secure 2.0 authentication. 
         */
        tds2_status: "2" | "3" | null;

        /**
         * The value will be used as your business name in redirect page of 3D Secure. 
         */
        merchant_name: string | null;

        /**
         * (Warning!) This field is no longer used.
         */
        send_url: string | null;

        /**
         * This field will be filled if this payment is created by subscription payment.
         */
        subscription_id: string | null;

        /**
         * This field will be filled if this payment is created by bulk payment.
         */
        bulk_payment_id: string | null;

        /**
         * Card Brand of the card used in this payment.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        brand: Card.Brand | null;

        /**
         * Error code if some error has occured in this payment.
         * 
         * Go to https://docs.fincode.jp/develop_support/error to learn more about errors.
         */
        error_code: string | null;

        /**
         * Date this payment was created.
         * 
         * (format: YYYY/MM/dd HH:mm:ss.SSS)
         */
        created: string

        
        /**
         * Date this payment was updated.
         * 
         * (format: YYYY/MM/dd HH:mm:ss.SSS)
         */
        updated: string
        
    }

    export type Status = "UNPROCESSED" | "CHECKED" | "AUTHORIZED" | "CAPTURED" | "CANCELED" | "AUTHENTICATED";
}