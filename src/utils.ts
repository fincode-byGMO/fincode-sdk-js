import { FincodeSDKError } from "./_utils";
import { APIErrorResponse, CardObject, CardPaymentMethodObject, DirectDebitAccountType, DirectDebitApplicationType, DirectDebitPaymentMethodObject, DirectDebitSettlementRoute, PaymentMethodObject, PaymentMethodTdsType, PaymentObject, RegisteringCardRequest, TokenIssuingResponse, VirtualAccountPaymentMethodObject } from "./api";
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

type RegisteringPaymentMethodCommonArgs = {
    fincode: FincodeInstance

    /**
     * Customer ID who owns the payment method.
     */
    customerId: string

    /**
     * Use this payment method by default or not. (default: false)
     *
     * The first payment method of a pay type has to be registered with
     * `true`. Without it the API answers `EC013136002` for cards,
     * `EF010524002` for direct debit and `EG009548002` for virtual accounts.
     */
    useDefault?: boolean

    clientField1?: string
    clientField2?: string
    clientField3?: string
}

/**
 * Arguments for registering a card as a payment method.
 */
export type RegisteringCardPaymentMethodArgs = RegisteringPaymentMethodCommonArgs & {
    payType: "Card"

    /**
     * UI that has been already mounted. The card is read from it.
     */
    ui: FincodeUI

    /**
     * Whether to authenticate the card with 3D Secure. (default: `"0"`)
     */
    tdsType?: PaymentMethodTdsType

    /**
     * URL the customer returns to after authenticating successfully.
     *
     * Required when `tdsType` is `"2"`.
     */
    returnUrl?: string

    /**
     * URL the customer returns to after failing to authenticate.
     */
    returnUrlOnFailure?: string
}

/**
 * Arguments for registering a bank account as a direct debit payment method.
 *
 * fincodeJS has no input form for bank accounts, so the account is passed in
 * here rather than read from the ui.
 */
export type RegisteringDirectDebitPaymentMethodArgs = RegisteringPaymentMethodCommonArgs & {
    payType: "Directdebit"

    /**
     * How the account is applied for.
     */
    applicationType: DirectDebitApplicationType

    /**
     * Bank code.
     */
    bankCode: string

    /**
     * Account holder's name in half-width katakana.
     */
    accountNameKana: string

    /**
     * Transfer service to register the account with.
     *
     * Left out, the account goes to the shop's default transfer service.
     */
    settlementRoute?: DirectDebitSettlementRoute

    branchCode?: string

    /**
     * Deposit type of the account.
     *
     * Required unless `bankCode` is `9900` (Japan Post Bank).
     */
    accountType?: DirectDebitAccountType

    accountNumber?: string
    accountName?: string

    /**
     * Symbol of the Japan Post Bank account. Use with `postalAccountNumber2`
     * instead of `branchCode` and `accountNumber` when `bankCode` is `9900`.
     */
    postalAccountNumber1?: string
    postalAccountNumber2?: string

    /**
     * ID of the paper request form.
     *
     * Required when `applicationType` is `"PAPER"`.
     */
    requestFormId?: string

    /**
     * URL the customer returns to after authorising the debit.
     *
     * Required when `applicationType` is `"ONLINE"`.
     */
    returnUrl?: string

    /**
     * URL the customer returns to after failing to authorise the debit.
     */
    returnUrlOnFailure?: string
}

/**
 * Arguments for registering a virtual account fixed to the customer as a
 * payment method.
 *
 * fincode assigns the account, so there is nothing to collect from the
 * customer.
 */
export type RegisteringVirtualAccountPaymentMethodArgs = RegisteringPaymentMethodCommonArgs & {
    payType: "Virtualaccount"
}

export type RegisteringPaymentMethodArgs =
    | RegisteringCardPaymentMethodArgs
    | RegisteringDirectDebitPaymentMethodArgs
    | RegisteringVirtualAccountPaymentMethodArgs

/**
 * 決済手段APIへ POST する。
 *
 * fincodeJS は決済手段API用の関数を持たないため、fincode.js の
 * _sendRequest と同じ組み立てでSDKから直接送る。Tenant-Shop-Id と
 * idempotent_key は設定されている場合のみ載せる。
 */
