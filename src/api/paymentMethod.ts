import { CardBrand, CardType, CardUpdaterMode } from "./card"
import { DirectDebitResultCode, DirectDebitSettlementRoute } from "./payment"

/**
 * Status of a payment method.
 *
 * - `INACTIVATED`: This payment method cannot be used for payments yet.
 * - `AWAITING_CUSTOMER_ACTION`: The customer has not finished authenticating
 *   this payment method. It cannot be used for payments yet.
 * - `ACTIVATED`: This payment method can be used for payments.
 * - `FAILED`: This payment method cannot be used for payments.
 */
export type PaymentMethodStatus = "INACTIVATED" | "AWAITING_CUSTOMER_ACTION" | "ACTIVATED" | "FAILED"

/**
 * State of the 3D Secure 2 authentication of a payment method.
 *
 * - `AUTHENTICATING`: authentication is in progress.
 * - `CHALLENGE`: an authentication challenge is required.
 * - `AUTHENTICATED`: authentication finished.
 */
export type ThreeDSecure2Status = "AUTHENTICATING" | "CHALLENGE" | "AUTHENTICATED"

/**
 * Whether to authenticate the card with 3D Secure when registering it as a
 * payment method.
 *
 * - `0`: do not use 3D Secure. The payment method becomes `ACTIVATED` right
 *   away.
 * - `2`: use 3D Secure 2.0. The payment method becomes
 *   `AWAITING_CUSTOMER_ACTION` and the response carries a `redirect_url` to
 *   send the customer to.
 *
 * Defaults to `0` when left out.
 */
export type PaymentMethodTdsType = "0" | "2"

/**
 * Card details of a payment method.
 */
export type PaymentMethodCard = {
    /**
     * Masked card number. (e.g. `************9999`)
     */
    card_no: string

    /**
     * The date this card expires.
     *
     * Format: `yyMM`, e.g. `3011` means 2030/11
     */
    expire?: string | null

    /**
     * Card holder's name.
     */
    holder_name?: string | null

    /**
     * Hashed card number.
     */
    card_no_hash: string

    /**
     * Card type.
     */
    type?: CardType | null

    /**
     * Card brand.
     */
    brand?: CardBrand | null

    /**
     * Whether the card updater keeps this card's details up to date.
     */
    card_updater_mode?: CardUpdaterMode | null

    /**
     * Date the card details were last updated successfully.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    card_updater_last_success_date?: string | null

    /**
     * Date an update of the card details was last attempted.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    card_updater_last_attempt_date?: string | null

    /**
     * Whether 3D Secure was used when registering this card.
     */
    tds_type?: PaymentMethodTdsType | null

    /**
     * How to act when the card issuer does not support 3D Secure 2.0.
     */
    tds2_type?: "2" | "3" | null

    /**
     * URL the customer returns to after the 3D Secure 2 authentication.
     */
    tds2_ret_url?: string | null

    /**
     * State of the 3D Secure 2 authentication.
     */
    tds2_status?: ThreeDSecure2Status | null

    /**
     * Shop name shown on the 3D Secure 2 authentication screen.
     */
    merchant_name?: string | null

    /**
     * Access ID of the 3D Secure 2 authentication.
     */
    access_id?: string | null

    /**
     * Error code of the 3D Secure 2 authentication.
     */
    error_code?: string | null

    /**
     * Whether the card issuer supports 3D Secure 2.0.
     */
    acs?: string | null
}

/**
 * Payment method of a customer, registered with a card.
 *
 * Returned by `registerCardPaymentMethod`.
 */
