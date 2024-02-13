import * as Card from "../api/card";
import * as Payment from "../api/payment";
import * as Token from "../api/token";
import { Appearance, FincodeUI } from "./ui";
export type FincodeInitializer = (apiKey: string) => FincodeInstance;
export type FincodeInstance = {
    tokens: (card: {
        card_no: string;
        expire: string;
        security_code?: string;
        holder_name?: string;
        number?: string;
    }, callback: (status: number, response: Token.TokenIssuingResponse) => void, errorCallback: () => void) => void;
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
    setTenantShopId: (tenantShopId: string) => void;
    setIdempotentKey: (idempotencyKey: string) => void;
};
//# sourceMappingURL=fincode.d.ts.map