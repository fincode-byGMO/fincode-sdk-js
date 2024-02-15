import { FincodeSDKError } from "./_utils";
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
export const executePayment = (args) => new Promise((resolve, reject) => {
    const ui = args.ui;
    const fincode = args.fincode;
    const id = args.id;
    const payType = args.payType;
    const accessId = args.accessId;
    const payment = args.payment;
    if (ui && payment) {
        reject(new FincodeSDKError("Can't use both ui and (customer_id,card_id or method)"));
        return;
    }
    if (ui) {
        ui.getFormData().then((formData) => {
            const transaction = {
                pay_type: payType,
                access_id: accessId,
                id: id,
                card_no: formData.cardNo,
                expire: formData.expire,
                security_code: formData.CVC,
                holder_name: formData.holderName,
                method: formData.method,
            };
            const onSuccess = (status, response) => {
                if (status === 200) {
                    resolve(response);
                    return;
                }
                reject(response);
            };
            const onError = () => {
                const errors = {
                    errors: [
                        {
                            error_code: "-",
                            error_messaage: "Some error has occured. couldn't execute payment",
                        },
                    ]
                };
                reject(errors);
            };
            fincode.payments(transaction, onSuccess, onError);
        }).catch((err) => {
            reject(err);
        });
    }
    else if (payment) {
        const transaction = {
            pay_type: payType,
            access_id: accessId,
            id: id,
            customer_id: payment.customerId,
            card_id: payment.cardId,
            method: payment.method || "1",
        };
        const onSuccess = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        };
        const onError = () => {
            const errors = {
                errors: [
                    {
                        error_code: "-",
                        error_messaage: "Some error has occured. couldn't execute payment",
                    },
                ]
            };
            reject(errors);
        };
        fincode.payments(transaction, onSuccess, onError);
    }
    else {
        reject(new FincodeSDKError("ui or (customer_id,card_id or method) must be provided"));
        return;
    }
});
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
export const getCardToken = (args) => new Promise((resolve, reject) => {
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
        const card = {
            card_no: formData.cardNo,
            expire: formData.expire,
            security_code: formData.CVC,
            holder_name: formData.holderName,
            number: number,
        };
        const onSuccess = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        };
        const onError = () => {
            const errors = {
                errors: [
                    {
                        error_code: "-",
                        error_messaage: "Some error has occured. couldn't get token",
                    },
                ]
            };
            reject(errors);
        };
        fincode.tokens(card, onSuccess, onError);
    });
});
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
export const registerCard = (args) => new Promise((resolve, reject) => {
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
        const card = {
            customer_id: customerId,
            card_no: formData.cardNo,
            expire: formData.expire,
            security_code: formData.CVC,
            holder_name: formData.holderName,
            default_flag: useDefault ? "1" : "0",
        };
        const onSuccess = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        };
        const onError = () => {
            const errors = {
                errors: [
                    {
                        error_code: "-",
                        error_messaage: "Some error has occured. couldn't register card",
                    },
                ]
            };
            reject(errors);
        };
        fincode.cards(card, onSuccess, onError);
    });
});
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
export const updateCard = (args) => new Promise((resolve, reject) => {
    const fincode = args.fincode;
    const ui = args.ui;
    const id = args.id;
    const customerId = args.customerId;
    const useDefault = args.useDefault || false;
    ui.getFormData().then((formData) => {
        const card = {
            card_id: id,
            customer_id: customerId,
            default_flag: useDefault ? "1" : undefined,
            holder_name: formData.holderName,
            security_code: formData.CVC,
        };
        const onSuccess = (status, response) => {
            if (status === 200) {
                resolve(response);
                return;
            }
            reject(response);
        };
        const onError = () => {
            const errors = {
                errors: [
                    {
                        error_code: "-",
                        error_messaage: "Some error has occured. couldn't update card",
                    },
                ]
            };
            reject(errors);
        };
        fincode.cards(card, onSuccess, onError);
    });
});
