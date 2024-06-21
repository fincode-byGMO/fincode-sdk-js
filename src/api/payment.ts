import * as Card from "./card"

/**
 * Accepted payment method in this payment. 
 * 
 * - `Card`: this payment accepts card.
 * - `Konbini`: this payment accepts konbini.
 * - `PayPay`: this payment accepts PayPay.
 * - `Applepay`: this payment accepts Apple Pay.
 * - `Directdebit`: this payment accepts Direct Debit.
 * - `Virtualaccount`: this payment accepts Virtual Account.
 */
export type PayType = "Card" | "Konbini" | "PayPay" | "Applepay" | "Directdebit" | "Virtualaccount"

/**
 * Payment Job Code
 * - `CHECK`: fincode checks if the card is valid
 * - `AUTH`: fincode authorizes a charge.
 * - `CAPTURE`: fincode captures authorized payment.
 * - `SALES`: this payment is counted as sales.
 * - `CANCEL`: this payment is canceled.
 */
export type PaymentJobCode = "CHECK" | "AUTH" | "CAPTURE" | "SALES" | "CANCEL"

/**
 * Payment Object
 */
export type PaymentObject = {
    /**
     * Shop ID that registered this payment.
     */
    shop_id: string

    /**
     * Payment ID. (sometimes called "Order ID")
     */
    id: string

    /**
     * Accepted payment method in this payment. 
     * 
     * - `Card`: this payment accepts card.
     * - `Konbini`: this payment accepts konbini.
     * - `Paypay`: this payment accepts PayPay.
     * - `Applepay`: this payment accepts Apple Pay.
     * - `Directdebit`: this payment accepts Direct Debit.
     * - `Virtualaccount`: this payment accepts Virtual Account.
     */
    pay_type: PayType

    /**
     * Status payment.
     * 
     * - `UNPROCESSED`: This payment has been registered but no action has been taken yet.
     * - `CHECK`: This payment is only used for checking if the card is valid or not.
     * - `AUTHORIZED`: Card authorization was already accepted. So this payment is waiting for capturing.
     * - `CAPTURED`: The sale from this payment has already been captured.
     * - `CANCELED`: This payment is canceled by request.
     * - `AUTHENTICATED`: 3D Secure Authentication has already finished. So this payment is awaiting for Payment-After-3DSecure (PUT /v1/payments/{id}/secure)
     */
    status: PaymentStatus

    /**
     * This value will be used in this payment context.
     */
    access_id: string

    /**
     * The date this payment was processed.
     * 
     * Format: `yyyy/MM/DD HH:mm:ss.SSS`
     */
    process_date: string

    /**
     * Job category payment.
     * 
     * - `CHECK`: fincode checks if the card is valid.
     * - `AUTH`: fincode authorizes a charge.
     * - `CAPTURE`: fincode captures authorized payment.
     */
    job_code?: Extract<PaymentJobCode, "CHECK" | "AUTH" | "CAPTURE"> | null

    /**
     * The term payment is available in Konbini or Virtual Account.
     */
    payment_term_day?: string | null

    /**
     * The deadline of payment in Konbini or Virtual Account.
     */
    payment_term?: string | null

    /**
     * Code string identifying the product category.
     */
    item_code?: string | null

    /**
     * Amount payment. this value must be in range of `"0"` to `"9999999"`.
     * If "job_code" param's value is "AUTH" or "CAPTURE", then this param become required.
     */
    amount?: number | null

    /**
     * Tax and shipping fee. if this param is set, "amount" param must also be set.
     */
    tax?: number | null

    /**
     * Sum of "amount" and "tax".
     */
    total_amount?: number | null

    /**
     * If your shop type is "platform" and does not shareing customers between tenants, this param will be set some group id.
     */
    customer_group_id?: string | null

    /**
     * If some customer is used in this payment, this field will be filled it's id (Customer ID).
     */
    customer_id?: string | null

    /**
     * Overpayment flag.
     * 
     * if customer overpaid, this flag will be set to `1`.
     */
    overpayment_flag?: "0" | "1" | null

    /**
     * Cancel overpayment flag.
     * 
     * if customer paid after canceling, this flag will be set to `1`.
     */
    cancel_overpayment_flag?: "0" | "1" | null

    /**
     * Expire overpayment flag.
     * 
     * if customer paid after expiration, this flag will be set to `1`.
     */
    expire_overpayment_flag?: "0" | "1" | null

    /**
     * Date this payment was created.
     * 
     * Format: yyyy/MM/dd HH:mm:ss.SSS
     */
    created?: string | null

    /**
     * Date this payment was updated.
     * 
     * Format: yyyy/MM/dd HH:mm:ss.SSS
     */
    updated?: string | null

    // ---
    // Card Payment
    // ---

    /**
     * Masked card number used in this payment. (e.g. `************9999`)
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    card_no?: string | null

    /**
     * Card ID used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    card_id?: string | null

    /**
     * Payment Method ID used in this payment.
     */
    payment_method_id?: string | null

    /**
     * The expiring date of the card used in this payment. 
     * Format: `yymm`, e.g. `3011` means 2030/11
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    expire?: string | null

    /**
     * Holder name of the card used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    holder_name?: string | null

    /**
     * hashed card number the card used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    card_no_hash?: string | null

    /**
     * Charging method of card payment.
     * 
     * - `1`: The customer will be charged for this payment in a lump-sum.
     * - `2`: The customer will be charged for this payment in several installments.
     */
    method?: "1" | "2" | null

    /**
     * The number of installments that will charge to the customer in this payment registered as installment payment.
     */
    pay_times?: string | null

    /**
     * Value that identifies the company to which fincode requests payment processing.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    forward?: string | null

    /**
     * Issuer of the card used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    issuer?: string | null

    /**
     * Transaction ID payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    transaction_id?: string | null

    /**
     * Approval number payment issued by the card acquirer.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    approve?: string | null

    /**
     * Limit date you can capture this authenticated payment.
     */
    auth_max_date?: string | null

    /**
     * Fields where merchants can freely set values
     */
    client_field_1?: string | null
    client_field_2?: string | null
    client_field_3?: string | null

    /**
     * Defines the behavior of 3D Secure 2
     * 
     * - `0`: Not use 3D Secure 2.
     * - `2`: Use 3D Secure 2 Authentication
     */
    tds_type?: "0" | "2" | null

    /**
     * Defines the behavior payment when the card used in this payment does not support 3D Secure 2 
     * 
     * - `2`: fincode API will return HTTP Error(400) and not execute this payment.
     * - `3`: fincode API will execute this payment without 3D Secure 2 authentication. 
     */
    tds2_type?: "2" | "3" | null

    /**
     * Returning URL of your website when 3D Secure 2 authentication is completed.
     * 
     * For the URL specified in this field, the following values are passed with the redirect.
     * 
     * - `MD`: this value equals "access_id" and will return as query string.
     * - `requestorTransId`: this value will return as "application/x-www-form-urlencoded"
     * - `event`: this value will return as "application/x-www-form-urlencoded"
     * - `param`: this value will be used in 3D Secure 2 authentication after redirecting this url and return as "application/x-www-form-urlencoded".
     */
    tds2_ret_url?: string | null

    /**
     * The processing status of 3D Secure 2 authentication.
     * 
     * - `2`: fincode API will return HTTP Error(400) and not execute this payment.
     * - `3`: fincode API will execute this payment without 3D Secure 2 authentication. 
     */
    tds2_status?: "2" | "3" | null

    /**
     * The value will be used as your business name in redirect page of 3D Secure. 
     */
    merchant_name?: string | null

    /**
     * (Warning!) This field is no longer used.
     */
    send_url?: string | null

    /**
     * This field will be filled if this payment is created by subscription payment.
     */
    subscription_id?: string | null

    /**
     * This field will be filled if this payment is created by bulk payment.
     */
    bulk_payment_id?: string | null

    /**
     * Card Brand of the card used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    brand?: Card.CardBrand | null

    /**
     * Error code if some error has occured in this payment.
     * 
     * Go to https?://docs.fincode.jp/develop_support/error to learn more about errors.
     */
    error_code?: string | null

    // ---
    // Konbini Payment
    // ---

    /**
     * Device name that displays barcode image.
     * 
     * You can use the value of 
     *  - `UserAgent Client Hints` API when barcode will be displayed on Browser.
     *  - `Android.os.Build.MODEL` when barcode will be displayed on Android.
     *  - `"iPhone"` (fixed value) when barcode will be displayed on iOS.
     */
    device_name?: string | null

    /**
     * OS version.
     */
    os_version?: string | null

    /**
     * Window width.
     */
    win_width?: string | null

    /**
     * Window height.
     */
    win_height?: string | null

    /**
     * x dpi.
     */
    xdpi?: string | null

    /**
     * y dpi.
     */
    ydpi?: string | null

    /**
     * The processing result of konbini payment provider.
     */
    result?: KonbiniPaymentProviderProcessResult | null

    /**
     * Order serial ID
     */
    order_serial?: string | null

    /**
     * Invoice ID
     */
    invoice_id?: string | null

    /**
     * Barcode image that encoded by base64.
     */
    barcode?: string | null

    /**
     * Barcode image format.
     */
    barcode_format?: "png" | "jpg" | "bmp" | null

    /**
     * Barcode image width.
     */
    barcode_width?: string | null

    /**
     * Barcode image height.
     */
    barcode_height?: string | null

    /**
     * Konbini code.
     * 
     * 
     * - `00010`: Seven-Eleven
     * - `00020`: Lawson
     * - `00050`: Daily Yamazaki and other stores
     * - `00080`: Mini Stop
     * - `00760`: Seicomart 
     */
    konbini_code?: KonbiniCode | null

    /**
     * Konbini store code.
     */
    konbini_store_code?: string | null

    // ---
    // PayPay Payment
    // ---

    /**
     * The date PayPay QR Code URL expires.
     * 
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    cpde_expiry_date?: string | null

    /**
     * Order description that customer can read on PayPay app.
     */
    order_description?: string | null

    /**
     * Capturing order description that customer can read on PayPay app.
     */
    capture_description?: string | null

    /**
     * Amount updating order description that customer can read on PayPay app.
     */
    update_description?: string | null

    /**
     * Canceling order description that customer can read on PayPay app.
     */
    cancel_description?: string | null

    /**
     * Redirect URL that customer will be redirected after finishing payment on PayPay app/website.
     */
    redirect_url?: string | null

    /**
     * Redirect Type of PayPay payment.
     * 
     * - `1`: Web browser. PayPay app/website will open your redirect URL on web browser.
     * - `2`: Native App. PayPay app/website will open your redirect URL on your app.
     */
    redirect_type?: "1" | "2" | null

    /**
     * Store ID of your shop registered on PayPay.
     */
    store_id?: string | null

    /**
     * Code ID of PayPay payment.
     */
    code_id?: string | null

    /**
     * Code URL of PayPay payment. Customer can pay to access this URL.
     */
    code_url?: string | null

    /**
     * Payment ID created by PayPay.
     */
    payment_id?: string | null

    /**
     * Payment result code of PayPay payment.
     */
    payment_result_code?: string | null

    /**
     * Transaction ID created by PayPay.
     */
    merchant_payment_id?: string | null

    /**
     * Transaction Capturing ID created by PayPay.
     */
    merchant_capture_id?: string | null

    /**
     * Transaction Updating ID created by PayPay.
     */
    merchant_update_id?: string | null

    /**
     * Transaction Reverting ID created by PayPay.
     */
    merchant_revert_id?: string | null

    /**
     * Transaction Refunding ID created by PayPay.
     */
    merchant_refund_id?: string | null

    /**
     * The date of PayPay payment was executed.
     * 
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    payment_date?: string | null

    // ---
    // Apple Pay Payment
    // ---

    // ---
    // Direct Debit Payment
    // ---

    /**
     * Target date (The date direct debit billing will be executed.)
     */
    target_date?: string | null

    /**
     * Withdrawal date (The date direct debit billing was executed.)
     */
    withdrawal_date?: string | null

    /**
     * End date of accepting payment request.
     */
    request_accept_end_date?: string | null

    /**
     * The date result of transfer will be notified.
     */
    transfer_return_date?: string | null

    /**
     * Bank code of the bank account used in this direct debit payment.
     */
    bank_code?: string | null

    /**
     * Bank name of the bank account used in this direct debit payment.
     */
    bank_name?: string | null

    /**
     * Branch code of the bank account used in this direct debit payment.
     */
    branch_code?: string | null

    /**
     * Branch name of the bank account used in this direct debit payment.
     */
    branch_name?: string | null

    /**
     * Usage details that will be displayed on the customer's bank statement.
     */
    remarks?: string | null

    /**
     * Result code of direct debit payment (returned by the direct debit payment provider.)
     */
    result_code?: DirectDebitResultCode | null

    // ---
    // Virtual Account Payment
    // ---

    /**
     * Billing amount of Virtual Account payment.
     */
    billing_amount?: number | null

    /**
     * Billing tax of Virtual Account payment.
     */
    billing_tax?: number | null

    /**
     * Billing total amount of Virtual Account payment.
     */
    billing_total_amount?: number | null

    /**
     * Branch code of the virtual account used in this payment.
     */
    va_branch_code?: string | null

    /**
     * Branch name of the virtual account used in this payment.
     */
    va_branch_name?: string | null

    /**
     * Account number of the virtual account used in this payment.
     */
    va_account_number?: string | null

    /**
     * Account holder name of the virtual account used in this payment.
     */
    va_account_name?: string | null

    /**
     * The date this virtual account was assigned.
     * 
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    account_assignment_date?: string | null

    /**
     * Virtual account identifier.
     */
    virtual_account_id?: string | null

    /**
     * The date this virtual account was paid.
     * 
     * Format: `yyyy/MM/dd`
     */
    transaction_date?: string | null

    /**
     * The business day of the virtual account payment was processed by the bank.
     * 
     * Format: `yyyy/MM/dd`
     */
    value_date?: string | null

    /**
     * Remitter account holder name of the virtual account payment.
     */
    remitter_account_name?: string | null

    /**
     * Remitter bank name of the virtual account payment.
     */
    remitter_bank_name?: string | null

    /**
     * Remitter branch name of the virtual account payment.
     */
    remitter_branch_name?: string | null
}

