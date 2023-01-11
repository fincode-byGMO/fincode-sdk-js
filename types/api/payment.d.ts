import { Card } from "./card";

export namespace Payment {
    /**
     * Payment Object
     */
    export type PaymentObject = {
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
         * The expiring date of the card used in this payment. 
         * Format: `yymm`, e.g. `3011` means 2030/11
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
         * Charging method of card payment.
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
         * Format: YYYY/MM/dd HH:mm:ss.SSS
         */
        created: string

        /**
         * Date this payment was updated.
         * 
         * Format: YYYY/MM/dd HH:mm:ss.SSS
         */
        updated: string
        
    }

    /**
     * Request object of Registering payment (used in POST /v1/payments)
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
     * Response object of Registering payment (used in POST /v1/payments)
     */
    export type RegisteringResponse = Readonly<_RegisteringResponse>
    type _RegisteringResponse = PaymentObject

    /**
     * Request object of Executing payment (used in PUT /v1/payments/{id})
     */
    export type ExecutingRequest = {
        /**
         * Payment method you want to use in this payment execution.
         * 
         * - `Card`: card payment.
         */
        pay_type: string;

        /**
         * access ID issued for this payment to use in this payment context.
         */
        access_id: string;

        /**
         * One-time token that used to identify card that will be used in this payment.
         * 
         * You must fill this field or both "card_id" and "customer_id" fields.
         */
        token: string | null;

        /**
         * The expiring date of the card used in this payment.
         * 
         * Format: `yymm`, e.g. `3011` means 2030/11
         */
        expire: string | null;

        /**
         * Customer's customer ID that will be charged because of this payment.
         * 
         * You must fill both this and "card_id" fields or "token" field.
         */
        customer_id: string | null;
        
        /**
         * Customer's card ID that will be used in this payment.
         * 
         * You must fill both this and "customer_id" fields or "token" field.
         */
        card_id: string | null;

        /**
         * Charging method of card payment.
         * 
         * - `1`: The customer will be charged for this payment in a lump-sum.
         * - `2`: The customer will be charged for this payment in several installments.
         * 
         * You must fill this field when this payment's job_type is `AUTH` or `CAPTURE`
         */
        method: "1" | "2" | null;

        /**
         * The number of installments that will charge to the customer in this payment registered as installment payment.
         */
        pay_times: string | null;
           
        /**
         * Holder name of the card used in this payment.
         * 
         * If any card have not been used in this payment yet, this field will be null.
         */
        holder_name: string | null;


        // ---------------------------
        // Params used only in payment using 3D Secure 2.0
        // ---------------------------

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
         * Date the account who requests 3D Secure 2.0 was last updated.
         * 
         * Format: `yyyyMMdd`
         */
        tds2_ch_acc_change: string | null;

        /**
         * Date the account who requests 3D Secure 2.0 was created.
         * 
         * Format: `yyyyMMdd`
         */
        tds2_ch_acc_date: string | null;
        
        /**
         * Date the password of the account who requests 3D Secure 2.0 was changed.
         * 
         * Format: `yyyyMMdd`
         */
        tds2_ch_acc_pw_change: string | null;
        
        /**
         * Number of purchases made by the customer in the past 6 months.
         */
        tds2_nb_purchase_account: string | null;
        
        /**
         * Date the card was registered.
         * 
         * Format: `yyyyMMdd`
         */
        tds2_payment_acc_age: string | null;
        
        /**
         * Number of attempts to add cards in the past 24 hours.
         */
        tds2_provision_attempts_day: string | null;
        
        /**
         * Date of first use of shipping address.
         * 
         * Format: `yyyyMMdd`
         */
        tds2_ship_address_usage: string | null;
        
        /**
         * Customer name owning the card used in this payment and ship-to name matches or not.
         * 
         * - `01`: Matches
         * - `02`: Not match
         */
        tds2_ship_name_ind: "01" | "02" | null;
        
        /**
         * There is misconduct of the customer or not.
         * 
         * - `01`: There is no misconduct.
         * - `02`: There are some misconduct.
         */
        tds2_suspicious_acc_activity: "01" | "02" | null;
        
        /**
         * Number of transactions in the last 24 hours.
         */
        tds2_txn_activity_day: string | null;
        
        /**
         * Number of transactions in the previous year.
         */
        tds2_txn_activity_year: string | null;

        /**
         * Login trails.
         */
        tds2_three_ds_req_auth_data: string | null;
        
        /**
         * Login method of the customer.
         * 
         * - `01`: Without authoization (user as guest.)
         * - `02`: With custom authorization.
         * - `03`: With SSO.
         * - `04`: With authorization by card issuer.
         * - `05`: With 3rd Party authoriztion.
         * - `06`: With FIDO authorization.
         */
        tds2_three_ds_req_auth_method: "01" | "02" | "03" | "04" | "05" | null;
        
        /**
         * Date the customer logged in.
         * 
         * Format: `yyyyMMddHHmm`
         */
        tds2_three_ds_req_auth_timestamp: string | null;
        
        /**
         * Billing address and shipping address match or not.
         * 
         * - `Y`: Match.
         * - `N`: Not Match.
         */
        tds2_addr_match: "Y" | "N" | null;
        
        /**
         * City of the cardholder's billing address.
         */
        tds2_bill_addr_city: string | null;
        
        /**
         * ISO 3166-1 numeric country code of the cardholder's billing address.
         */
        tds2_bill_addr_country: string | null;
        
        /**
         * 1st line of the cardholder's billing address.
         */
        tds2_bill_addr_line_1: string | null;
        
        /**
         * 2nd line of the cardholder's billing address.
         */
        tds2_bill_addr_line_2: string | null;
        
        /**
         * 3rd line of the cardholder's billing address.
         */
        tds2_bill_addr_line_3: string | null;
        
        /**
         * Postal code of the cardholder's billing address.
         */
        tds2_bill_addr_post_code: string | null;
        
        /**
         * ISO 3166-2 state code of the cardholder's billing address.
         */
        tds2_bill_addr_state: string | null;
        
        /**
         * the cardholder's email.
         */
        tds2_email: string | null;
        
        /**
         * Country Code of cardholder's home phone.
         */
        tds2_home_phone_cc: string | null;
        
        /**
         * Number of cardholder's home phone.
         */
        tds2_home_phone_no: string | null;
        
        /**
         * Country Code of cardholder's mobile phone.
         */
        tds2_mobile_phone_cc: string | null;
        
        /**
         * Number of cardholder's mobile phone.
         */
        tds2_mobile_phone_no: string | null;
        
        /**
         * Country Code of cardholder's phone for work.
         */
        tds2_work_phone_cc: string | null;
        
        /**
         * Number of cardholder's phone for work.
         */
        tds2_work_phone_no: string | null;
        
        /**
         * City of the cardholder's shipping address.
         */
        tds2_ship_addr_city: string | null;
        
        /**
         * ISO 3166-1 numeric country code of the cardholder's shipping address.
         */
        tds2_ship_addr_country: string | null;
        
        /**
         * 1st line of the cardholder's shipping address.
         */
        tds2_ship_addr_line_1: string | null;
        
        /**
         * 2nd line of the cardholder's shipping address.
         */
        tds2_ship_addr_line_2: string | null;
        
        /**
         * 3rd line of the cardholder's shipping address.
         */
        tds2_ship_addr_line_3: string | null;
        
        /**
         * Postal code of the cardholder's shipping address.
         */
        tds2_ship_addr_post_code: string | null;
        
        /**
         * ISO 3166-2 state code of the cardholder's shipping address.
         */
        tds2_ship_addr_state: string | null;
        
        /**
         * the cardholder's email.
         */
        tds2_delivery_email_address: string | null;
        
        /**
         * Product Delivery Timeframe.
         * 
         * - `01`: electronic delivery.
         * - `02`: ship today.
         * - `03`: ship at next day.
         * - `04`: ship after 2 days or later.
         */
        tds2_delivery_timeframe: "01" | "02" | "03" | "04" | null;
        
        /**
         * Total amount of purchased prepaid or gift card.
         */
        tds2_gift_card_amount: string | null;
        
        /**
         * Count of purchased prepaid or gift card.
         */
        tds2_gift_card_count: string | null;
        
        /**
         * ISO 4217 currency code of purchased prepaid or gift card.
         */
        tds2_gift_card_curr: string | null;
        
        /**
         * Estimated date of product release.
         * 
         * Format: `yyyyMMdd`
         */
        tds2_pre_order_date: string | null;
        
        /**
         * 
         */
        tds2_pre_order_purchaselnd: string | null;
        
        /**
         * 
         */
        tds2_reorder_items_ind: string | null;
        
        /**
         * 
         */
        tds2_ship_ind: string | null;
        
        /**
         * Expiring date of recurring billing.
         * 
         * Format: `yyyyMMdd`
         */
        tds2_recuring_expiry: string | null;
        
        /**
         * Minimum interval days of recurring billing.
         */
        tds2_recuring_frequency: string | null;
    }

