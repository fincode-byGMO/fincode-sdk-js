/**
     * Card object
     */
export type CardObject = {
    /**
     * Customer ID of customer who owns this card.
     */
    customer_id: string

    /**
     * Card ID.
     */
    id: string

    /**
     * Flag that means the customer uses this card by default or not.
     * 
     * - `0`: OFF
     * - `1`: ON
     */
    default_flag: "0" | "1"

    /**
     * Masked card number used in this payment. (e.g. `************9999`)
     */
    card_no: string

    /**
     * The expiring date of the card used in this payment. 
     * Format: `yymm`, e.g. `3011` means 2030/11
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    expire: string

    /**
     * Holder name of the card used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    holder_name: string

    /**
     * hashed card number the card used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    card_no_hash: string

    /**
     * Date this card was created.
     * 
     * Format: YYYY/MM/dd HH:mm:ss.SSS
     */
    created: string

    /**
     * Date this card was updated.
     * 
     * Format: YYYY/MM/dd HH:mm:ss.SSS
     */
    updated?: string | null

    /**
     * Card types
     * 
     * - `0`: Unknown card type.
     * - `1`: Debit card.
     * - `2`: Prepaid card.
     * - `3`: Credit card.
     */
    type: CardType

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
     * Card brands user can use in fincode.
     * 
     * - `VISA`: Visa card.
     * - `MASTER`: Mastercard card.
     * - `JCB`: JCB card.
     * - `AMEX`: American Express card.
     * - `DISCOVER`: Discover card.
     * - `(empty string)`: Unknown card brand (or test card)
     */
    brand: CardBrand
}

/**
 * Card brands user can use in fincode.
 * 
 * - `VISA`: Visa card.
 * - `MASTER`: Mastercard card.
 * - `JCB`: JCB card.
 * - `AMEX`: American Express card.
 * - `DINERS`: DinersClub card.
 * - `DISCOVER`: Discover card.
 * - `(empty string)`: Unknown card brand (or test card)
 */
export type CardBrand = "VISA" | "MASTER" | "JCB" | "AMEX" | "DINERS" | "DISCOVER" | ""

/**
 * Card types
 * 
 * - `0`: Unknown card type.
 * - `1`: Debit card.
 * - `2`: Prepaid card.
 * - `3`: Credit card.
 */
export type CardType = "0" | "1" | "2" | "3"

/**
 * Whether the card updater keeps this card's details up to date.
 *
 * - `enabled`: update this card.
 * - `disabled`: do not update this card.
 * - `inherit`: follow the shop setting.
 */
export type CardUpdaterMode = "enabled" | "disabled" | "inherit"

/**
 * Card details passed to `Fincode.cards(...)` to register a new card.
 *
 * Leaving `card_id` out is what makes `cards()` register instead of update.
 * fincode.js takes `customer_id` out of this object to build the request URL
 * and sends the rest as the body of
 * `POST /v1/customers/{customer_id}/cards`.
 */
export type RegisteringCardRequest = {
    /**
     * Customer ID of the customer who will own this card.
     */
    customer_id: string

    /**
     * Flag that means the customer uses this card by default or not.
     *
     * - `0`: OFF
     * - `1`: ON
     *
     * Registering a card without this field is rejected with
     * `E0006019001`.
     */
    default_flag: "0" | "1"

    /**
     * Card number.
     */
    card_no: string

    /**
     * The date this card expires.
     *
     * Format: `yyMM`, e.g. `3011` means 2030/11
     */
    expire: string

    /**
     * Security code (CVC/CVV)
     */
    security_code?: string

    /**
     * Card holder's name.
     */
    holder_name?: string
}

/**
 * Card details passed to `Fincode.cards(...)` to update a card that is
 * already registered.
 *
 * Passing `card_id` is what makes `cards()` update instead of register.
 * fincode.js takes `customer_id` and `card_id` out of this object to build
 * the request URL and sends the rest as the body of
 * `PUT /v1/customers/{customer_id}/cards/{card_id}`.
 */
export type UpdatingCardRequest = {
    /**
     * Customer ID of the customer who owns this card.
     */
    customer_id: string

    /**
     * ID of the card to update.
     */
    card_id: string

    /**
     * Flag that means the customer uses this card by default or not.
     *
     * Only turning the flag on is accepted here. Sending `"0"` is rejected
     * with `E0008019008`. To move the default to another card, turn the flag
     * on for that card instead.
     */
    default_flag?: "1"

    /**
     * The date this card expires.
     *
     * Format: `yyMM`, e.g. `3011` means 2030/11
     */
    expire?: string

    /**
     * Security code (CVC/CVV)
     */
    security_code?: string

    /**
     * Card holder's name.
     */
    holder_name?: string
}

/**
 * Response of listing a customer's cards (used in `Fincode.getCardsList()`).
 *
 * `GET /v1/customers/{customer_id}/cards` returns the cards under a single
 * `list` key and no pagination fields.
 */
export type RetrievingCardListResponse = {
    /**
     * Cards the customer has registered.
     */
    list: CardObject[]
}