/**
 * The processing result of konbini payment provider.
 * 
 * - `000`: Success.
 * - `001`: Authorization failed.
 * - `002`: Succeeded registration but no barcode image issued because of absence of device information.
 * - `003`: Required parameter is missing.
 * - `004`: Invalid identifier.
 * - `005`: Invalid maker code.
 * - `006`: Invalid corporate identification code.
 * - `007`: Payment due date is past due or not in correct format.
 * - `008`: Invalid payment amount.
 * - `009`: Invalid whole check digit.
 * - `010`: Some error has occured in payment provider.
 * - `011`: Invalid stamp flag.
 * - `012`: Specified value of terminal information has an incorrect number of digits.
 * - `013`: Same barcode has already been issued.
 * - `900`: Unknown error.
 */
export type KonbiniPaymentProviderProcessResult =
    "000" |
    "001" |
    "002" |
    "003" |
    "004" |
    "005" |
    "006" |
    "007" |
    "008" |
    "009" |
    "010" |
    "011" |
    "012" |
    "013" |
    "900"

/**
 * The code of konbini.
 * 
 * - `00010`: Seven-Eleven
 * - `00020`: Lawson
 * - `00050`: Daily Yamazaki and other stores
 * - `00080`: Mini Stop
 * - `00760`: Seicomart 
 */
