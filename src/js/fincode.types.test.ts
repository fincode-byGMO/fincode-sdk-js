import { FincodeInstance } from "./fincode"
import { Appearance, FincodeUI } from "./ui"

/**
 * fincode.js が公開しているものと型が一致していることを固定する。
 *
 * 期待値は配信されている実物から取った。
 * https://js.test.fincode.jp/v1/fincode.js
 * https://js.test.fincode.jp/_templates/CardPaymentInputElements
 */
describe("FincodeInstance", () => {
    it("実物が公開している7つのメンバーを持つ", () => {
        const members: (keyof FincodeInstance)[] = [
            "tokens",
            "cards",
            "payments",
            "getCardsList",
            "ui",
            "setTenantShopId",
            "setIdempotentKey",
        ]

        expect(members).toHaveLength(7)
    })

    it("getCardsList は顧客IDと2つのコールバックを取る", () => {
        type Args = Parameters<FincodeInstance["getCardsList"]>

        const call = (fincode: FincodeInstance) =>
            fincode.getCardsList(
                "c_0000000000",
                (status, response) => {
                    // ページネーション項目は返らないので list だけ読める
                    const first = response.list[0]
                    return [status, first?.id] as const
                },
                () => undefined,
            )

        expect(call).toBeInstanceOf(Function)
        expect<Args["length"]>(3).toBe(3)
    })

    it("getCardsList の応答はページネーション項目を持たない", () => {
        type Response = Parameters<Parameters<FincodeInstance["getCardsList"]>[1]>[1]

        const response: Response = { list: [] }

        // @ts-expect-error GET /v1/customers/{id}/cards は total_count を返さない
        expect(response.total_count).toBeUndefined()
    })
})

describe("FincodeUI", () => {
    it("実物が公開している4つのメンバーを持つ", () => {
        const members: (keyof FincodeUI)[] = ["create", "mount", "getFormData", "destroy"]

        expect(members).toHaveLength(4)
    })

    it("create はコールバックを含む4引数を取る", () => {
        const call = (ui: FincodeUI) =>
            ui.create("payments", { layout: "vertical" }, () => undefined, () => undefined)

        expect(call).toBeInstanceOf(Function)
    })

    it("mount は width を省略できる", () => {
        const call = (ui: FincodeUI) => {
            ui.mount("fincode")
            ui.mount("fincode", "400")
            ui.mount("fincode", "400", () => undefined, () => undefined)
        }

        expect(call).toBeInstanceOf(Function)
    })

    it("create の method は3種類のみ", () => {
        const call = (ui: FincodeUI) =>
            // @ts-expect-error tokens ではなく token
            ui.create("tokens", {})

        expect(call).toBeInstanceOf(Function)
    })
})

describe("Appearance", () => {
    it("セキュリティコードのラベルは labelCvc で指定する", () => {
        const appearance: Appearance = { labelCvc: "セキュリティコード" }

        expect(appearance.labelCvc).toBe("セキュリティコード")
    })

    it("labelCVC は受け付けない", () => {
        // 入力フォームが読むのは labelCvc。旧名を渡しても効かなかった
        // @ts-expect-error 大文字の CVC は入力フォームが読まない
        const appearance: Appearance = { labelCVC: "セキュリティコード" }

        expect(appearance).toBeDefined()
    })

    it("theme とラジオ・セレクトの色を指定できる", () => {
        const appearance: Appearance = {
            theme: "dark",
            cardId: "cs_0000000000",
            holderName: "TARO YAMADA",
            colorBackgroundRadio: "000000",
            colorRadio: "ffffff",
            colorRadioText: "ffffff",
            colorSelect: "ffffff",
        }

        expect(appearance.theme).toBe("dark")
    })

    it("theme は2種類のみ", () => {
        // @ts-expect-error light というテーマは無い
        const appearance: Appearance = { theme: "light" }

        expect(appearance).toBeDefined()
    })

    it("method は受け付けない", () => {
        // 入力フォームは appearance.method も読むが、create() が渡す method が
        // クエリの先頭に来るため必ず先を越され、指定しても効かない
        // @ts-expect-error create() の第1引数で指定する
        const appearance: Appearance = { method: "payments" }

        expect(appearance).toBeDefined()
    })
})
