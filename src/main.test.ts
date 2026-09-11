import { initFincode } from "./main"
import { FincodeInstance } from "./js/fincode"

const V1_URL_TEST = "https://js.test.fincode.jp/v1/fincode.js"
const V1_URL_PROD = "https://js.fincode.jp/v1/fincode.js"

const PUBLIC_KEY = "p_test_0000000000000000"

/**
 * fincode.js が読み込まれたことを模す。
 *
 * 実物の fincode.js は window.Fincode に初期化関数を置くので、
 * それと同じ形のスタブを返す。
 */
const stubFincodeInstance = () => ({ stub: true }) as unknown as FincodeInstance

const injectedScripts = () =>
    Array.from(document.querySelectorAll<HTMLScriptElement>("script"))

beforeEach(() => {
    document.head.innerHTML = ""
    document.body.innerHTML = ""
    delete (window as { Fincode?: unknown }).Fincode
})

describe("initFincode: 引数の検証", () => {
    it("publicKey が空なら同期的に例外を投げる", () => {
        expect(() => initFincode({ publicKey: "" })).toThrow("publicKey is required")
    })

    it("isLiveMode が boolean でなければ同期的に例外を投げる", () => {
        expect(() =>
            initFincode({ publicKey: PUBLIC_KEY, isLiveMode: "true" as unknown as boolean }),
        ).toThrow("isLiveMode must be a boolean")
    })

    it("isLiveMode の省略は許容する", () => {
        expect(() => initFincode({ publicKey: PUBLIC_KEY })).not.toThrow()
    })

    it("例外のメッセージには SDK であることが分かる接頭辞が付く", () => {
        expect(() => initFincode({ publicKey: "" })).toThrow("[fincode SDK]")
    })
})

describe("initFincode: fincode.js が既に読み込まれている場合", () => {
    it("スクリプトを注入せず、window.Fincode の戻り値で解決する", async () => {
        const instance = stubFincodeInstance()
        const initializer = jest.fn().mockReturnValue(instance)
        window.Fincode = initializer

        await expect(initFincode({ publicKey: PUBLIC_KEY })).resolves.toBe(instance)

        expect(initializer).toHaveBeenCalledWith(PUBLIC_KEY)
        expect(injectedScripts()).toHaveLength(0)
    })
})

describe("initFincode: スクリプトの注入", () => {
    it("isLiveMode が false ならテスト環境のスクリプトを head に足す", () => {
        initFincode({ publicKey: PUBLIC_KEY, isLiveMode: false })

        const scripts = injectedScripts()
        expect(scripts).toHaveLength(1)
        expect(scripts[0].src).toBe(V1_URL_TEST)
        expect(scripts[0].parentElement).toBe(document.head)
    })

    it("isLiveMode を省略した場合もテスト環境のスクリプトを足す", () => {
        initFincode({ publicKey: PUBLIC_KEY })

        expect(injectedScripts()[0].src).toBe(V1_URL_TEST)
    })

    it("isLiveMode が true なら本番環境のスクリプトを足す", () => {
        initFincode({ publicKey: PUBLIC_KEY, isLiveMode: true })

        expect(injectedScripts()[0].src).toBe(V1_URL_PROD)
    })

    it("既に同じスクリプトが置かれている場合は二重に注入しない", () => {
        const existing = document.createElement("script")
        existing.src = V1_URL_TEST
        document.head.appendChild(existing)

        initFincode({ publicKey: PUBLIC_KEY })

        expect(injectedScripts()).toHaveLength(1)
        expect(injectedScripts()[0]).toBe(existing)
    })

    it("fincode.js 以外のスクリプトは流用しない", () => {
        const unrelated = document.createElement("script")
        unrelated.src = "https://example.com/analytics.js"
        document.head.appendChild(unrelated)

        initFincode({ publicKey: PUBLIC_KEY })

        expect(injectedScripts()).toHaveLength(2)
    })
})

describe("initFincode: 読み込み結果", () => {
    it("load 後に window.Fincode があれば解決する", async () => {
        const instance = stubFincodeInstance()
        const promise = initFincode({ publicKey: PUBLIC_KEY })

        const script = injectedScripts()[0]
        window.Fincode = jest.fn().mockReturnValue(instance)
        script.dispatchEvent(new Event("load"))

        await expect(promise).resolves.toBe(instance)
    })

    it("load しても window.Fincode が無ければ棄却する", async () => {
        const promise = initFincode({ publicKey: PUBLIC_KEY })

        injectedScripts()[0].dispatchEvent(new Event("load"))

        await expect(promise).rejects.toThrow("fincode.js is not available")
    })

    it("error なら棄却する", async () => {
        const promise = initFincode({ publicKey: PUBLIC_KEY })

        injectedScripts()[0].dispatchEvent(new Event("error"))

        await expect(promise).rejects.toThrow("Cannot load fincode.js")
    })

    it("head が無い文書では body に足す", () => {
        const head = document.head
        head.remove()

        initFincode({ publicKey: PUBLIC_KEY })

        expect(injectedScripts()[0].parentElement).toBe(document.body)
        document.documentElement.insertBefore(head, document.body)
    })
})
