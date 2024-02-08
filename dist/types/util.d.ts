import { CardObject, PaymentObject, TokenIssuingResponse } from "./api";
import { FincodeInstance, FincodeUI } from "./js";
/**
 *
 * @param {FincodeInstance} fincode instance of fincode
 * @param {string} id Order ID
 * @param {string} payType payment method type
 * @param {string} accessId Access ID
 * @param {string|undefined} ui UI that has been already mounted
 * @param {object|undefined} args arguments to be used in payment. (customerId, cardId, method)
 * @returns {Promise<Payment.PaymentObject>}
 */
export declare const executePayment: (fincode: FincodeInstance, id: Parameters<FincodeInstance["payments"]>[0]["id"], payType: Parameters<FincodeInstance["payments"]>[0]["pay_type"], accessId: Parameters<FincodeInstance["payments"]>[0]["access_id"], ui?: FincodeUI, args?: {
    customerId?: Parameters<FincodeInstance["payments"]>[0]["customer_id"];
    cardId?: Parameters<FincodeInstance["payments"]>[0]["card_id"];
    method?: Parameters<FincodeInstance["payments"]>[0]["method"];
}) => Promise<PaymentObject>;
/**
 * get card token with data inputed in mounted ui
 *
 * @param {FincodeInstance} fincode instance of fincode
 * @param {FincodeUI} ui ui that has been already initialized
 * @param {string} number number of token to be issued. (type: string, default: `"1"`)
 * @returns
 */
export declare const getCardToken: (fincode: FincodeInstance, ui: FincodeUI, number?: string) => Promise<TokenIssuingResponse>;
/**
 *
 * @param {FincodeInstance} fincode fincode instance
 * @param {FincodeUI} ui ui that has been already initialized
 * @param {string} customerId Customer ID who owns the card
 * @param {boolean} useDefault Use this card by default or not
 * @returns
 */
export declare const registerCard: (fincode: FincodeInstance, ui: FincodeUI, customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"], useDefault?: boolean) => Promise<CardObject>;
/**
 *
 * @param fincode fincode instance
 * @param ui ui that has been already initialized
 * @param id Card ID to be updated
 * @param customerId Customer ID who owns the card
 * @param useDefault Use this card by default
 * @returns
 */
export declare const updateCard: (fincode: FincodeInstance, ui: FincodeUI, id: string, customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"], useDefault?: true) => Promise<CardObject>;
//# sourceMappingURL=util.d.ts.map