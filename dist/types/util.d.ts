import { CardObject, PaymentObject, TokenIssuingResponse } from "./api";
import { FincodeInstance, FincodeUI } from "./js";
/**
 *
 * @param fincode instance of fincode
 * @param id Order ID
 * @param pay_type payment method type
 * @param access_id Access ID
 * @param use specify how to execute payment, either using ui or using customer_id and card_id
 * @returns {Promise<Payment.PaymentObject>}
 */
export declare const executePayment: (fincode: FincodeInstance, id: Parameters<FincodeInstance["payments"]>[0]["id"], pay_type: Parameters<FincodeInstance["payments"]>[0]["pay_type"], access_id: Parameters<FincodeInstance["payments"]>[0]["access_id"], use: {
    ui?: FincodeUI;
    customer_id?: Parameters<FincodeInstance["payments"]>[0]["customer_id"];
    card_id?: Parameters<FincodeInstance["payments"]>[0]["card_id"];
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
 * @param fincode fincode instance
 * @param ui ui that has been already initialized
 * @param customerId Customer ID who owns the card
 * @param useDefault Use this card by default or not
 * @returns
 */
export declare const registerCard: (fincode: FincodeInstance, ui: FincodeUI, arg: {
    customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"];
    useDefault?: boolean;
}) => Promise<CardObject>;
/**
 *
 * @param fincode fincode instance
 * @param ui ui that has been already initialized
 * @param cardId Card ID to be updated
 * @param customerId Customer ID who owns the card
 * @param useDefault Use this card by default
 * @returns
 */
export declare const updateCard: (fincode: FincodeInstance, ui: FincodeUI, arg: {
    cardId: string;
    customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"];
    useDefault?: true;
}) => Promise<CardObject>;
//# sourceMappingURL=util.d.ts.map