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
     * Card brands user can use in fincode.
     * 
     * - `VISA`: Visa card.
     * - `MASTER`: Mastercard card.
     * - `JCB`: JCB card.
     * - `AMEX`: American Express card.
     * - `Diners`: DinersClub card.
     * - `(empty string)`: Unknown card brand.
     */
    brand: CardBrand | ""
}

/**
 * Card brands user can use in fincode.
 * 
 * - `VISA`: Visa card.
 * - `MASTER`: Mastercard card.
 * - `JCB`: JCB card.
 * - `AMEX`: American Express card.
 * - `Diners`: DinersClub card.
 */
export type CardBrand = "VISA" | "MASTER" | "JCB" | "AMEX" | "DINERS"

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
 * Request object of Registering Card (used for POST /v1/customers/{customer_id}/cards)
 */
export type RegisteringCardRequest = {
    /**
     * Flag that means the customer uses this card by default or not.
     * 
     * - `0`: OFF
     * - `1`: ON
     */
    default_flag: "0" | "1"

    /**
     * Card token responded from fincodeJS (Fincode.tokens(...))
     */
    token: string

    /**
     * Card holder's name
     */
    holder_name?: string | null

    /**
     * Security code (CVC/CVV)
     */
    security_code?: string | null
}

/**
 * Request object of Updating Card (used for PUT /v1/customers/{customer_id}/cards/{id})
 */
export type UpdatingCardRequest = {
    /**
     * Flag that means the customer uses this card by default or not.
     * 
     * - `0`: OFF
     * - `1`: ON
     */
    default_flag?: "0" | "1" | null

    /**
     * Card token responded from fincodeJS (Fincode.tokens(...))
     */
    token?: string | null

    /**
     * Card holder's name
     */
    holder_name?: string | null

    /**
     * The expiring date of the card used in this payment.
     * 
     * Format: YYMM
     */
    expire?: string | null
}

/**
 * Response object of Deleting Card (used for DELETE /v1/customers/{customer_id}/cards/{id})
 */
export type DeletingCardResponse = {
    /**
     * Customer's customer ID deleted card was tied to.
     */
    customer_id: string

    /**
     * Card ID that has just been deleted.
     */
    id: string

    /**
     * Flag this card has already been deleted or not.
     * 
     * - `0`: Not deleted. This customer is still available.
     * - `1`: Deleted. This customer is no longer available.
     */
    delete_flag: "0" | "1"
}
