import { FincodeSDKError } from "./_utils";
import { APIErrorResponse, CardObject, PaymentObject, TokenIssuingResponse } from "./api";
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
 * @param {FincodeUI|undefined} args.ui UI that has been already mounted
 * @param {string} args.id Order ID
 * @param {string} args.payType payment method type
 * @param {string} args.accessId Access ID
 * @returns {Promise<PaymentObject>}
 */
export const executePayment = (args: {
    fincode: FincodeInstance,
    ui: FincodeUI,

    id: Parameters<FincodeInstance["payments"]>[0]["id"],
    payType: Parameters<FincodeInstance["payments"]>[0]["pay_type"],
    accessId: Parameters<FincodeInstance["payments"]>[0]["access_id"],
}): Promise<PaymentObject> => new Promise<PaymentObject>((resolve, reject) => {

    const ui = args.ui;
    const fincode = args.fincode;
    const id = args.id;
    const payType = args.payType;
    const accessId = args.accessId;

    ui.getFormData().then((formData) => {
        const transaction: Parameters<FincodeInstance["payments"]>[0] = {
            pay_type: payType,
            access_id: accessId,
            id: id,
            card_no: formData.cardNo,
            card_id: formData.cardId,
            customer_id: formData.customerId,
            expire: formData.expire,
            security_code: formData.CVC,
            holder_name: formData.holderName,
            method: formData.method,
        }

        const onSuccess: Parameters<FincodeInstance["payments"]>[1] = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        }
        const onError: Parameters<FincodeInstance["payments"]>[2] = () => {
            const errors: APIErrorResponse = {
                errors: [
                    {
                        error_code: "-",
                        error_messaage: "Some error has occured. couldn't execute payment",
                    },
                ]
            }
            reject(errors);
        }

        fincode.payments(transaction, onSuccess, onError)
    })
})
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
export const getCardToken = (args: {
    fincode: FincodeInstance,
    ui: FincodeUI,
    number?: string,
}): Promise<TokenIssuingResponse> => new Promise<TokenIssuingResponse>((resolve, reject) => {
    const fincode = args.fincode;
    const ui = args.ui;
    const number = args.number || "1";

    ui.getFormData().then((formData) => {
        if (typeof formData.cardNo === "undefined") {
            reject(new FincodeSDKError("Card number is undefined"));
            return;
        }
        if (typeof formData.expire === "undefined") {
            reject(new FincodeSDKError("Expire date is undefined"));
            return;
        }

        const card: Parameters<FincodeInstance["tokens"]>[0] = {
            card_no: formData.cardNo,
            expire: formData.expire,
            security_code: formData.CVC,
            holder_name: formData.holderName,
            number: number,
        }

        const onSuccess: Parameters<FincodeInstance["tokens"]>[1] = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        }
        const onError: Parameters<FincodeInstance["tokens"]>[2] = () => {
            reject(new FincodeSDKError("Some error has occured. couldn't issue token"));
        }

        fincode.tokens(card, onSuccess, onError);
    })
})

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
export const registerCard = (args: {
    fincode: FincodeInstance,
    ui: FincodeUI,
    customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"],
    useDefault?: boolean,
}): Promise<CardObject> => new Promise<CardObject>((resolve, reject) => {

    const fincode = args.fincode;
    const ui = args.ui;
    const customerId = args.customerId;
    const useDefault = args.useDefault || false;

    ui.getFormData().then((formData) => {
        if (typeof formData.cardNo === "undefined") {
            reject(new FincodeSDKError("Card number is undefined"));
            return;
        }
        if (typeof formData.expire === "undefined") {
            reject(new FincodeSDKError("Expire date is undefined"));
            return;
        }

        const card: Parameters<FincodeInstance["cards"]>[0] = {
            customer_id: customerId,
            card_no: formData.cardNo,
            expire: formData.expire,
            security_code: formData.CVC,
            holder_name: formData.holderName,
            default_flag: useDefault ? "1" : "0",
        }

        const onSuccess: Parameters<FincodeInstance["cards"]>[1] = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        }
        const onError: Parameters<FincodeInstance["cards"]>[2] = () => {
            reject(new FincodeSDKError("Some error has occured. couldn't register card"));
        }

        fincode.cards(card, onSuccess, onError);
    })
})

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
export const updateCard = (args: {
    fincode: FincodeInstance,
    ui: FincodeUI,
    id: string,
    customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"],
    useDefault?: boolean,
}): Promise<CardObject> => new Promise<CardObject>((resolve, reject) => {

    const fincode = args.fincode;
    const ui = args.ui;
    const id = args.id;
    const customerId = args.customerId;
    const useDefault = args.useDefault || false;

    ui.getFormData().then((formData) => {
        const card: Parameters<FincodeInstance["cards"]>[0] = {
            card_id: id,
            customer_id: customerId,
            default_flag: useDefault ? "1" : undefined,
            holder_name: formData.holderName,
            security_code: formData.CVC,
        }

        const onSuccess: Parameters<FincodeInstance["cards"]>[1] = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        }
        const onError: Parameters<FincodeInstance["cards"]>[2] = () => {
            reject(new FincodeSDKError("Some error has occured. couldn't update card"));
        }

        fincode.cards(card, onSuccess, onError)
    })
})