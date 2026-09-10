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

このライブラリはfincodeJSのラッパーとしての機能に加え、さらに便利に利用できるユーティリティ関数を提供します。

いずれもマウント済みのUIコンポーネントから入力値を読み取るため、`ui.mount` を呼んだあとに使用してください。

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

### `registerCard`
UIコンポーネントに入力されているカード情報をもとにカードを登録します。
Promiseを返し、解決時には登録されたカードオブジェクト（`CardObject`）を返します。

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
