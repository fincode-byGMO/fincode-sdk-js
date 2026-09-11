import { registerPaymentMethod, type RegisteringPaymentMethodArgs } from "./utils"
import { FincodeInstance, FincodeUI } from "./js"
import { TokenIssuingResponse } from "./api"

type FormDataOf = Awaited<ReturnType<FincodeUI["getFormData"]>>

const NEW_CARD_FORM: Partial<FormDataOf> = {
    cardNo: "4111111111111111",
    expire: "3012",
    CVC: "123",
    holderName: "TARO YAMADA",
    payTimes: "1",
    method: "1",
}

const uiReturning = (formData: Partial<FormDataOf>): FincodeUI => ({
    create: jest.fn(),
    mount: jest.fn(),
    getFormData: jest.fn().mockResolvedValue(formData as FormDataOf),
    destroy: jest.fn(),
})

const stubFincode = (overrides?: Partial<FincodeInstance["config"]>): FincodeInstance => ({
    config: {
        api: { host: "https://api.test.fincode.jp/", context: "v1" },
        headers: {
            accept: "application/json",
            contentType: "application/json",
            tenantShopId: "",
            idempotentKey: "",
        },
        apiKey: "p_test_0000000000000000",
        ...overrides,
    },
    tokens: jest.fn((_card, callback) =>
        callback(200, { list: [{ token: "tok_0000000000" }] } as TokenIssuingResponse),
    ),
    cards: jest.fn(),
    payments: jest.fn(),
    getCardsList: jest.fn(),
    ui: jest.fn(),
    setTenantShopId: jest.fn(),
    setIdempotentKey: jest.fn(),
})

/** fetch の戻り値を最小限で模す */
const jsonResponse = (status: number, body: unknown) =>
    ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response

const fetchMock = () => global.fetch as unknown as jest.Mock

const lastRequest = () => {
    const mock = fetchMock()
    const [url, init] = mock.mock.calls[mock.mock.calls.length - 1]
    return { url: url as string, init: init as RequestInit, body: JSON.parse(init.body as string) }
}

beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch
})

afterEach(() => {
    jest.restoreAllMocks()
})

