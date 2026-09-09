import { executePayment, getCardToken, registerCard } from "./utils"
import { FincodeInstance, FincodeUI } from "./js"
import { CardObject, PaymentObject, TokenIssuingResponse } from "./api"

type FormDataOf = Awaited<ReturnType<FincodeUI["getFormData"]>>

const uiReturning = (formData: Partial<FormDataOf>): FincodeUI => ({
    create: jest.fn(),
    mount: jest.fn(),
    getFormData: jest.fn().mockResolvedValue(formData as FormDataOf),
    destroy: jest.fn(),
})

/**
 * fincode インスタンスのスタブ。
 *
 * 実物の tokens / cards / payments は
 * (引数, 成功コールバック, 失敗コールバック) の3引数を取り、
 * 成功コールバックには HTTP ステータスとレスポンスが渡される。
 */
const fincodeReturning = (status: number, response: unknown): FincodeInstance => ({
    tokens: jest.fn((_card, callback) => callback(status, response as TokenIssuingResponse)),
    cards: jest.fn((_card, callback) => callback(status, response as CardObject)),
    payments: jest.fn((_tx, callback) => callback(status, response as PaymentObject)),
    getCardsList: jest.fn(),
    ui: jest.fn(),
    setTenantShopId: jest.fn(),
    setIdempotentKey: jest.fn(),
})

const fincodeFailing = (): FincodeInstance => ({
    tokens: jest.fn((_card, _callback, errorCallback) => errorCallback()),
    cards: jest.fn((_card, _callback, errorCallback) => errorCallback()),
    payments: jest.fn((_tx, _callback, errorCallback) => errorCallback()),
    getCardsList: jest.fn((_customerId, _callback, errorCallback) => errorCallback()),
    ui: jest.fn(),
    setTenantShopId: jest.fn(),
    setIdempotentKey: jest.fn(),
})

const NEW_CARD_FORM: Partial<FormDataOf> = {
    cardNo: "4111111111111111",
    expire: "3012",
    CVC: "123",
    holderName: "TARO YAMADA",
    payTimes: "1",
    method: "1",
}

const SAVED_CARD_FORM: Partial<FormDataOf> = {
    customerId: "c_0000000000",
    cardId: "cs_0000000000",
    payTimes: "1",
    method: "1",
}

describe("executePayment", () => {
    it("入力フォームの値を決済実行のリクエストに移す", async () => {
        const fincode = fincodeReturning(200, { id: "o_0000000000" })

        await executePayment({
            fincode,
            ui: uiReturning(NEW_CARD_FORM),
            id: "o_0000000000",
            payType: "Card",
            accessId: "a_0000000000",
        })

        expect(fincode.payments).toHaveBeenCalledWith(
            expect.objectContaining({
                pay_type: "Card",
                access_id: "a_0000000000",
                id: "o_0000000000",
                card_no: NEW_CARD_FORM.cardNo,
                expire: NEW_CARD_FORM.expire,
                security_code: NEW_CARD_FORM.CVC,
                holder_name: NEW_CARD_FORM.holderName,
                method: NEW_CARD_FORM.method,
            }),
            expect.any(Function),
            expect.any(Function),
        )
    })

    it("登録済みカードを選んだ場合は顧客IDとカードIDを渡す", async () => {
        const fincode = fincodeReturning(200, { id: "o_0000000000" })

        await executePayment({
            fincode,
            ui: uiReturning(SAVED_CARD_FORM),
            id: "o_0000000000",
            payType: "Card",
            accessId: "a_0000000000",
        })

        expect(fincode.payments).toHaveBeenCalledWith(
            expect.objectContaining({
                customer_id: SAVED_CARD_FORM.customerId,
                card_id: SAVED_CARD_FORM.cardId,
            }),
            expect.any(Function),
            expect.any(Function),
        )
    })

    it("200 ならレスポンスで解決する", async () => {
        const response = { id: "o_0000000000", status: "CAPTURED" }

        await expect(
            executePayment({
                fincode: fincodeReturning(200, response),
                ui: uiReturning(NEW_CARD_FORM),
                id: "o_0000000000",
                payType: "Card",
                accessId: "a_0000000000",
            }),
        ).resolves.toEqual(response)
    })

    it("200 以外ならレスポンスをそのまま棄却理由にする", async () => {
        const errorResponse = { errors: [{ error_code: "EC002103001" }] }

        await expect(
            executePayment({
                fincode: fincodeReturning(400, errorResponse),
                ui: uiReturning(NEW_CARD_FORM),
                id: "o_0000000000",
                payType: "Card",
                accessId: "a_0000000000",
            }),
        ).rejects.toEqual(errorResponse)
    })

    it("通信自体が失敗した場合はエラーコード - のエラーで棄却する", async () => {
        await expect(
            executePayment({
                fincode: fincodeFailing(),
                ui: uiReturning(NEW_CARD_FORM),
                id: "o_0000000000",
                payType: "Card",
                accessId: "a_0000000000",
            }),
        ).rejects.toEqual(
            expect.objectContaining({
                errors: [expect.objectContaining({ error_code: "-" })],
            }),
        )
    })
})

