/**
 *
 * @param fincode instance of fincode
 * @param id Order ID
 * @param pay_type payment method type
 * @param access_id Access ID
 * @param use specify how to execute payment, either using ui or using customer_id and card_id
 * @returns {Promise<Payment.PaymentObject>}
 */
export const executePayment = (fincode, id, pay_type, access_id, use) => new Promise((resolve, reject) => {
    if (use.ui && (use.customer_id || use.card_id)) {
        reject(new Error("Can't use both ui and (customer_id or card_id)"));
        return;
    }
    if (use.ui) {
        use.ui.getFormData().then((formData) => {
            const transaction = {
                pay_type: pay_type,
                access_id: access_id,
                id: id,
                card_no: formData.cardNo,
                expire: formData.expire,
                security_code: formData.CVC,
                holder_name: formData.holderName,
                method: "1",
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
});
/**
 * get card token with data inputed in mounted ui
 *
 * @param {FincodeInstance} fincode instance of fincode
 * @param {FincodeUI} ui ui that has been already initialized
 * @param {number} number number of token to be issued
 * @returns
 */
export const getCardToken = (fincode, ui, number = 1) => new Promise((resolve, reject) => {
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
 * @param fincode fincode instance
 * @param ui ui that has been already initialized
 * @param customerId Customer ID who owns the card
 * @param useDefault Use this card by default or not
 * @returns
 */
export const registerCard = (fincode, ui, arg) => new Promise((resolve, reject) => {
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
            customer_id: arg.customerId,
            card_no: formData.cardNo,
            expire: formData.expire,
            security_code: formData.CVC,
            holder_name: formData.holderName,
            default_flag: arg.useDefault ? "1" : "0",
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
 * @param cardId Card ID to be updated
 * @param customerId Customer ID who owns the card
 * @param useDefault Use this card by default
 * @returns
 */
export const updateCard = (fincode, ui, arg) => new Promise((resolve, reject) => {
    ui.getFormData().then((formData) => {
        const card = {
            card_id: arg.cardId,
            customer_id: arg.customerId,
            default_flag: arg.useDefault ? "1" : undefined,
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