    /**
     * Response object of Executing payment  (used in PUT /v1/payments/{id})
     */
    export type ExecutingResponse = Readonly<_ExecutingResponse>
    type _ExecutingResponse = PaymentObject & {
        acs: string;
        acs_url: string;
        pa_req:string;
    }

    /**
     * Response object of Retrieving payment (used in GET /v1/payments/{id})
     */
    export type RetrievingResponse = Readonly<_RetrievingResponse>
    type _RetrievingResponse = PaymentObject

    /**
     * Response object of Retrieving payment list (used in GET /v1/payments)
     */
    export type RetrievingListResponse = Readonly<_RetrievingListResponse>
    type _RetrievingListResponse = {
        /**
         * Total count of searching result.
         */
        total_count: number;

        /**
         * Last page number of payment lists.
         */
        last_page: number;

        /**
         * Current page number of payment lists.
         */
        current_page: number;

        /**
         * Max number of each payment list.
         */
        limit: number;

        /**
         * URL for the next page.
         */
        link_next: string;

        /**
         * URL for the previous page.
         */
        link_previous: string;

        /**
         * List of payment objects
         */
        list: PaymentObject[];
    }

    /**
     * Request object of Capturing payment (used in PUT /v1/payments/{id}/capture)
     */
    export type CapturingRequest = {
        /**
         * Payment method you want to use in this payment execution.
         * 
         * - `Card`: card payment.
         */
        pay_type: string;

        /**
         * access ID issued for this payment to use in this payment context.
         */
        access_id: string;

        /**
         * Charging method of card payment.
         * 
         * - `1`: The customer will be charged for this payment in a lump-sum.
         * - `2`: The customer will be charged for this payment in several installments.
         * 
         * You must fill this field when this payment's job_type is `AUTH` or `CAPTURE`
         */
        method: "1" | "2" | null;

        /**
         * The number of installments that will charge to the customer in this payment registered as installment payment.
         */
        pay_times: string | null;
    }
    
