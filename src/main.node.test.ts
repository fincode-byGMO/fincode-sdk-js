/**
 * @jest-environment node
 */
import { initFincode } from "./main"

/**
 * サーバーサイドレンダリングのように window が無い環境での挙動。
 * このSDKはブラウザ向けだが、Next.js などでサーバー側でも
 * import されうるため、読み込み自体で落ちないことを確かめる。
 */
describe("initFincode: window が無い環境", () => {
    it("同期的な例外ではなく、棄却された Promise を返す", async () => {
        const promise = initFincode({ publicKey: "p_test_0000000000000000" })

        expect(promise).toBeInstanceOf(Promise)
        await expect(promise).rejects.toThrow("window is undefined")
    })

    it("publicKey の検証は window の有無より先に行う", () => {
        expect(() => initFincode({ publicKey: "" })).toThrow("publicKey is required")
    })
})
