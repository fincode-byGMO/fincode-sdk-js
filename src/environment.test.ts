import { initFincode } from "./main"

const PUBLIC_KEY = "p_test_0000000000000000"

const injectedSrcs = () =>
    Array.from(document.querySelectorAll<HTMLScriptElement>("script")).map((s) => s.src)

beforeEach(() => {
    document.head.innerHTML = ""
    document.body.innerHTML = ""
    delete (window as { Fincode?: unknown }).Fincode
})

describe("読み込むスクリプトの決定", () => {
    it("environment で環境を選ぶ", () => {
        initFincode({ publicKey: PUBLIC_KEY, environment: "test" })
        expect(injectedSrcs()).toEqual(["https://js.test.fincode.jp/v1/fincode.js"])

        document.head.innerHTML = ""
        initFincode({ publicKey: PUBLIC_KEY, environment: "prod" })
        expect(injectedSrcs()).toEqual(["https://js.fincode.jp/v1/fincode.js"])
    })

    it("environment を省略するとテスト環境になる", () => {
        initFincode({ publicKey: PUBLIC_KEY })

        expect(injectedSrcs()).toEqual(["https://js.test.fincode.jp/v1/fincode.js"])
    })

    it("environment に想定外の値を渡すと落とす", () => {
        expect(() =>
            initFincode({ publicKey: PUBLIC_KEY, environment: "production" as never }),
        ).toThrow(/environment must be "test" or "prod"/)
    })

    describe("isLiveMode（非推奨）", () => {
        it("引き続き使える", () => {
            initFincode({ publicKey: PUBLIC_KEY, isLiveMode: true })
            expect(injectedSrcs()).toEqual(["https://js.fincode.jp/v1/fincode.js"])
        })

        it("environment と両方あれば environment が勝つ", () => {
            initFincode({ publicKey: PUBLIC_KEY, environment: "test", isLiveMode: true })

            expect(injectedSrcs()).toEqual(["https://js.test.fincode.jp/v1/fincode.js"])
        })
    })

    describe("scriptUrl", () => {
        it("指定した読み込み元をそのまま使う", () => {
            initFincode({ publicKey: PUBLIC_KEY, scriptUrl: "https://js.example.com/fincode.js" })

            expect(injectedSrcs()).toEqual(["https://js.example.com/fincode.js"])
        })

        it("environment と同時に指定すると落とす", () => {
            // 消し忘れた scriptUrl が environment の指す環境を黙って上書きするのを防ぐ
            expect(() =>
                initFincode({
                    publicKey: PUBLIC_KEY,
                    environment: "prod",
                    scriptUrl: "https://js.example.com/fincode.js",
                }),
            ).toThrow(/cannot be combined with environment or isLiveMode/)
        })

        it("isLiveMode と同時に指定しても落とす", () => {
            expect(() =>
                initFincode({
                    publicKey: PUBLIC_KEY,
                    isLiveMode: true,
                    scriptUrl: "https://js.example.com/fincode.js",
                }),
            ).toThrow(/cannot be combined with environment or isLiveMode/)
        })

        it.each([
            ["http://js.example.com/fincode.js", /must use https/],
            ["https://user:pw@js.example.com/fincode.js", /must not carry credentials/],
            ["js.example.com/fincode.js", /is not a valid URL/],
        ])("%s は落とす", (scriptUrl, message) => {
            expect(() => initFincode({ publicKey: PUBLIC_KEY, scriptUrl })).toThrow(message)
        })
    })

    describe("読み込み済みのスクリプトの流用", () => {
        it("同じURLのスクリプトがあれば流用する", () => {
            const existing = document.createElement("script")
            existing.src = "https://js.test.fincode.jp/v1/fincode.js"
            document.head.appendChild(existing)

            initFincode({ publicKey: PUBLIC_KEY, environment: "test" })

            expect(injectedSrcs()).toHaveLength(1)
        })

        it("別の環境のスクリプトは流用しない", () => {
            // テスト環境のスクリプトを本番環境の要求で使い回すと、
            // 要求した環境とは違う先へ通信することになる
            const existing = document.createElement("script")
            existing.src = "https://js.test.fincode.jp/v1/fincode.js"
            document.head.appendChild(existing)

            initFincode({ publicKey: PUBLIC_KEY, environment: "prod" })

            expect(injectedSrcs()).toEqual([
                "https://js.test.fincode.jp/v1/fincode.js",
                "https://js.fincode.jp/v1/fincode.js",
            ])
        })
    })
})
