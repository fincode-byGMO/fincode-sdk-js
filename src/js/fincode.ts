import * as Card from "../api/card";
import * as Payment from "../api/payment";
import * as Token from "../api/token";
import { Appearance, FincodeUI } from "./ui";

export type FincodeInitializer = (apiKey: string) => FincodeInstance
export type FincodePaymentTransaction = Payment.ExecutingPaymentRequest & {
    /**
     * ID of the payment (order ID)
     */
    id: string

    /**
     * Card number.
     * If this parameter is provided, the `card_id` parameter will be ignored.
     */
    card_no?: string

    /**
     * Security code of the card.
     */
    security_code?: string

    /**
     * The expiring date of the card used in this payment.
     * 
     * Format: `yymm`, e.g. `3011` means 2030/11
     */
    expire?: string | null

    /**
     * Holder name of the card used in this payment.
     * 
     * If any card have not been used in this payment yet, this field will be null.
     */
    holder_name?: string | null
}
export type FincodeInstance = {
    tokens: (
        card: {
            card_no: string,
            expire: string,
            security_code?: string,
            holder_name?: string,
            number?: string,
        },
        callback: (status: number, response: Token.TokenIssuingResponse) => void,
        errorCallback: () => void,
    ) => void

    /**
     * Registers a new card, or updates one that is already registered.
     *
     * Passing `card_id` updates that card. Leaving it out registers a new one.
     */
    cards: (
        card: Card.RegisteringCardRequest | Card.UpdatingCardRequest,
        callback: (status: number, response: Card.CardObject) => void,
        errorCallback: () => void,
    ) => void

    payments: (
        transaction: FincodePaymentTransaction,
        callback: (status: number, response: Payment.PaymentObject) => void,
        errorCallback: () => void,
    ) => void

    ui: (appearance: Appearance) => FincodeUI

    setTenantShopId: (tenantShopId: string) => void

    setIdempotentKey: (idempotencyKey: string) => void
}
