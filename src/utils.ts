import { FincodeSDKError } from "./_utils";
import { APIErrorResponse, CardObject, CardPaymentMethodObject, PaymentMethodTdsType, PaymentObject, RegisteringCardRequest, TokenIssuingResponse } from "./api";
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
                        error_message: "Some error has occured. couldn't execute payment",
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

        const card: RegisteringCardRequest = {
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
 * **registerCardPaymentMethod**
 *
 * calls the payment method API with the card data input in mounted ui, and
 * registers the card as a payment method of the customer.
 *
 * This is not a wrapper of a fincodeJS function. fincodeJS has no function
 * for the payment method API, so this issues the request itself, with the
 * public key and the headers the fincode instance was set up with. Values
 * set through `setTenantShopId` and `setIdempotentKey` are applied.
 *
 * Registering a card takes a card token, so this issues one through
 * `fincode.tokens(...)` first.
 *
 * Pass `tdsType: "2"` to authenticate the card with 3D Secure. The payment
 * method then comes back as `AWAITING_CUSTOMER_ACTION` with a `redirect_url`,
 * and the customer has to be sent there to finish. Without it the payment
 * method is `ACTIVATED` right away.
 *
 * @param {object} args arguments object
 * @param {FincodeInstance} args.fincode fincode instance
 * @param {FincodeUI} args.ui ui that has been already mounted
 * @param {string} args.customerId Customer ID who owns the payment method
 * @param {boolean} args.useDefault Use this payment method by default or not (default: false)
 * @param {PaymentMethodTdsType} args.tdsType Whether to use 3D Secure (default: `"0"`)
 * @param {string} args.returnUrl URL the customer returns to after authenticating successfully
 * @param {string} args.returnUrlOnFailure URL the customer returns to after failing to authenticate
 * @returns {Promise<CardPaymentMethodObject>}
 */
export const registerCardPaymentMethod = async (args: {
    fincode: FincodeInstance,
    ui: FincodeUI,
    customerId: string,
    useDefault?: boolean,
    tdsType?: PaymentMethodTdsType,
    returnUrl?: string,
    returnUrlOnFailure?: string,
    clientField1?: string,
    clientField2?: string,
    clientField3?: string,
}): Promise<CardPaymentMethodObject> => {
    const { fincode, ui, customerId } = args

    if (!customerId) {
        throw new FincodeSDKError("customerId is required")
    }
    if (args.tdsType === "2" && !args.returnUrl) {
        throw new FincodeSDKError("returnUrl is required when tdsType is \"2\"")
    }

    const { list } = await getCardToken({ fincode, ui })
    const token = list[0]?.token
    if (!token) {
        throw new FincodeSDKError("Could not issue a card token")
    }

    const { config } = fincode
    const headers: Record<string, string> = {
        "Accept": config.headers.accept,
        "Content-Type": config.headers.contentType,
        "Authorization": `Bearer ${config.apiKey}`,
    }
    if (config.headers.tenantShopId) headers["Tenant-Shop-Id"] = config.headers.tenantShopId
    if (config.headers.idempotentKey) headers["idempotent_key"] = config.headers.idempotentKey

    const url = `${config.api.host}${config.api.context}/customers/${customerId}/payment_methods`

    let res: Response
    try {
        res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({
                pay_type: "Card",
                default_flag: args.useDefault ? "1" : "0",
                return_url: args.returnUrl,
                return_url_on_failure: args.returnUrlOnFailure,
                client_field_1: args.clientField1,
                client_field_2: args.clientField2,
                client_field_3: args.clientField3,
                card: {
                    token: token,
                    tds_type: args.tdsType,
                },
            }),
        })
    } catch (e) {
        throw new FincodeSDKError("Some error has occured. couldn't register payment method", e)
    }

    const body = await res.json()
    if (!res.ok) {
        throw body as APIErrorResponse
    }

    return body as CardPaymentMethodObject
}