describe("getCardToken", () => {
    it("トークン発行数を省略すると 1 を送る", async () => {
        const fincode = fincodeReturning(200, { list: [{ token: "t" }] })

        await getCardToken({ fincode, ui: uiReturning(NEW_CARD_FORM) })

        expect(fincode.tokens).toHaveBeenCalledWith(
            expect.objectContaining({ number: "1" }),
            expect.any(Function),
            expect.any(Function),
        )
    })

    it("トークン発行数を指定できる", async () => {
        const fincode = fincodeReturning(200, { list: [{ token: "t" }] })

        await getCardToken({ fincode, ui: uiReturning(NEW_CARD_FORM), number: "3" })

        expect(fincode.tokens).toHaveBeenCalledWith(
            expect.objectContaining({ number: "3" }),
            expect.any(Function),
            expect.any(Function),
        )
    })

    it("カード番号が無ければトークンを要求せずに棄却する", async () => {
        const fincode = fincodeReturning(200, {})

        await expect(
            getCardToken({ fincode, ui: uiReturning({ ...NEW_CARD_FORM, cardNo: undefined }) }),
        ).rejects.toThrow("Card number is undefined")

        expect(fincode.tokens).not.toHaveBeenCalled()
    })

    it("有効期限が無ければトークンを要求せずに棄却する", async () => {
        const fincode = fincodeReturning(200, {})

        await expect(
            getCardToken({ fincode, ui: uiReturning({ ...NEW_CARD_FORM, expire: undefined }) }),
        ).rejects.toThrow("Expire date is undefined")

        expect(fincode.tokens).not.toHaveBeenCalled()
    })

    it("200 ならレスポンスで解決する", async () => {
        const response = { list: [{ token: "t1" }, { token: "t2" }] }

        await expect(
            getCardToken({ fincode: fincodeReturning(200, response), ui: uiReturning(NEW_CARD_FORM) }),
        ).resolves.toEqual(response)
    })

    it("通信自体が失敗した場合は SDK のエラーで棄却する", async () => {
        await expect(
            getCardToken({ fincode: fincodeFailing(), ui: uiReturning(NEW_CARD_FORM) }),
        ).rejects.toThrow("couldn't issue token")
    })
})

describe("registerCard", () => {
    it("useDefault が true なら default_flag に 1 を送る", async () => {
        const fincode = fincodeReturning(200, { id: "cs_0000000000" })

        await registerCard({
            fincode,
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
            useDefault: true,
        })

        expect(fincode.cards).toHaveBeenCalledWith(
            expect.objectContaining({ customer_id: "c_0000000000", default_flag: "1" }),
            expect.any(Function),
            expect.any(Function),
        )
    })

    it("useDefault を省略すると default_flag に 0 を送る", async () => {
        const fincode = fincodeReturning(200, { id: "cs_0000000000" })

        await registerCard({ fincode, ui: uiReturning(NEW_CARD_FORM), customerId: "c_0000000000" })

        expect(fincode.cards).toHaveBeenCalledWith(
            expect.objectContaining({ default_flag: "0" }),
            expect.any(Function),
            expect.any(Function),
        )
    })

    it("カード番号が無ければ登録を要求せずに棄却する", async () => {
        const fincode = fincodeReturning(200, {})

        await expect(
            registerCard({
                fincode,
                ui: uiReturning({ ...NEW_CARD_FORM, cardNo: undefined }),
                customerId: "c_0000000000",
            }),
        ).rejects.toThrow("Card number is undefined")

        expect(fincode.cards).not.toHaveBeenCalled()
    })

    it("通信自体が失敗した場合は SDK のエラーで棄却する", async () => {
        await expect(
            registerCard({
                fincode: fincodeFailing(),
                ui: uiReturning(NEW_CARD_FORM),
                customerId: "c_0000000000",
            }),
        ).rejects.toThrow("couldn't register card")
    })
})