    /**
     * Response object of Capturing payment (used in PUT /v1/payments/{id}/capture)
     */
    export type CapturingResponse = Readonly<_CapturingResponse>
    export type _CapturingResponse = PaymentObject

    /**
     * Request object of Canceling payment (used PUT /v1/payments/{id}/cancel)
     */
    export type CancelingRequest = {
        /**
         * Payment method you want to use in this payment execution.
         * 
         * - `Card`: card payment.
         */
        pay_type: string;

        /**
         * access ID issued for this payment to use in this payment context.
         */
        access_id: string;
    }

    /**
     * Response object of Canceling payment (used PUT /v1/payments/{id}/cancel)
     */
    export type CancelingResponse =  Readonly<_CapturingResponse>
    type _CancelingResponse = PaymentObject

    /**
     * Request object of Re-authenticate payment (used PUT /v1/payments/{id}/cancel)
     */
    export type ReauthenticateRequest = {
        /**
         * Payment method you want to use in this payment execution.
         * 
         * - `Card`: card payment.
         */
        pay_type: string;

        /**
         * access ID issued for this payment to use in this payment context.
         */
        access_id: string;

        /**
         * Charging method of card payment.
         * 
         * - `1`: The customer will be charged for this payment in a lump-sum.
         * - `2`: The customer will be charged for this payment in several installments.
         * 
         * You must fill this field when this payment's job_type is `AUTH` or `CAPTURE`
         */
        method: "1" | "2";

        /**
         * The number of installments that will charge to the customer in this payment registered as installment payment.
         */
        pay_times: string | null;
    }

    /**
     * Response object of Re-authenticate payment (used PUT /v1/payments/{id}/cancel)
     */
    export type ReauthenticateResponse = Readonly<_ReauthenticateResponse>
    type _ReauthenticateResponse = PaymentObject

    /**
     * Request object of Change the amount of payment (used PUT /v1/payments/{id}/change)
     */
    export type ChangeAmountRequest = {
        /**
         * Payment method you want to use in this payment execution.
         * 
         * - `Card`: card payment.
         */
        pay_type: string;

        /**
         * access ID issued for this payment to use in this payment context.
         */
        access_id: string;
        
        /**
         * Job category of this payment.
         * 
         * - `CHECK`: fincode checks if the card is valid.
         * - `AUTH`: fincode authorizes a charge with sum of "amount" and "tax".
         * - `CAPTURE`: fincode captures authorized charge.
         */
        job_code: "AUTH" | "CAPTURE";

        /**
         * Amount of this payment. this value must be in range of 0 to 9999999.
         * If "job_code" param's value is "AUTH" or "CAPTURE", then this param become required.
         */
        amount: string;

        /**
         * Tax and shipping fee. if this param is set, "amount" param must also be set.
         */
        tax: string | null;
    }
    