export type CardPaymentMethodObject = {
    /**
     * Payment method ID.
     *
     * Card payment methods get an ID starting with `cs_`.
     */
    id: string

    /**
     * Payment method type.
     */
    pay_type: "Card"

    /**
     * Customer ID of the customer who owns this payment method.
     */
    customer_id?: string

    /**
     * Date this payment method was processed.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    process_date?: string | null

    /**
     * Status of this payment method.
     */
    status: PaymentMethodStatus

    /**
     * URL to send the customer to in order to authenticate this payment
     * method with 3D Secure.
     *
     * Filled in when `tds_type` is `2`. `null` otherwise.
     */
    redirect_url?: string | null

    /**
     * URL the customer returns to after authenticating successfully.
     */
    return_url?: string | null

    /**
     * URL the customer returns to after failing to authenticate.
     */
    return_url_on_failure?: string | null

    /**
     * Flag that means the customer uses this payment method by default or not.
     *
     * - `0`: OFF
     * - `1`: ON
     */
    default_flag?: "0" | "1"

    /**
     * Flag that means this payment method is deleted or not.
     *
     * - `0`: not deleted
     * - `1`: deleted
     */
    delete_flag?: "0" | "1"

    /**
     * Field that the shop can use freely.
     */
    client_field_1?: string | null

    /**
     * Field that the shop can use freely.
     */
    client_field_2?: string | null

    /**
     * Field that the shop can use freely.
     */
    client_field_3?: string | null

    /**
     * Card details of this payment method.
     */
    card?: PaymentMethodCard | null

    /**
     * Date this payment method was created.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    created?: string | null

    /**
     * Date this payment method was updated.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    updated?: string | null
}

/**
 * How the bank account of a direct debit payment method was applied for.
 *
 * - `PAPER`: registered with a paper request form.
 * - `ONLINE`: registered on the web.
 */
export type DirectDebitApplicationType = "PAPER" | "ONLINE"

/**
 * Deposit type of the bank account.
 *
 * - `1`: ordinary deposit
 * - `2`: current deposit
 */
export type DirectDebitAccountType = "1" | "2"

/**
 * Whether the bank is Japan Post Bank.
 *
 * - `0`: a bank other than Japan Post Bank
 * - `1`: Japan Post Bank
 */
export type DirectDebitBankType = "0" | "1"

/**
 * Paper request form the bank account was registered with.
 */
export type DirectDebitPaperApplication = {
    /**
     * Date the request form was pre-registered.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    preregistered_date?: string | null

    /**
     * ID of the request form.
     */
    request_form_id?: string | null

    /**
     * Why the paper application failed, when it did.
     */
    paper_failure_description?: string | null
}

/**
 * Bank account details of a direct debit payment method.
 */
export type PaymentMethodDirectDebit = {
    /**
     * How this bank account was applied for.
     */
    application_type: DirectDebitApplicationType

    /**
     * Transfer service this bank account is registered with.
     */
    settlement_route?: DirectDebitSettlementRoute | null

    /**
     * Date the next debit is expected to be taken.
     */
    expected_billable_date?: string | null

    /**
     * Date the last debit was taken.
     */
    last_withdrawal_date?: string | null

    /**
     * Result code of the last debit taken with this payment method.
     */
    last_result_code?: DirectDebitResultCode | null

    /**
     * Whether the bank is Japan Post Bank.
     */
    bank_type?: DirectDebitBankType | null

    /**
     * Bank code.
     */
    bank_code?: string | null

    /**
     * Bank name.
     */
    bank_name?: string | null

    /**
     * Branch code.
     */
    branch_code?: string | null

    /**
     * Branch name.
     */
    branch_name?: string | null

    /**
     * Deposit type of the bank account.
     */
    account_type?: DirectDebitAccountType | null

    /**
     * Account number.
     */
    account_number?: string | null

    /**
     * Symbol of the Japan Post Bank account.
     */
    postal_account_number_1?: string | null

    /**
     * Number of the Japan Post Bank account.
     */
    postal_account_number_2?: string | null

    /**
     * Account holder's name.
     */
    account_name?: string | null

    /**
     * Account holder's name in half-width katakana.
     */
    account_name_kana?: string | null

    /**
     * Paper request form this bank account was registered with.
     */
    paper_application?: DirectDebitPaperApplication | null
}

/**
 * Virtual account details of a virtual account payment method.
 */
export type PaymentMethodVirtualAccount = {
    /**
     * Branch code of the virtual account.
     */
    va_branch_code?: string | null

    /**
     * Branch name of the virtual account.
     */
    va_branch_name?: string | null

    /**
     * Account number of the virtual account.
     */
    va_account_number?: string | null

    /**
     * Account holder name of the virtual account.
     */
    va_account_name?: string | null

    /**
     * Virtual account identifier.
     */
    virtual_account_id?: string | null

    /**
     * Date this virtual account was assigned.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    account_assignment_date?: string | null

    /**
     * Date this virtual account was last activated.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    last_activated_date?: string | null

    /**
     * Date of the most recent transfer into this virtual account.
     *
     * Format: `yyyy/MM/dd HH:mm:ss.SSS`
     */
    latest_transaction_date?: string | null
}

/**
 * Payment method of a customer, registered with a bank account for direct
 * debit.
 *
 * Returned by `registerDirectDebitPaymentMethod`.
 */
export type DirectDebitPaymentMethodObject = Omit<CardPaymentMethodObject, "pay_type" | "card"> & {
    pay_type: "Directdebit"

    /**
     * Whether the customer has opened `redirect_url`.
     *
     * - `0`: not opened yet
     * - `1`: opened
     */
    redirect_url_accessed_flag?: "0" | "1"

    /**
     * Bank account details of this payment method.
     */
    directdebit?: PaymentMethodDirectDebit | null
}

/**
 * Payment method of a customer, registered as a virtual account fixed to
 * that customer.
 *
 * Returned by `registerVirtualAccountPaymentMethod`.
 */
export type VirtualAccountPaymentMethodObject =
    Omit<CardPaymentMethodObject, "pay_type" | "card" | "redirect_url" | "return_url" | "return_url_on_failure"> & {
        pay_type: "Virtualaccount"

        /**
         * Virtual account details of this payment method.
         */
        virtualaccount?: PaymentMethodVirtualAccount | null
    }

/**
 * Payment method of a customer.
 *
 * Branch on `pay_type` to reach the details of the payment method.
 */
export type PaymentMethodObject =
    | CardPaymentMethodObject
    | DirectDebitPaymentMethodObject
    | VirtualAccountPaymentMethodObject
