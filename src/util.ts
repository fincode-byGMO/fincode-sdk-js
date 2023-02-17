import { APIErrorResponse } from "./types/api/api";
import { Card } from "./types/api/card";
import { Payment } from "./types/api/payment";
import { Token } from "./types/api/token";
import { FincodeInstance } from "./types/js/fincode";
import { FincodeUI } from "./types/js/ui";

/**
 * 
 * @param fincode instance of fincode
 * @param id Order ID
 * @param pay_type payment method type
 * @param access_id Access ID
 * @param use specify how to execute payment, either using ui or using customer_id and card_id
 * @returns {Promise<Payment.PaymentObject>}
 */
export const executePayment = (
    fincode: FincodeInstance,

    id: Parameters<FincodeInstance["payments"]>[0]["id"],
    pay_type: Parameters<FincodeInstance["payments"]>[0]["pay_type"],
    access_id: Parameters<FincodeInstance["payments"]>[0]["access_id"],
    
    use: {
        ui?: FincodeUI,
        customer_id?: Parameters<FincodeInstance["payments"]>[0]["customer_id"],
        card_id?: Parameters<FincodeInstance["payments"]>[0]["card_id"],
    }
) => new Promise<Payment.PaymentObject>((resolve, reject) => {
        if (use.ui && (use.customer_id || use.card_id)) {
            reject(new Error("Can't use both ui and (customer_id or card_id)"));
            return;
        }

        if (use.ui) {
            use.ui.getFormData().then((formData) => {
                const transaction: Parameters<FincodeInstance["payments"]>[0] = {
                    pay_type: pay_type,
                    access_id: access_id,
                    id: id,
                    card_no: formData.cardNo,
                    expire: formData.expire,
                    security_code: formData.CVC,
                    holder_name: formData.holderName,
                    method: "1",
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
            }).catch((err) => {
                reject(err);
            })
        }
    }
)

/**
 * get card token with data inputed in mounted ui
 * 
 * @param {FincodeInstance} fincode instance of fincode 
 * @param {FincodeUI} ui ui that has been already initialized
 * @param {number} number number of token to be issued
 * @returns 
 */
export const getCardToken = (
    fincode: FincodeInstance ,
    ui: FincodeUI,
    number: number = 1,
) => new Promise<Token.IssuingResponse>((resolve, reject) => {
    ui.getFormData().then((formData) => {
        if (typeof formData.cardNo === "undefined") {
            reject(new Error("Card number is undefined"));
            return;
        }
        if (typeof formData.expire === "undefined") {
            reject(new Error("Expire date is undefined"));
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
            const errors: APIErrorResponse = {
                errors: [
                    {
                        error_code: "-",
                        error_messaage: "Some error has occured. couldn't get token",
                    },
                ]
            }
            reject(errors);
        }

        fincode.tokens(card, onSuccess, onError);
    })
})

/**
 * 
 * @param fincode fincode instance
 * @param ui ui that has been already initialized
 * @param customerId Customer ID who owns the card
 * @param useDefault Use this card by default or not
 * @returns 
 */
export const registerCard = (
    fincode: FincodeInstance,
    ui: FincodeUI,
    customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"],
    useDefault: boolean = false,
) => new Promise<Card.CardObject>((resolve, reject) => {
    ui.getFormData().then((formData) => {
        if (typeof formData.cardNo === "undefined") {
            reject(new Error("Card number is undefined"));
            return;
        }
        if (typeof formData.expire === "undefined") {
            reject(new Error("Expire date is undefined"));
            return;
        }

        const card: Parameters<FincodeInstance["cards"]>[0] = {
            customer_id: customerId,
            card_no: formData.cardNo,
            expire: formData.expire,
            security_code: formData.CVC,
            holder_name: formData.holderName,
            default_flag: useDefault? "1": "0",
        }

        const onSuccess: Parameters<FincodeInstance["cards"]>[1] = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        }
        const onError: Parameters<FincodeInstance["cards"]>[2] = () => {
            const errors: APIErrorResponse = {
                errors: [
                    {
                        error_code: "-",
                        error_messaage: "Some error has occured. couldn't register card",
                    },
                ]
            }
            reject(errors);
        }

        fincode.cards(card, onSuccess, onError);
    })
})

/**
 * 
 * @param fincode fincode instance 
 * @param ui ui that has been already initialized
 * @param cardId Card ID to be updated
 * @param customerId Customer ID who owns the card
 * @param useDefault Use this card by default
 * @returns 
 */
export const updateCard = (
    fincode: FincodeInstance,
    ui: FincodeUI,
    cardId: string,
    customerId: Parameters<FincodeInstance["cards"]>[0]["customer_id"],
    useDefault: boolean = false,
) => new Promise<Card.CardObject>((resolve, reject) => {
    ui.getFormData().then((formData) => {
        const card: Parameters<FincodeInstance["cards"]>[0] = {
            card_id: cardId,
            customer_id: customerId,
            default_flag : useDefault? "1": undefined,
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
            const errors: APIErrorResponse = {
                errors: [
                    {
                        error_code: "-",
                        error_messaage: "Some error has occured. couldn't update card",
                    },
                ]
            }
            reject(errors);
        }

        fincode.cards(card,onSuccess,onError)
    })
})