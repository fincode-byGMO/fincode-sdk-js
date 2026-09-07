import { RegisteringCardRequest, UpdatingCardRequest } from "./card"
import { FincodeInstance } from "../js"

type CardsArg = Parameters<FincodeInstance["cards"]>[0]

/**
 * cards() が受け取る形の取り決めを型で固定する。
 *
 * fincode.js は card_id というキーの有無だけで登録（POST）と更新（PUT）を
 * 分岐させる。必須・任意の別は実APIで確かめた。
 */
describe("RegisteringCardRequest", () => {
    it("顧客ID・デフォルトフラグ・カード番号・有効期限が揃っていれば受け付ける", () => {
        const card: RegisteringCardRequest = {
            customer_id: "c_0000000000",
            default_flag: "1",
            card_no: "4111111111111111",
            expire: "3012",
        }
        const asArg: CardsArg = card

        expect(asArg.customer_id).toBe("c_0000000000")
    })

    it("デフォルトフラグは省略できない", () => {
        // 省略すると実APIが E0006019001 で拒否する
        // @ts-expect-error default_flag が無い
        const card: RegisteringCardRequest = {
            customer_id: "c_0000000000",
            card_no: "4111111111111111",
            expire: "3012",
        }

        expect(card).toBeDefined()
    })

    it("カード番号と有効期限は省略できない", () => {
        // @ts-expect-error card_no と expire が無い
        const card: RegisteringCardRequest = {
            customer_id: "c_0000000000",
            default_flag: "0",
        }

        expect(card).toBeDefined()
    })

    it("トークンは受け取らない", () => {
        const card: RegisteringCardRequest = {
            customer_id: "c_0000000000",
            default_flag: "0",
            card_no: "4111111111111111",
            expire: "3012",
            // @ts-expect-error ブラウザからはカード情報を直接送る。token はサーバー側APIの項目
            token: "t_0000000000",
        }

        expect(card).toBeDefined()
    })
})

describe("UpdatingCardRequest", () => {
    it("顧客IDとカードIDが揃っていれば受け付ける", () => {
        const card: UpdatingCardRequest = {
            customer_id: "c_0000000000",
            card_id: "cs_0000000000",
            expire: "3112",
        }
        const asArg: CardsArg = card

        expect(asArg.customer_id).toBe("c_0000000000")
    })

    it("カードIDは省略できない", () => {
        // @ts-expect-error card_id が無いと登録扱いになる
        const card: UpdatingCardRequest = {
            customer_id: "c_0000000000",
            expire: "3112",
        }

        expect(card).toBeDefined()
    })

    it("デフォルトフラグをオフにはできない", () => {
        // "0" を送ると実APIが E0008019008 で拒否する
        const card: UpdatingCardRequest = {
            customer_id: "c_0000000000",
            card_id: "cs_0000000000",
            // @ts-expect-error 更新では "0" を送れない
            default_flag: "0",
        }

        expect(card).toBeDefined()
    })

    it("デフォルトフラグをオンにはできる", () => {
        const card: UpdatingCardRequest = {
            customer_id: "c_0000000000",
            card_id: "cs_0000000000",
            default_flag: "1",
        }

        expect(card.default_flag).toBe("1")
    })
})

describe("cards() の引数", () => {
    it("登録も更新も渡せる", () => {
        const registering: CardsArg = {
            customer_id: "c_0000000000",
            default_flag: "1",
            card_no: "4111111111111111",
            expire: "3012",
        }
        const updating: CardsArg = {
            customer_id: "c_0000000000",
            card_id: "cs_0000000000",
            expire: "3112",
        }

        expect(registering).toBeDefined()
        expect(updating).toBeDefined()
    })

    it("顧客IDだけでは渡せない", () => {
        // @ts-expect-error 登録にも更新にもならない
        const neither: CardsArg = { customer_id: "c_0000000000" }

        expect(neither).toBeDefined()
    })
})
