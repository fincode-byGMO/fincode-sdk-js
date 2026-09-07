import { FincodeUIFormData, FormData as DeprecatedFormData } from "./ui"

/**
 * getFormData が返す形の取り決めを型で固定する。
 *
 * 期待値は fincode が配信している入力フォーム
 * （js.test.fincode.jp/_templates/CardPaymentInputElements）の実装から取った。
 * 親ウィンドウへ postMessage されるオブジェクトは、カードの選択と支払方法の
 * 組み合わせで6通りある。
 */
describe("FincodeUIFormData", () => {
    it("新しいカードを入力した場合の形を受け付ける", () => {
        // 支払方法が一括のとき
        const lumpSum: FincodeUIFormData = {
            cardNo: "4111111111111111",
            CVC: "123",
            expire: "3012",
            year: "30",
            month: "12",
            holderName: "TARO YAMADA",
            payTimes: "1",
            method: "1",
        }
        expect(lumpSum.method).toBe("1")

        // 支払方法がリボのとき。payTimes は返らない
        const revolving: FincodeUIFormData = {
            cardNo: "4111111111111111",
            CVC: "123",
            expire: "3012",
            year: "30",
            month: "12",
            holderName: "TARO YAMADA",
            method: "5",
        }
        expect(revolving.payTimes).toBeUndefined()

        // 支払方法が分割のとき
        const installments: FincodeUIFormData = {
            cardNo: "4111111111111111",
            CVC: "123",
            expire: "3012",
            year: "30",
            month: "12",
            holderName: "TARO YAMADA",
            payTimes: "3",
            method: "2",
        }
        expect(installments.payTimes).toBe("3")
    })

    it("登録済みカードを選んだ場合の形を受け付ける", () => {
        const lumpSum: FincodeUIFormData = {
            customerId: "c_0000000000",
            cardId: "cs_0000000000",
            payTimes: "1",
            method: "1",
        }
        expect(lumpSum.cardId).toBe("cs_0000000000")

        const revolving: FincodeUIFormData = {
            customerId: "c_0000000000",
            cardId: "cs_0000000000",
            method: "5",
        }
        expect(revolving.payTimes).toBeUndefined()
    })

    it("有効期限の年月は year / month で返る", () => {
        const form: FincodeUIFormData = { year: "30", month: "12", method: "1" }

        expect(form.year).toBe("30")
        expect(form.month).toBe("12")

        // expireYear / expireMonth は appearance 側のプレースホルダー指定の
        // キー名で、入力フォームの返却には現れない。
        // @ts-expect-error 返却されないキーを読もうとしたらコンパイルエラーにする
        expect(form.expireYear).toBeUndefined()
        // @ts-expect-error expireMonth も返却には現れない
        expect(form.expireMonth).toBeUndefined()
    })

    it("method に想定外の値は入らない", () => {
        // @ts-expect-error "3" は支払方法として存在しない
        const form: FincodeUIFormData = { method: "3" }

        expect(form).toBeDefined()
    })

    it("旧名 FormData は FincodeUIFormData の別名として残っている", () => {
        const form: DeprecatedFormData = { method: "1" }
        const same: FincodeUIFormData = form

        expect(same.method).toBe("1")
    })
})
