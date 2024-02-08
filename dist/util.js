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
export const executePayment = (fincode, id, payType, accessId, ui, args) => new Promise((resolve, reject) => {
    if (ui && args) {
        reject(new Error("Can't use both ui and (customer_id,card_id or method)"));
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
    else if (args) {
        const transaction = {
            pay_type: payType,
            access_id: accessId,
            id: id,
            customer_id: args.customerId,
            card_id: args.cardId,
            method: args.method || "1",
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
        reject(new Error("ui or (customer_id,card_id or method) must be provided"));
        return;
    }
});
/**
 * get card token with data inputed in mounted ui
 *
 * @param {FincodeInstance} fincode instance of fincode
 * @param {FincodeUI} ui ui that has been already initialized
 * @param {string} number number of token to be issued. (type: string, default: `"1"`)
 * @returns
 */
export const getCardToken = (fincode, ui, number = "1") => new Promise((resolve, reject) => {
    ui.getFormData().then((formData) => {
        if (typeof formData.cardNo === "undefined") {
            reject(new Error("Card number is undefined"));
            return;
        }
        if (typeof formData.expire === "undefined") {
            reject(new Error("Expire date is undefined"));
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
 *
 * @param {FincodeInstance} fincode fincode instance
 * @param {FincodeUI} ui ui that has been already initialized
 * @param {string} customerId Customer ID who owns the card
 * @param {boolean} useDefault Use this card by default or not
 * @returns
 */
export const registerCard = (fincode, ui, customerId, useDefault) => new Promise((resolve, reject) => {
    ui.getFormData().then((formData) => {
        if (typeof formData.cardNo === "undefined") {
            reject(new Error("Card number is undefined"));
            return;
        }
        if (typeof formData.expire === "undefined") {
            reject(new Error("Expire date is undefined"));
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
 *
 * @param fincode fincode instance
 * @param ui ui that has been already initialized
 * @param id Card ID to be updated
 * @param customerId Customer ID who owns the card
 * @param useDefault Use this card by default
 * @returns
 */
export const updateCard = (fincode, ui, id, customerId, useDefault) => new Promise((resolve, reject) => {
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