describe("registerPaymentMethod: Card", () => {
    it("決済手段APIのURLへ POST する", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "cs_x", status: "ACTIVATED" }))

        await registerPaymentMethod({
            payType: "Card",
            fincode: stubFincode(),
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
        })

        const { url, init } = lastRequest()
        expect(url).toBe("https://api.test.fincode.jp/v1/customers/c_0000000000/payment_methods")
        expect(init.method).toBe("POST")
    })

    it("トークンを発行してから card.token に載せる", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "cs_x" }))
        const fincode = stubFincode()

        await registerPaymentMethod({
            payType: "Card",
            fincode,
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
        })

        expect(fincode.tokens).toHaveBeenCalled()
        expect(lastRequest().body).toMatchObject({
            pay_type: "Card",
            card: { token: "tok_0000000000" },
        })
    })

    it("公開鍵を Authorization ヘッダに載せる", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "cs_x" }))

        await registerPaymentMethod({
            payType: "Card",
            fincode: stubFincode(),
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
        })

        expect(lastRequest().init.headers).toMatchObject({
            "Authorization": "Bearer p_test_0000000000000000",
            "Content-Type": "application/json",
        })
    })

    it("setTenantShopId と setIdempotentKey の設定を引き継ぐ", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "cs_x" }))

        await registerPaymentMethod({
            payType: "Card",
            fincode: stubFincode({
                headers: {
                    accept: "application/json",
                    contentType: "application/json",
                    tenantShopId: "s_0000000000",
                    idempotentKey: "09cc7c2a-3ab4-491a-a891-7f41d6c18fc4",
                },
            }),
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
        })

        expect(lastRequest().init.headers).toMatchObject({
            "Tenant-Shop-Id": "s_0000000000",
            "idempotent_key": "09cc7c2a-3ab4-491a-a891-7f41d6c18fc4",
        })
    })

    it("設定されていないヘッダは送らない", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "cs_x" }))

        await registerPaymentMethod({
            payType: "Card",
            fincode: stubFincode(),
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
        })

        const headers = lastRequest().init.headers as Record<string, string>
        expect(headers).not.toHaveProperty("Tenant-Shop-Id")
        expect(headers).not.toHaveProperty("idempotent_key")
    })

    it("useDefault を default_flag に移す", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "cs_x" }))

        await registerPaymentMethod({
            payType: "Card",
            fincode: stubFincode(),
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
            useDefault: true,
        })
        expect(lastRequest().body.default_flag).toBe("1")

        await registerPaymentMethod({
            payType: "Card",
            fincode: stubFincode(),
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
        })
        expect(lastRequest().body.default_flag).toBe("0")
    })

    it("tdsType を card.tds_type に移す", async () => {
        fetchMock().mockResolvedValue(
            jsonResponse(200, { id: "cs_x", status: "AWAITING_CUSTOMER_ACTION", redirect_url: "https://3ds" }),
        )

        const res = await registerPaymentMethod({
            payType: "Card",
            fincode: stubFincode(),
            ui: uiReturning(NEW_CARD_FORM),
            customerId: "c_0000000000",
            tdsType: "2",
            returnUrl: "https://example.com/ok",
        })

        expect(lastRequest().body).toMatchObject({
            card: { tds_type: "2" },
            return_url: "https://example.com/ok",
        })
        expect(res.redirect_url).toBe("https://3ds")
    })

    it("tdsType が 2 で returnUrl が無ければ送信せずに落とす", async () => {
        await expect(
            registerPaymentMethod({
                payType: "Card",
                fincode: stubFincode(),
                ui: uiReturning(NEW_CARD_FORM),
                customerId: "c_0000000000",
                tdsType: "2",
            }),
        ).rejects.toThrow("returnUrl is required")

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("customerId が空なら送信せずに落とす", async () => {
        await expect(
            registerPaymentMethod({
                payType: "Card",
                fincode: stubFincode(),
                ui: uiReturning(NEW_CARD_FORM),
                customerId: "",
            }),
        ).rejects.toThrow("customerId is required")

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("カード番号が無ければトークン発行の段階で落ちる", async () => {
        await expect(
            registerPaymentMethod({
                payType: "Card",
                fincode: stubFincode(),
                ui: uiReturning({ ...NEW_CARD_FORM, cardNo: undefined }),
                customerId: "c_0000000000",
            }),
        ).rejects.toThrow("Card number is undefined")

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("APIがエラーを返したらそのレスポンスで落とす", async () => {
        const errors = { errors: [{ error_code: "EC013033008", error_message: "3Dセキュア利用種別の書式が正しくありません。" }] }
        fetchMock().mockResolvedValue(jsonResponse(400, errors))

        await expect(
            registerPaymentMethod({
                payType: "Card",
                fincode: stubFincode(),
                ui: uiReturning(NEW_CARD_FORM),
                customerId: "c_0000000000",
            }),
        ).rejects.toEqual(errors)
    })

    it("通信自体が失敗したら SDK のエラーで落とす", async () => {
        fetchMock().mockRejectedValue(new TypeError("Failed to fetch"))

        await expect(
            registerPaymentMethod({
                payType: "Card",
                fincode: stubFincode(),
                ui: uiReturning(NEW_CARD_FORM),
                customerId: "c_0000000000",
            }),
        ).rejects.toThrow("couldn't register payment method")
    })
})

describe("registerPaymentMethod: Directdebit", () => {
    it("口座情報を directdebit ブロックに移す", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "pm_x", pay_type: "Directdebit" }))

        await registerPaymentMethod({
            payType: "Directdebit",
            fincode: stubFincode(),
            customerId: "c_0000000000",
            useDefault: true,
            applicationType: "ONLINE",
            returnUrl: "https://example.com/ok",
            settlementRoute: "1",
            bankCode: "0001",
            branchCode: "001",
            accountType: "1",
            accountNumber: "1234567",
            accountName: "テスト",
            accountNameKana: "ﾃｽﾄ",
        })

        expect(lastRequest().body).toMatchObject({
            pay_type: "Directdebit",
            default_flag: "1",
            return_url: "https://example.com/ok",
            directdebit: {
                application_type: "ONLINE",
                settlement_route: "1",
                bank_code: "0001",
                branch_code: "001",
                account_type: "1",
                account_number: "1234567",
                account_name_kana: "ﾃｽﾄ",
            },
        })
    })

    it("ONLINE で returnUrl が無ければ送信せずに落とす", async () => {
        await expect(
            registerPaymentMethod({
                payType: "Directdebit",
                fincode: stubFincode(),
                customerId: "c_0000000000",
                applicationType: "ONLINE",
                bankCode: "0001",
                accountNameKana: "ﾃｽﾄ",
            }),
        ).rejects.toThrow("returnUrl is required")

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("PAPER で requestFormId が無ければ送信せずに落とす", async () => {
        await expect(
            registerPaymentMethod({
                payType: "Directdebit",
                fincode: stubFincode(),
                customerId: "c_0000000000",
                applicationType: "PAPER",
                bankCode: "0001",
                accountNameKana: "ﾃｽﾄ",
            }),
        ).rejects.toThrow("requestFormId is required")

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("PAPER では requestFormId を paper_application に入れる", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "pm_x" }))

        await registerPaymentMethod({
            payType: "Directdebit",
            fincode: stubFincode(),
            customerId: "c_0000000000",
            applicationType: "PAPER",
            requestFormId: "rf_0000000000",
            bankCode: "0001",
            accountNameKana: "ﾃｽﾄ",
        })

        expect(lastRequest().body.directdebit.paper_application).toEqual({ request_form_id: "rf_0000000000" })
    })

    it("ONLINE では paper_application を送らない", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "pm_x" }))

        await registerPaymentMethod({
            payType: "Directdebit",
            fincode: stubFincode(),
            customerId: "c_0000000000",
            applicationType: "ONLINE",
            returnUrl: "https://example.com/ok",
            bankCode: "0001",
            accountNameKana: "ﾃｽﾄ",
        })

        expect(lastRequest().body.directdebit).not.toHaveProperty("paper_application")
    })

    it("トークンは発行しない", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "pm_x" }))
        const fincode = stubFincode()

        await registerPaymentMethod({
            payType: "Directdebit",
            fincode,
            customerId: "c_0000000000",
            applicationType: "ONLINE",
            returnUrl: "https://example.com/ok",
            bankCode: "0001",
            accountNameKana: "ﾃｽﾄ",
        })

        expect(fincode.tokens).not.toHaveBeenCalled()
    })
})

