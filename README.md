# fincode for ESModules: JavaScript SDK library for fincode byGMO

fincode for ESModulesはJavaScript/TypeScriptプロジェクトにおけるfincodeJSの呼び出しを支援するラッパーライブラリです。 fincodeJSのロードを簡略化し、ヘルパー関数とTypeScriptの型定義を提供します。

このライブラリはクライアントサイドJavaScriptプロジェクトでの利用を想定しています。 Node.js環境下でfincodeを利用する場合は[fincode for Node.JS](https://github.com/fincode-byGMO/fincode-sdk-node.git)を利用できます。

## v1 からの移行

v2.0.0 では型定義をfincodeJSの実際の挙動に合わせ直し、パッケージの構成を作り直しました。破壊的変更を含みます。
移行手順は [MIGRATION.md](./MIGRATION.md) を、変更の一覧は
[CHANGELOG.md](./CHANGELOG.md) を参照してください。

## Getting Started
プロジェクトでnpmを使っている場合、npm経由でfincode for ESModulesをインストールできます。

```bash
$ npm i @fincode/js

# yarnによるインストールの場合
$ yarn add @fincode/js
```

## Usage
### 1. fincodeの管理画面からAPIキーを取得

テスト環境および本番環境の管理画面からAPIキーを取得します。

APIキーは**パブリックキー**である必要があります。

### 2. npm/Yarnからインストール

Getting Startedの手順に従い、 `@fincode/js` をプロジェクトにインストールします。

### 3. fincodeインスタンスの作成

`initFincode` メソッドを呼び出し、 fincodeインスタンスを作成します。

```js
import { initFincode, getCardToken } from "@fincode/js"

const main = async () => {

    const fincode = await initFincode({
        publicKey: "p_****_**********", // Public key
        isLiveMode: true, // fincode Environment
    })

    // mount fincode payment UI form
    const ui = fincode.ui({ layout: "vertical" })
    ui.create("payments", { layout: "vertical" })
    ui.mount("fincode", "400")

    // get card token
    const onSubmit = async (e) => {
        e.preventDefault()

        const response = await getCardToken({ fincode, ui, number: "4" })
        const tokens = response.list // expect 4 tokens

        // Process something with token.
    }
}
```

`ui.mount` はマウント先のIDと、それに `-form` を付けたIDの要素を必要とします。

```html
<form id="fincode-form">
    <div id="fincode"></div>
    <button id="submit">お支払い</button>
</form>
```

## Call fincodeJS

fincodeインスタンスが持つメソッドは下記のようにfincodeJSの関数と対応しています。

| fincodeJS                                           | 呼び出し方                                                  | 戻り値の型                   |
| :-------------------------------------------------- | :---------------------------------------------------------- | :--------------------------- |
| `tokens(card, callback, errorCallback)`             | `fincode.tokens(card, callback, errorCallback)`             | `TokenIssuingResponse`       |
| `cards(card, callback, errorCallback)`              | `fincode.cards(card, callback, errorCallback)`              | `CardObject`                 |
| `payments(transaction, callback, errorCallback)`    | `fincode.payments(transaction, callback, errorCallback)`    | `PaymentObject`              |
| `getCardsList(customerId, callback, errorCallback)` | `fincode.getCardsList(customerId, callback, errorCallback)` | `RetrievingCardListResponse` |
| `ui(appearance)`                                    | `fincode.ui(appearance)`                                    | `FincodeUI`                  |
| `setTenantShopId(tenantShopId)`                     | `fincode.setTenantShopId(tenantShopId)`                     | -                            |
| `setIdempotentKey(idempotentKey)`                   | `fincode.setIdempotentKey(idempotentKey)`                   | -                            |

`cards` はカードIDを渡すかどうかで登録と更新が切り替わります。`card_id` を渡さない場合は登録（`RegisteringCardRequest`）、渡した場合は更新（`UpdatingCardRequest`）になります。

### UIコンポーネント

`fincode.ui(appearance)` が返すオブジェクトは下記の関数を持ちます。

| fincodeJS                    | 呼び出し方                      | 説明                                 |
| :--------------------------- | :------------------------------ | :----------------------------------- |
| `create(method, appearance)` | `ui.create(method, appearance)` | カード情報入力フォームを作成します   |
| `mount(elementId, width)`    | `ui.mount(elementId, width)`    | 指定したIDにフォームをマウントします |
| `getFormData()`              | `ui.getFormData()`              | フォームに入力された値を取得します   |
| `destroy()`                  | `ui.destroy()`                  | マウントしたフォームを取り除きます   |

`create` の第1引数は `payments`、`cards`、`token` のいずれかです。

`mount` の `width` は省略できます。既定値は `"500"` で、`250` 以下は `"250"`、`768` 以上は `"768"` に丸められます。

`getFormData` の戻り値は、顧客が登録済みカードを選んだか新しいカードを入力したかで項目が変わります。詳細は `FincodeUIFormData` の型定義を参照してください。

### 見た目のカスタマイズ

`fincode.ui(appearance)` と `ui.create(method, appearance)` に渡す `Appearance` でフォームの見た目を変更できます。

色の指定は `#` を付けない16進6桁です。

```ts
const ui = fincode.ui({
    layout: "vertical",
    colorBackground: "1f1f1f",
    labelCvc: "セキュリティコード",
})
```

`theme` に `fincode` または `dark` を指定すると、あらかじめ用意された配色を適用できます。`theme` は個別の色指定より後に適用されるため、両方を渡した場合は `theme` が優先されます。

## Utility Functions

このライブラリはfincodeJSのラッパーとしての機能に加え、ユーティリティ関数を提供します。用途は2種類です。

**fincodeJSの呼び出しを簡略化するもの** — `executePayment`、`getCardToken`、`registerCard` です。マウント済みのUIコンポーネントから入力値を読み取ってfincodeJSの関数を呼ぶため、`ui.mount` を呼んだあとに使用してください。

**fincodeJSが持たないAPIを呼ぶもの** — `registerCardPaymentMethod`、`registerDirectDebitPaymentMethod`、`registerVirtualAccountPaymentMethod` です。fincodeJSに決済手段API用の関数が無いため、fincodeインスタンスが持つパブリックキーとヘッダーを使ってこのライブラリが直接リクエストを送ります。`setTenantShopId` と `setIdempotentKey` で設定した値は反映されます。

決済手段の登録は、その決済種別で最初の1件を `useDefault: true` で登録する必要があります。指定しない場合、APIがエラーを返します。

| 決済種別 | エラーコード |
| :------------- | :------------ |
| カード | `EC013136002` |
| 口座振替 | `EF010524002` |
| バーチャル口座 | `EG009548002` |

### `executePayment`
UIコンポーネントに入力されているカード情報をもとに決済実行JS（`payments()`）を呼び出します。
Promiseを返し、解決時には決済オブジェクト（`PaymentObject`）を返します。

```ts
import { executePayment } from "@fincode/js"

(async () => {
    const payment = await executePayment({
        fincode: fincode, // fincode instance (FincodeInstance)
        ui: ui, // fincode UI instance (FincodeUI). : you can use the data input in the fincode ui component directly.

        id: "<Order ID>", // order id of payment (string)
        payType: "Card", // payment type (Card | Applepay | Googlepay | Konbini | Paypay | Directdebit | Virtualaccount)
        accessId: "<Access ID>", // access id of payment (string)
    })
})()

```

### `getCardToken`
UIコンポーネントに入力されているカード情報をもとにカードトークンを取得します。
Promiseを返し、解決時にはトークン情報を含むデータを返します。

```ts
import { getCardToken } from "@fincode/js"

(async () => {
    const res = await getCardToken({
        fincode: fincode, // fincode instance (FincodeInstance)
        ui: ui, // fincode UI instance (FincodeUI). : you can use the data input in the fincode ui component directly.
        number: "4" // how many tokens you want to get (string, default: "1")
    })
    const tokens = res.list // there are 4 tokens in this array.
})()
```

### `registerCardPaymentMethod`
UIコンポーネントに入力されているカード情報を、顧客の決済手段として登録します。
Promiseを返し、解決時には決済手段オブジェクト（`CardPaymentMethodObject`）を返します。

決済手段の登録にはカードトークンが必要なため、この関数が内部で `tokens()` を呼んでトークンを発行します。

```ts
import { registerCardPaymentMethod } from "@fincode/js"

(async () => {
    const paymentMethod = await registerCardPaymentMethod({
        fincode: fincode, // fincode instance (FincodeInstance)
        ui: ui, // fincode UI instance (FincodeUI)
        customerId: "<Customer ID>", // customer id to register the payment method (string)
        useDefault: true, // use the payment method as default or not (boolean)
    })
})()
```

`tdsType` に `"2"` を渡すと、登録時に3Dセキュア認証を行います。この場合は `returnUrl` の指定が必須です。

```ts
const paymentMethod = await registerCardPaymentMethod({
    fincode, ui,
    customerId: "<Customer ID>",
    tdsType: "2",
    returnUrl: "https://example.com/complete",
    returnUrlOnFailure: "https://example.com/failure",
})

// status は AWAITING_CUSTOMER_ACTION になり、redirect_url が返る
window.location.href = paymentMethod.redirect_url
```

お客様を `redirect_url` へ誘導して認証を完了させてください。`tdsType` を渡さない場合は認証なしで登録され、`status` は `ACTIVATED` になります。

### `registerDirectDebitPaymentMethod`
口座情報を顧客の決済手段として登録します。
Promiseを返し、解決時には決済手段オブジェクト（`DirectDebitPaymentMethodObject`）を返します。

fincodeJSに口座情報の入力フォームは無いため、口座情報は引数で渡します。

```ts
import { registerDirectDebitPaymentMethod } from "@fincode/js"

(async () => {
    const paymentMethod = await registerDirectDebitPaymentMethod({
        fincode: fincode, // fincode instance (FincodeInstance)
        customerId: "<Customer ID>",
        useDefault: true,

        applicationType: "ONLINE", // "PAPER" | "ONLINE"
        returnUrl: "https://example.com/complete", // required when applicationType is "ONLINE"
        settlementRoute: "1", // "1": 5th, 6th, 23rd, 27th / "2": 1st, 5th, 20th, 26th
        bankCode: "0001",
        branchCode: "001",
        accountType: "1", // "1": ordinary / "2": current
        accountNumber: "1234567",
        accountName: "テスト",
        accountNameKana: "ﾃｽﾄ",
    })

    // applicationType が "ONLINE" の場合、お客様を redirect_url へ誘導します
    window.location.href = paymentMethod.redirect_url
})()
```

`applicationType` に `"ONLINE"` を渡した場合、お客様が金融機関のサイトで口座振替を承認します。`returnUrl` の指定が必須で、`status` は `AWAITING_CUSTOMER_ACTION` になり `redirect_url` が返ります。

`"PAPER"` を渡した場合は依頼書での登録になり、`requestFormId` の指定が必須です。

ゆうちょ銀行（`bankCode` が `9900`）の場合は、`branchCode` と `accountNumber` の代わりに `postalAccountNumber1` と `postalAccountNumber2` を指定します。

### `registerVirtualAccountPaymentMethod`
顧客に対して発行するバーチャル口座を決済手段として登録します。
Promiseを返し、解決時には決済手段オブジェクト（`VirtualAccountPaymentMethodObject`）を返します。

口座はfincodeが払い出すため、お客様から収集する情報はありません。

```ts
import { registerVirtualAccountPaymentMethod } from "@fincode/js"

(async () => {
    const paymentMethod = await registerVirtualAccountPaymentMethod({
        fincode: fincode, // fincode instance (FincodeInstance)
        customerId: "<Customer ID>",
        useDefault: true,
    })

    // status は ACTIVATED になり、口座情報が virtualaccount に入る
    const { va_branch_name, va_account_number } = paymentMethod.virtualaccount
})()
```

### `registerCard`
UIコンポーネントに入力されているカード情報をもとにカードを登録します。
Promiseを返し、解決時には登録されたカードオブジェクト（`CardObject`）を返します。

カードAPIを呼び出します。決済手段として登録したい場合は `registerCardPaymentMethod` を使用してください。

```ts
import { registerCard } from "@fincode/js"

(async () => {
    const card = await registerCard({
        fincode: fincode, // fincode instance (FincodeInstance)
        ui: ui, // fincode UI instance (FincodeUI). : you can use the data input in the fincode ui component directly.
        customerId: "<Customer ID>", // customer id to register the card (string)
        useDefault: true, // use the card as default card (boolean)
    })
})()
```
