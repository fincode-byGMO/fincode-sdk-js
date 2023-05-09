declare module "api/card" {
    export namespace Card {
        /**
         * Card object
         */
        type CardObject = {
            /**
             * Customer ID of customer who owns this card.
             */
            customer_id: string;
            /**
             * Card ID of this.
             */
            id: string;
            /**
             * Flag that means the customer uses this card by default or not.
             *
             * - `0`: OFF
             * - `1`: ON
             */
            default_flag: "0" | "1";
            /**
             * Masked card number used in this payment. (e.g. `************9999`)
             */
            card_no: string;
            /**
             * The expiring date of the card used in this payment.
             * Format: `yymm`, e.g. `3011` means 2030/11
             *
             * If any card have not been used in this payment yet, this field will be null.
             */
            expire: string;
            /**
             * Holder name of the card used in this payment.
             *
             * If any card have not been used in this payment yet, this field will be null.
             */
            holder_name: string;
            /**
             * hashed card number the card used in this payment.
             *
             * If any card have not been used in this payment yet, this field will be null.
             */
            card_no_hash: string;
            /**
             * Date this card was created.
             *
             * Format: YYYY/MM/dd HH:mm:ss.SSS
             */
            created: string;
            /**
             * Date this card was updated.
             *
             * Format: YYYY/MM/dd HH:mm:ss.SSS
             */
            updated: string;
            /**
             * Card types
             *
             * - `0`: Unknown card type.
             * - `1`: Debit card.
             * - `2`: Prepaid card.
             * - `3`: Credit card.
             */
            type: CardType;
            /**
             * Card brands user can use in fincode.
             *
             * - `VISA`: Visa card.
             * - `MASTER`: Mastercard card.
             * - `JCB`: JCB card.
             * - `AMEX`: American Express card.
             * - `Diners`: DinersClub card.
             */
            brand: Brand;
        };
        /**
         * Card brands user can use in fincode.
         *
         * - `VISA`: Visa card.
         * - `MASTER`: Mastercard card.
         * - `JCB`: JCB card.
         * - `AMEX`: American Express card.
         * - `Diners`: DinersClub card.
         */
        type Brand = "VISA" | "MASTER" | "JCB" | "AMEX" | "DINERS";
        /**
         * Card types
         *
         * - `0`: Unknown card type.
         * - `1`: Debit card.
         * - `2`: Prepaid card.
         * - `3`: Credit card.
         */
        type CardType = "0" | "1" | "2" | "3";
        /**
         * Request object of Registering Card (used in POST /v1/customers/{customer_id}/cards)
         */
        type RegisteringRequest = {
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
        };
        /**
         * Request object of Updating Card (used in PUT /v1/customers/{customer_id}/cards/{id})
         */
        type UpdatingRequest = {
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
        };
        /**
         * Response object of Deleting Card (used in DELETE /v1/customers/{customer_id}/cards/{id})
         */
        type DeletingResponse = {
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
        };
    }
}
declare module "api/payment" {
    import { Card } from "api/card";
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
            created: string;
            /**
             * Date this payment was updated.
             *
             * Format: YYYY/MM/dd HH:mm:ss.SSS
             */
            updated: string;
        };
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
        };
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
        };
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
        };
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
        };
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
        };
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
        };
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
         * Request object of Executing 3D Secure authentication (used PUT /v1/secures/{access_id})
         */
        export type Executing3DSecureAuthRequest = {
            /**
             * Browser information returned to the URL you set for "tds2_ret_url" parameter of response of PUT /v1/payments/{id}.
             */
            param: string;
        };
        /**
         * Response object of Executing 3D Secure authentication (used PUT /v1/secures/{access_id})
         */
        export type Executing3DSecureAuthResponse = Readonly<_Executing3DSecureAuthResponse>;
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
            tds2_trans_result: ThreeDSecureAuthResult;
            /**
             * Reason of result of 3D Secure 2.0 authentication.
             */
            tds2_trans_result_reason: string;
            /**
             * URL to use if 3D Secure authentication challenge was required.
             */
            challenge_url: string;
        };
        /**
         * Response object of Retrieving 3D Secure authentication result (used GET /v1/secures/{access_id})
         */
        export type Retrieving3DSecureAuthResponse = Readonly<_Retrieving3DSecureAuthResponse>;
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
            tds2_trans_result: ThreeDSecureAuthResult;
            /**
             * Reason of result of 3D Secure 2.0 authentication.
             */
            tds2_trans_result_reason: string;
        };
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
        export type ThreeDSecureAuthResult = "Y" | "N" | "U" | "A" | "C" | "R";
        export {};
    }
}
declare module "api/token" {
    export namespace Token {
        /**
         * Response object of Issuing card token (used in Fincode.tokens())
         */
        type IssuingResponse = {
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
        };
    }
}
declare module "js/ui" {
    export interface FincodeUI {
        /**
         *
         * create fincode UI component for iframe embedding.
         */
        create: (method: "payments" | "cards" | "token", appearance: Appearance) => void;
        /**
         *
         * mount fincode ui.
         *
         * before calling this, call `UI.create(method, appearance)` method.
         */
        mount: (elementId: string, width: string) => void;
        /**
         *
         * get form data from UI component.
         *
         */
        getFormData: () => Promise<FormData>;
    }
    export type Appearance = {
        /**
         * Declare UI Layout
         *
         * - `horizontal`: The elements that make up the form are aligned vertically, and the mounted form will be vertical.
         * - `vertical`: The elements that make up the form will spread horizontally, and the mounted form will be horizontal.
         *
         * default `vertical`
         */
        layout?: "horizontal" | "vertical";
        /**
         * Customer ID
         */
        customerId?: string | null;
        /**
         * Hiding label text.
         *
         * - `false`: Show label text.
         * - `true`: Hide label text.
         *
         * default `false`
         */
        hideLabel?: boolean;
        /**
         * Hiding card holder name.
         *
         * - `false`: Show card holder.
         * - `true`: Hide label text.
         *
         * default `false`
         */
        hideHolderName?: boolean;
        /**
         * Hide payment times.
         *
         * - `false`: Show radio buttons they allow customer to select payment times.
         * - `true`: Hide radio buttons.
         *
         * default `false`
        */
        hidePayTimes?: boolean;
        /**
         * Change label text of card number field.
         */
        labelCardNo?: string;
        /**
         * Change label text of card expires month field.
         */
        labelExpire?: string;
        /**
         * Change label text of CVC field.
         */
        labelCVC?: string;
        /**
         * Change label text of card holder name field.
         */
        labelHolderName?: string;
        /**
         * Change label text of payment method field.
         */
        labelPaymentMethod?: string;
        /**
         * Change placeholder text of card number field.
         */
        cardNo?: string;
        /**
         * Change placeholder text of card expiring year field.
         */
        expireYear?: string;
        /**
         * Change placeholder text of card expiring month field.
         */
        expireMonth?: string;
        /**
         * Change placeholder text of CVC field.
         */
        cvc?: string;
        /**
         * Change background color of this ui component.
         */
        colorBackground?: string;
        /**
         * Change background input text color of this ui component.
         */
        colorBackgroundInput?: string;
        /**
         * Change text color of this ui component.
         */
        colorText?: string;
        /**
         * Change placeholder text color of this ui component.
         */
        colorPlaceHolder?: string;
        /**
         * Change label text color of this ui component.
         */
        colorLabelText?: string;
        /**
         * Change input border color of this ui component.
         */
        colorBorder?: string;
        /**
         * Change error message text color of this ui component.
         */
        colorError?: string;
        /**
         * Change check text color of this ui component.
         */
        colorCheck?: string;
        /**
         * Change font family of this ui component.
         */
        fontFamily?: string;
    };
    export type FormData = {
        /**
         * Card ID
         */
        cardId?: string;
        /**
         * Number of installment payments
         */
        payTimes: string;
        /**
         * Payment method
         */
        method: "1" | "2";
        /**
         * Card number
         */
        cardNo?: string;
        /**
         * CVC
         */
        CVC?: string;
        /**
         * Year and month the card expires
         *
         * format: `yyMM`
         */
        expire?: string;
        /**
         * Year the card expires
         */
        expireYear?: string;
        /**
         * Month the card expires
         */
        expireMonth?: string;
        /**
         * Card holder name
         */
        holderName?: string;
    };
}
declare module "js/fincode" {
    import { Card } from "api/card";
    import { Payment } from "api/payment";
    import { Token } from "api/token";
    import { Appearance, FincodeUI } from "js/ui";
    export type FincodeInitializer = (apiKey: string) => FincodeInstance;
    export type FincodeInstance = {
        tokens: (card: {
            card_no: string;
            expire: string;
            security_code?: string;
            holder_name?: string;
            number?: number;
        }, callback: (status: number, response: Token.IssuingResponse) => void, errorCallback: () => void) => void;
        cards: (card: {
            card_id?: string;
            customer_id: string;
            default_flag?: "0" | "1";
            card_no?: string;
            expire?: string;
            security_code?: string;
            holder_name?: string;
        }, callback: (status: number, response: Card.CardObject) => void, errorCallback: () => void) => void;
        payments: (transaction: {
            pay_type: "Card";
            access_id: string;
            id: string;
            card_no?: string;
            expire?: string;
            customer_id?: string;
            card_id?: string;
            method: "1" | "2";
            pay_times?: string;
            security_code?: string;
            holder_name?: string;
        }, callback: (status: number, response: Payment.PaymentObject) => void, errorCallback: () => void) => void;
        ui: (appearance: Appearance) => FincodeUI;
    };
}
declare module "global" {
    import { FincodeInitializer } from "js/fincode";
    global {
        interface Window {
            Fincode: FincodeInitializer;
        }
    }
}
declare module "main" {
    import { FincodeInstance } from "js/fincode";
    export type FincodeConfig = {};
    export type FincodeLoaderFn = (publicKey: string, isProduction?: boolean, config?: FincodeConfig) => () => Promise<FincodeInstance | null>;
    export const initFincode: FincodeLoaderFn;
}
declare module "api/api" {
    export type APIErrorResponse = {
        errors: APIError[];
    };
    export type APIError = {
        error_code: string;
        error_messaage: string;
    };
}
declare module "util" {
    import { Card } from "api/card";
    import { Payment } from "api/payment";
    import { Token } from "api/token";
    import { FincodeInstance } from "js/fincode";
    import { FincodeUI } from "js/ui";
    /**
     *
     * @param fincode instance of fincode
     * @param id Order ID
     * @param pay_type payment method type
     * @param access_id Access ID
     * @param use specify how to execute payment, either using ui or using customer_id and card_id
     * @returns {Promise<Payment.PaymentObject>}
     */
    export const executePayment: (fincode: FincodeInstance, id: Parameters<FincodeInstance["payments"]>[0]["id"], pay_type: Parameters<FincodeInstance["payments"]>[0]["pay_type"], access_id: Parameters<FincodeInstance["payments"]>[0]["access_id"], use: {
        ui?: FincodeUI;
        customer_id?: Parameters<FincodeInstance["payments"]>[0]["customer_id"];
        card_id?: Parameters<FincodeInstance["payments"]>[0]["card_id"];
    }) => Promise<Payment.PaymentObject>;
    /**
     * get card token with data inputed in mounted ui
     *
     * @param {FincodeInstance} fincode instance of fincode
     * @param {FincodeUI} ui ui that has been already initialized
     * @param {number} number number of token to be issued
     * @returns
     */
    export const getCardToken: (fincode: FincodeInstance, ui: FincodeUI, number?: number) => Promise<Token.IssuingResponse>;
    /**
     *
     * @param fincode fincode instance
     * @param ui ui that has been already initialized
     * @param customerId Customer ID who owns the card
     * @param useDefault Use this card by default or not
     * @returns
     */
    export const registerCard: (fincode: FincodeInstance, ui: FincodeUI, arg: {
        customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"];
        useDefault?: boolean;
    }) => Promise<Card.CardObject>;
    /**
     *
     * @param fincode fincode instance
     * @param ui ui that has been already initialized
     * @param cardId Card ID to be updated
     * @param customerId Customer ID who owns the card
     * @param useDefault Use this card by default
     * @returns
     */
    export const updateCard: (fincode: FincodeInstance, ui: FincodeUI, arg: {
        cardId: string;
        customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"];
        useDefault?: true;
    }) => Promise<Card.CardObject>;
}
declare module "api/customer" {
    export namespace Customer {
        /**
         * Customer object
         */
        type CustomerObject = {
            /**
             * Customer ID
             */
            id: string;
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
            created: string;
            /**
             * Date this customer was updated.
             *
             * Format: YYYY/MM/dd HH:mm:ss.SSS
             */
            updated: string;
            /**
             * Some card (payment method) has been registered for this customer or not.
             *
             * - `0`: There is no card (payment method).
             * - `1`: Some card (payment method) have already been registered.
             */
            card_registration: "0" | "1";
        };
        /**
         * Request object of Creating customer (used in POST /v1/customers)
         */
        type CreatingRequest = {
            /**
             * Customer ID
             */
            id: string;
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
        };
        /**
         * Request object of Updating customer (used in PUT /v1/customers/{id})
         */
        type UpdatingRequest = {
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
        };
        /**
         * Response object of Deleting customer (used in DELETE /v1/customers/{id})
         */
        type DeletingResponse = {
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
        };
    }
}
//# sourceMappingURL=main.d.ts.map