describe("registerPaymentMethod: Virtualaccount", () => {
    it("決済種別とデフォルトフラグだけを送る", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "pm_x", pay_type: "Virtualaccount" }))

        await registerPaymentMethod({
            payType: "Virtualaccount",
            fincode: stubFincode(),
            customerId: "c_0000000000",
            useDefault: true,
        })

        const body = lastRequest().body
        expect(body).toMatchObject({ pay_type: "Virtualaccount", default_flag: "1" })
        expect(body).not.toHaveProperty("card")
        expect(body).not.toHaveProperty("directdebit")
    })

    it("UIもトークンも要らない", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "pm_x" }))
        const fincode = stubFincode()

        await registerPaymentMethod({ payType: "Virtualaccount", fincode, customerId: "c_0000000000" })

        expect(fincode.tokens).not.toHaveBeenCalled()
        expect(fincode.ui).not.toHaveBeenCalled()
    })

    it("customerId が空なら送信せずに落とす", async () => {
        await expect(
            registerPaymentMethod({ payType: "Virtualaccount", fincode: stubFincode(), customerId: "" }),
        ).rejects.toThrow("customerId is required")

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("3つのヘルパーが同じURLとヘッダを組む", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "pm_x" }))

        await registerPaymentMethod({
            payType: "Virtualaccount",
            fincode: stubFincode({
                headers: {
                    accept: "application/json",
                    contentType: "application/json",
                    tenantShopId: "s_0000000000",
                    idempotentKey: "",
                },
            }),
            customerId: "c_0000000000",
        })

        const { url, init } = lastRequest()
        expect(url).toBe("https://api.test.fincode.jp/v1/customers/c_0000000000/payment_methods")
        expect(init.headers).toMatchObject({ "Tenant-Shop-Id": "s_0000000000" })
    })
})

describe("registerPaymentMethod の型", () => {
    it("payType ごとに必須項目が変わる", () => {
        const card = (fincode: FincodeInstance, ui: FincodeUI) =>
            // @ts-expect-error カードは ui が必須
            registerPaymentMethod({ payType: "Card", fincode, customerId: "c_x" }) && ui

        const directdebit = (fincode: FincodeInstance) =>
            // @ts-expect-error 口座振替は applicationType / bankCode / accountNameKana が必須
            registerPaymentMethod({ payType: "Directdebit", fincode, customerId: "c_x" })

        const virtualaccount = (fincode: FincodeInstance) =>
            // バーチャル口座は追加の項目が要らない
            registerPaymentMethod({ payType: "Virtualaccount", fincode, customerId: "c_x" })

        expect([card, directdebit, virtualaccount].every((f) => typeof f === "function")).toBe(true)
    })

    it("payType に応じた戻り値の型になる", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "x" }))
        const fincode = stubFincode()

        const card = await registerPaymentMethod({
            payType: "Card", fincode, ui: uiReturning(NEW_CARD_FORM), customerId: "c_x",
        })
        void card.card

        const va = await registerPaymentMethod({ payType: "Virtualaccount", fincode, customerId: "c_x" })
        void va.virtualaccount
        // @ts-expect-error バーチャル口座の戻り値に card は無い
        void va.card

        expect(true).toBe(true)
    })

    it("payType が確定しない場合は共用体が返る", async () => {
        fetchMock().mockResolvedValue(jsonResponse(200, { id: "x" }))

        // 引数が共用体のままなら、広いオーバーロードが選ばれる
        const call = (args: RegisteringPaymentMethodArgs) => registerPaymentMethod(args)

        const pm = await call({
            payType: "Virtualaccount", fincode: stubFincode(), customerId: "c_x",
        })

        // 絞り込まないと決済種別ごとの項目は読めない
        // @ts-expect-error 共用体のままでは card は読めない
        void pm.card
        if (pm.pay_type === "Card") void pm.card

        expect(pm).toBeDefined()
    })
})
