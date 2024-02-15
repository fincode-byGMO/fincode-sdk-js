import { CardObject, PaymentObject, TokenIssuingResponse } from "./api";
import { FincodeInstance, FincodeUI } from "./js";
/**
 * **executePayment**
 *
 * calls payments() method of fincode instance with data input in mounted ui or custom arguments.
 *
 * You can use either ui or customArgs. If you use both, it will reject.
 *
 * @param {object} args arguments to be used in payment. (customerId, cardId, method)
 * @param {FincodeInstance} args.fincode instance of fincode
 * @param {string} args.id Order ID
 * @param {string} args.payType payment method type
 * @param {string} args.accessId Access ID
 * @param {FincodeUI|undefined} args.ui UI that has been already mounted
 * @param {object|undefined} args.payment arguments to be used in payment. (customerId, cardId, method)
 * @returns {Promise<PaymentObject>}
 */
export declare const executePayment: (args: {
    fincode: FincodeInstance;
    id: Parameters<FincodeInstance["payments"]>[0]["id"];
    payType: Parameters<FincodeInstance["payments"]>[0]["pay_type"];
    accessId: Parameters<FincodeInstance["payments"]>[0]["access_id"];
    ui?: FincodeUI;
    payment?: {
        customerId?: Parameters<FincodeInstance["payments"]>[0]["customer_id"];
        cardId?: Parameters<FincodeInstance["payments"]>[0]["card_id"];
        method?: Parameters<FincodeInstance["payments"]>[0]["method"];
    };
}) => Promise<PaymentObject>;
/**
 * **getCardToken**
 *
 * calls tokens() method of fincode instance with data input in mounted ui or custom arguments.
 *
 * @param {object} args arguments object
 * @param {FincodeInstance} args.fincode instance of fincode
 * @param {FincodeUI} args.ui ui that has been already initialized
 * @param {string} args.number number of token to be issued. (type: string, default: `"1"`)
 * @returns {Promise<TokenIssuingResponse>}
 */
export declare const getCardToken: (args: {
    fincode: FincodeInstance;
    ui: FincodeUI;
    number?: string;
}) => Promise<TokenIssuingResponse>;
/**
 * **registerCard**
 *
 * calls cards() method of fincode instance with data input in mounted ui or custom arguments.
 *
 * @param {object} args arguments object
 * @param {FincodeInstance} args.fincode fincode instance
 * @param {FincodeUI} args.ui ui that has been already initialized
 * @param {string} args.customerId Customer ID who owns the card
 * @param {boolean} args.useDefault Use this card by default or not (default: false)
 * @returns {Promise<CardObject>}
 */
export declare const registerCard: (args: {
    fincode: FincodeInstance;
    ui: FincodeUI;
    customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"];
    useDefault?: boolean;
}) => Promise<CardObject>;
/**
 * **updateCard*
 *
 * calls cards() method of fincode instance with data input in mounted ui or custom arguments.
 *
 * You can use either ui or customArgs. If you use both, it will reject.
 *
 * @param {object} args arguments object
 * @param {FincodeInstance} args.fincode fincode instance
 * @param {FincodeUI} args.ui ui that has been already initialized
 * @param {string} args.id Card ID to be updated
 * @param {string} args.customerId Customer ID who owns the card
 * @param {boolean} args.useDefault Use this card by default or not (default: false)
 *
 * @returns {Promise<CardObject>}
 */
export declare const updateCard: (args: {
    fincode: FincodeInstance;
    ui: FincodeUI;
    id: string;
    customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"];
    useDefault?: boolean;
}) => Promise<CardObject>;
//# sourceMappingURL=utils.d.ts.map