    /**
     * Response object of Change the amount of payment (used PUT /v1/payments/{id}/change)
     */
    export type ChangeAmountResponse = Readonly<_ChangeAmountResponse>
    type _ChangeAmountResponse = PaymentObject

    /**
     * Request object of executing payment after 3D Secure (used PUT /v1/payments/{id}/secure)
     */
    export type ExecutingAfter3DSecureRequest = {
        /**
         * Payment method you want to use in this payment execution.
         * 
         * - `Card`: card payment.
         */
        pay_type: string;

        /**
         * access ID issued for this payment to use in this payment context.
         */
        access_id: string;
    };
    
    /**
     * Response object of executing payment after 3D Secure (used PUT /v1/payments/{id}/secure)
     */
    export type ExecutingAfter3DSecureResponse = Readonly<_ExecutingAfter3DSecureResponse>;
    type _ExecutingAfter3DSecureResponse = PaymentObject;
    
    /**
     * Request object of Executing 3D Secure authentication (used PUT /v1/secures/{access_id}) 
     */
    export type Executing3DSecureAuthRequest = {
        /**
         * Browser information returned to the URL you set for "tds2_ret_url" parameter of response of PUT /v1/payments/{id}.
         */
        param: string
    }
    
    /**
     * Response object of Executing 3D Secure authentication (used PUT /v1/secures/{access_id}) 
     */
    export type Executing3DSecureAuthResponse = Readonly<_Executing3DSecureAuthResponse>
    type _Executing3DSecureAuthResponse = {
        /**
         * Result code of 3D Secure 2.0 authentication
         * 
         * - `Y`: Authentication or bank account successfully verified.
         * - `N`: Unauthorized or account could not be verified, or the payment was rejected.
         * - `U`: Authentication or account verification could not be performed.
         * - `A`: A trial of the authentication process was conducted.
         * - `C`: Required 3D Secure authentication challenge.
         * - `R`: Authentication or account verification was rejected.
         */
        tds2_trans_result: ThreeDSecureAuthResult

        /**
         * Reason of result of 3D Secure 2.0 authentication.
         */
        tds2_trans_result_reason: string

        /**
         * URL to use if 3D Secure authentication challenge was required.
         */
        challenge_url: string
    }


    /**
     * Response object of Retrieving 3D Secure authentication result (used GET /v1/secures/{access_id}) 
     */
    export type Retrieving3DSecureAuthResponse = Readonly<_Retrieving3DSecureAuthResponse>
    type _Retrieving3DSecureAuthResponse = {
        /**
         * Result code of 3D Secure 2.0 authentication
         * 
         * - `Y`: Authentication or bank account successfully verified.
         * - `N`: Unauthorized or account could not be verified, or the payment was rejected.
         * - `U`: Authentication or account verification could not be performed.
         * - `A`: A trial of the authentication process was conducted.
         * - `C`: Required 3D Secure authentication challenge.
         * - `R`: Authentication or account verification was rejected.
         */
        tds2_trans_result: ThreeDSecureAuthResult

        /**
         * Reason of result of 3D Secure 2.0 authentication.
         */
        tds2_trans_result_reason: string
    }

    /**
     * Status of a payment.
     * 
     * - `UNPROCESSED`: This payment has been registered but no action has been taken yet.
     * - `CHECK`: This payment is only used for checking if the card is valid or not.
     * - `AUTHORIZED`: Card authorization was already accepted. So this payment is waiting for capturing.
     * - `CAPTURED`: The sale from this payment has already been captured.
     * - `CANCELED`: This payment is canceled by request.
     * - `AUTHENTICATED`: 3D Secure Authentication has already finished. So this payment is awaiting for Payment-After-3DSecure (PUT /v1/payments/{id}/secure)
     */
    export type Status = "UNPROCESSED" | "CHECKED" | "AUTHORIZED" | "CAPTURED" | "CANCELED" | "AUTHENTICATED";

    /**
     * 3D Secure authentication result.
     * 
     * - `Y`: Authentication or bank account successfully verified.
     * - `N`: Unauthorized or account could not be verified, or the payment was rejected.
     * - `U`: Authentication or account verification could not be performed.
     * - `A`: A trial of the authentication process was conducted.
     * - `C`: Required 3D Secure authentication challenge.
     * - `R`: Authentication or account verification was rejected.
     */
    export type ThreeDSecureAuthResult = "Y" | "N" | "U" | "A" | "C" | "R"
}