const postPaymentMethod = async <T>(
    fincode: FincodeInstance,
    customerId: string,
    body: Record<string, unknown>,
): Promise<T> => {
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
        res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) })
    } catch (e) {
        throw new FincodeSDKError("Some error has occured. couldn't register payment method", e)
    }

    const responseBody = await res.json()
    if (!res.ok) {
        throw responseBody as APIErrorResponse
    }

    return responseBody as T
}

/**
 * **registerPaymentMethod**
 *
 * registers a payment method of the customer.
 *
 * `payType` decides what else is needed. A card is read from the mounted ui
 * and turned into a token through `fincode.tokens(...)` first. A bank
 * account for direct debit is passed in, since fincodeJS has no input form
 * for one. A virtual account needs nothing further, because fincode assigns
 * it.
 *
 * This is not a wrapper of a fincodeJS function. fincodeJS has no function
 * for the payment method API, so this issues the request itself, with the
 * public key and the headers the fincode instance was set up with. Values
 * set through `setTenantShopId` and `setIdempotentKey` are applied.
 *
 * @param {RegisteringPaymentMethodArgs} args arguments object
 * @returns {Promise<PaymentMethodObject>}
 */
export function registerPaymentMethod(args: RegisteringCardPaymentMethodArgs): Promise<CardPaymentMethodObject>
export function registerPaymentMethod(args: RegisteringDirectDebitPaymentMethodArgs): Promise<DirectDebitPaymentMethodObject>
export function registerPaymentMethod(args: RegisteringVirtualAccountPaymentMethodArgs): Promise<VirtualAccountPaymentMethodObject>
export function registerPaymentMethod(args: RegisteringPaymentMethodArgs): Promise<PaymentMethodObject>
export async function registerPaymentMethod(args: RegisteringPaymentMethodArgs): Promise<PaymentMethodObject> {
    const { fincode, customerId } = args

    if (!customerId) {
        throw new FincodeSDKError("customerId is required")
    }

    const common = {
        default_flag: args.useDefault ? "1" : "0",
        client_field_1: args.clientField1,
        client_field_2: args.clientField2,
        client_field_3: args.clientField3,
    }

    if (args.payType === "Card") {
        if (args.tdsType === "2" && !args.returnUrl) {
            throw new FincodeSDKError("returnUrl is required when tdsType is \"2\"")
        }

        const { list } = await getCardToken({ fincode, ui: args.ui })
        const token = list[0]?.token
        if (!token) {
            throw new FincodeSDKError("Could not issue a card token")
        }

        return postPaymentMethod<CardPaymentMethodObject>(fincode, customerId, {
            ...common,
            pay_type: "Card",
            return_url: args.returnUrl,
            return_url_on_failure: args.returnUrlOnFailure,
            card: {
                token: token,
                tds_type: args.tdsType,
            },
        })
    }

    if (args.payType === "Directdebit") {
        if (args.applicationType === "ONLINE" && !args.returnUrl) {
            throw new FincodeSDKError("returnUrl is required when applicationType is \"ONLINE\"")
        }
        if (args.applicationType === "PAPER" && !args.requestFormId) {
            throw new FincodeSDKError("requestFormId is required when applicationType is \"PAPER\"")
        }

        return postPaymentMethod<DirectDebitPaymentMethodObject>(fincode, customerId, {
            ...common,
            pay_type: "Directdebit",
            return_url: args.returnUrl,
            return_url_on_failure: args.returnUrlOnFailure,
            directdebit: {
                application_type: args.applicationType,
                settlement_route: args.settlementRoute,
                bank_code: args.bankCode,
                branch_code: args.branchCode,
                account_type: args.accountType,
                account_number: args.accountNumber,
                account_name: args.accountName,
                account_name_kana: args.accountNameKana,
                postal_account_number_1: args.postalAccountNumber1,
                postal_account_number_2: args.postalAccountNumber2,
                paper_application: args.requestFormId ? { request_form_id: args.requestFormId } : undefined,
            },
        })
    }

    return postPaymentMethod<VirtualAccountPaymentMethodObject>(fincode, customerId, {
        ...common,
        pay_type: "Virtualaccount",
    })
}