export type KonbiniCode =
    "00010" |
    "00020" |
    "00050" |
    "00080" |
    "00760"

/**
 * Request object of Executing payment (used for PUT /v1/payments/{id})
 */
export type ExecutingPaymentRequest = {
    /**
     * Payment method you want to use in this payment execution.
     * 
     * - `Card`: card payment.
     * - `Konbini`: konbini payment.
     * - `Paypay`: PayPay payment.
     * - `Applepay`: Apple Pay payment.
     * - `Directdebit`: Direct Debit payment.
     * - `Virtualaccount`: Virtual Account payment.
     */
    pay_type: PayType

    /**
     * access ID issued for this payment to use in this payment context.
     */
    access_id: string

    // ---
    // Card Payment
    // ---

    /**
     * One-time token that used to identify card that will be used in this payment.
     * 
     * You must fill this field or both "card_id" and "customer_id" fields.
     */
    token?: string | null

    /**
     * The expiring date of the card used in this payment.
     * 
     * Format: `yymm`, e.g. `3011` means 2030/11
     */
    expire?: string | null

    /**
     * Customer's customer ID that will be charged because payment.
     * 
     * You must fill both this and "card_id" fields or "token" field.
     */
    customer_id?: string | null

    

    /**
     * The term payment is available.
     * 
     * (You can use this field when `pay_type` is `Konbini` or `Virtualaccount`)
     * 
     * - min: `"0"`
     * - max: `"14"`
     */
    payment_term_day?: string | null

    /**
     * Customer's payment method ID that will be used in this payment. 
     * 
     * (You can use this field when `pay_type` is `Card` or `Directdebit`)
     */
    payment_method_id?: string | null

    // ---
    // card payment
    // ---

    /**
     * Customer's card ID that will be used in this payment.
     * 
     * You must fill both this and "customer_id" fields or "token" field.
     */
    card_id?: string | null

    /**
     * Charging method of card payment.
     * 
     * - `1`: The customer will be charged for this payment in a lump-sum.
     * - `2`: The customer will be charged for this payment in several installments.
     * 
     * You must fill this field when this payment's job_type is `AUTH` or `CAPTURE`
     */
    method?: "1" | "2" | null

    /**
     * The number of installments that will charge to the customer in this payment registered as installment payment.
     */
    pay_times?: string | null

    /**
     * Holder name of the card used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    holder_name?: string | null


    // ---------------------------
    // 3D Secure 2 Params
    // ---------------------------

    /**
     * Returning URL of your website when 3D Secure 2 authentication is completed.
     * 
     * For the URL specified in this field, the following values are passed with the redirect.
     * 
     * - MD?: this value equals "access_id" and will return as query string.
     * - requestorTransId?: this value will return as "application/x-www-form-urlencoded"
     * - event?: this value will return as "application/x-www-form-urlencoded"
     * - param?: this value will be used in 3D Secure 2 authentication after redirecting this url and return as "application/x-www-form-urlencoded".
     */
    tds2_ret_url?: string | null

    /**
     * Date the account who requests 3D Secure 2 was last updated.
     * 
     * Format: `yyyyMMdd`
     */
    tds2_ch_acc_change?: string | null

    /**
     * Date the account who requests 3D Secure 2 was created.
     * 
     * Format: `yyyyMMdd`
     */
    tds2_ch_acc_date?: string | null

    /**
     * Date the password of the account who requests 3D Secure 2 was changed.
     * 
     * Format: `yyyyMMdd`
     */
    tds2_ch_acc_pw_change?: string | null

    /**
     * Number of purchases made by the customer in the past 6 months.
     */
    tds2_nb_purchase_account?: string | null

    /**
     * Date the card was registered.
     * 
     * Format: `yyyyMMdd`
     */
    tds2_payment_acc_age?: string | null

    /**
     * Number of attempts to add cards in the past 24 hours.
     */
    tds2_provision_attempts_day?: string | null

    /**
     * Date of first use of shipping address.
     * 
     * Format: `yyyyMMdd`
     */
    tds2_ship_address_usage?: string | null

    /**
     * Customer name owning the card used in this payment and ship-to name matches or not.
     * 
     * - `01`: Matches
     * - `02`: Not match
     */
    tds2_ship_name_ind?: "01" | "02" | null

    /**
     * There is misconduct of the customer or not.
     * 
     * - `01`: There is no misconduct.
     * - `02`: There are some misconduct.
     */
    tds2_suspicious_acc_activity?: "01" | "02" | null

    /**
     * Number of transactions in the last 24 hours.
     */
    tds2_txn_activity_day?: string | null

    /**
     * Number of transactions in the previous year.
     */
    tds2_txn_activity_year?: string | null

    /**
     * Login trails.
     */
    tds2_three_ds_req_auth_data?: string | null

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
    tds2_three_ds_req_auth_method?: "01" | "02" | "03" | "04" | "05" | null

    /**
     * Date the customer logged in.
     * 
     * Format: `yyyyMMddHHmm`
     */
    tds2_three_ds_req_auth_timestamp?: string | null

    /**
     * Billing address and shipping address match or not.
     * 
     * - `Y`: Match.
     * - `N`: Not Match.
     */
    tds2_addr_match?: "Y" | "N" | null

    /**
     * City of the cardholder's billing address.
     */
    tds2_bill_addr_city?: string | null

    /**
     * ISO 3166-1 numeric country code of the cardholder's billing address.
     */
    tds2_bill_addr_country?: string | null

    /**
     * 1st line of the cardholder's billing address.
     */
    tds2_bill_addr_line_1?: string | null

    /**
     * 2nd line of the cardholder's billing address.
     */
    tds2_bill_addr_line_2?: string | null

    /**
     * 3rd line of the cardholder's billing address.
     */
    tds2_bill_addr_line_3?: string | null

    /**
     * Postal code of the cardholder's billing address.
     */
    tds2_bill_addr_post_code?: string | null

    /**
     * ISO 3166-2 state code of the cardholder's billing address.
     */
    tds2_bill_addr_state?: string | null

    /**
     * the cardholder's email.
     */
    tds2_email?: string | null

    /**
     * Country Code of cardholder's home phone.
     */
    tds2_home_phone_cc?: string | null

    /**
     * Number of cardholder's home phone.
     */
    tds2_home_phone_no?: string | null

    /**
     * Country Code of cardholder's mobile phone.
     */
    tds2_mobile_phone_cc?: string | null

    /**
     * Number of cardholder's mobile phone.
     */
    tds2_mobile_phone_no?: string | null

    /**
     * Country Code of cardholder's phone for work.
     */
    tds2_work_phone_cc?: string | null

    /**
     * Number of cardholder's phone for work.
     */
    tds2_work_phone_no?: string | null

    /**
     * City of the cardholder's shipping address.
     */
    tds2_ship_addr_city?: string | null

    /**
     * ISO 3166-1 numeric country code of the cardholder's shipping address.
     */
    tds2_ship_addr_country?: string | null

    /**
     * 1st line of the cardholder's shipping address.
     */
    tds2_ship_addr_line_1?: string | null

    /**
     * 2nd line of the cardholder's shipping address.
     */
    tds2_ship_addr_line_2?: string | null

    /**
     * 3rd line of the cardholder's shipping address.
     */
    tds2_ship_addr_line_3?: string | null

    /**
     * Postal code of the cardholder's shipping address.
     */
    tds2_ship_addr_post_code?: string | null

    /**
     * ISO 3166-2 state code of the cardholder's shipping address.
     */
    tds2_ship_addr_state?: string | null

    /**
     * the cardholder's email.
     */
    tds2_delivery_email_address?: string | null

    /**
     * Product Delivery Timeframe.
     * 
     * - `01`: electronic delivery.
     * - `02`: ship today.
     * - `03`: ship at next day.
     * - `04`: ship after 2 days or later.
     */
    tds2_delivery_timeframe?: "01" | "02" | "03" | "04" | null

    /**
     * Total amount of purchased prepaid or gift card.
     */
    tds2_gift_card_amount?: string | null

    /**
     * Count of purchased prepaid or gift card.
     */
    tds2_gift_card_count?: string | null

    /**
     * ISO 4217 currency code of purchased prepaid or gift card.
     */
    tds2_gift_card_curr?: string | null

    /**
     * Estimated date of product release.
     * 
     * Format: `yyyyMMdd`
     */
    tds2_pre_order_date?: string | null

    /**
     * 
     */
    tds2_pre_order_purchaselnd?: string | null

    /**
     * 
     */
    tds2_reorder_items_ind?: string | null

    /**
     * 
     */
    tds2_ship_ind?: string | null

    /**
     * Expiring date of recurring billing.
     * 
     * Format: `yyyyMMdd`
     */
    tds2_recuring_expiry?: string | null

    /**
     * Minimum interval days of recurring billing.
     */
    tds2_recuring_frequency?: string | null

    // ---
    // Konbini payment
    // ---

    /**
     * Device name.
     * 
     * You can use the value of 
     *  - `UserAgent Client Hints` API when barcode will be displayed on Browser.
     *  - `Android.os.Build.MODEL` when barcode will be displayed on Android.
     *  - `"iPhone"` (fixed value) when barcode will be displayed on iOS.
     * 
     */
    device_name?: string | null

    /**
     * Window width. (px)
     */
    win_width?: string | null

    /**
     * Window height. (px)
     */
    win_height?: string | null

    /**
     * Device pixel ratio.
     * 
     * You can retrieve value for this from `Window.devicePixelRatio`
     * 
     * See also: [Window.devicePixelRatio @ MDN](https://developer.mozilla.org/docs/Web/API/Window/devicePixelRatio)
     */
    pixel_ratio?: string | null

    /**
     * Window size type.
     * 
     * - `1`: Device pixel (Android)
     * - `2`: CSS pixel (iOS & Browser)
     */
    win_size_type?: "1" | "2" | null

    // ---
    // PayPay payment
    // ---

    /**
     * Redirect URL that customer will be redirected after finishing payment on PayPay app/website.
     */
    redirect_url?: string | null

    /**
     * Redirect Type of PayPay payment.
     * 
     * - `1`: Web browser. PayPay app/website will open your redirect URL on web browser.
     * - `2`: Native App. PayPay app/website will open your redirect URL on your app.
     */
    redirect_type?: "1" | "2" | null

    /**
     * User Agent information of the browser of your URL that customer will be redirected after finishing payment on PayPay app/website.
     */
    user_agent?: string | null
    
    //---
    // Apple Pay Payment
    //---

    //---
    // Direct Debit Payment
    //---

    /**
     * Target date (The date direct debit billing will be executed.)
     * 
     * Format: `yyyy/MM/dd`
     */
    target_date?: string | null

    //---
    // Virtual Account Payment
    //---

    /**
     * If you want to use same Virtual Account for multiple payments, you can set the reference ID of Virtual Account payment.
     */
    reference_order_id?: string | null

    /**
     * Account Name of Virtual Account.
     * (Use the statement notation registered in the fincode shop info.)
     */
    account_shop_name?: string | null
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
export type PaymentStatus = "UNPROCESSED" | "CHECKED" | "AUTHORIZED" | "CAPTURED" | "CANCELED" | "AUTHENTICATED"


/**
 * Result code of direct debit payment. (returned by the direct debit payment provider.)
 * 
 * - `0`: Success.
 * - `1`: Failed due to insufficient balance.
 * - `2`: Failed because the bank account does not exist.
 * - `3`: Failed due to buyer's action.
 * - `4`: Failed due to missing or incomplete request form. This occurs when the direct debit request form is not registered with the financial institution.
 * - `8`: Failed because there are something wrong with the requester shop.
 * - `9|E|N`: Failed because of some abnormal error. (Please contact fincode support.)
 */
export type DirectDebitResultCode =
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "9"
    | "E"
    | "N"
