# fincode for ESModules: JavaScript SDK library for fincode byGMO

fincode for ESModulesはJavaScript/TypeScriptプロジェクトにおけるfincodeJSの呼び出しを支援するラッパーライブラリです。 fincodeJSのロードを簡略化し、ヘルパー関数とTypeScriptの型定義を提供します。

このライブラリはクライアントサイドJavaScriptプロジェクトでの利用を想定しています。 Node.js環境下でfincodeを利用する場合は[fincode for Node.JS]()を利用できます。

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
    ui.create("payment", { layout: "vertical" })
    ui.mount("#fincode", "400")

    // get card token
    const const onSubmit = async (e) => {
        e.preventDefault()

        const response = await getCardToken(fincode, ui)
        const token = res.list[0].token

        // Process something with token.
    }
}
```

## Utility Functions

fincode js SDKは本来のfincode JSのラッパーとしての機能に加え、さらに便利に利用できるユーティリティ関数を提供します。

### `executePayment`
UIコンポーネントに入力されているカード情報をもとに決済実行JS（`payments()`）を呼び出します。
Promiseを返し、解決時には決済オブジェクト（`PaymentObject`）を返します。

```ts
import { executePayment } from "@fincode/js"

(async () => {
    const payment = await executePayment(
        fincode, // fincode instance (FincodeInstance)
        id, // order id of payment (string)
        payType, // payment type (only "Card" is supported now)
        accessId, // access id of payment (string)
        
        ui, // fincode UI instance (FincodeUI). : you can use the data input in the fincode ui component directly.
        // or you can call by custom data
        args: { 
            customerId, // customer id (string)
            cardId, // card id (string)
            method, // pay method ("1" | "2")
        }
    )
})()

```

### `getCardToken`
UIコンポーネントに入力されているカード情報をもとにカードトークンを取得します。
Promiseを返し、解決時にはトークン情報を含むデータを返します。

```ts
import { getCardToken } from "@fincode/js"

(async () => {
    const res = await getCardToken(
        fincode, // fincode instance (FincodeInstance)
        ui, // fincode UI instance (FincodeUI). : you can use the data input in the fincode ui component directly.
        "4" // how many tokens you want to get (string)
    )
    const tokens = res.list // there are 4 tokens in the list.
})()
```

### `registerCard`
UIコンポーネントに入力されているカード情報をもとにカードを登録します。
Promiseを返し、解決時には登録されたカードオブジェクト（`CardObject`）を返します。

```ts
import { registerCard } from "@fincode/js"

(async () => {
    const card = await registerCard(
        fincode, // fincode instance (FincodeInstance)
        ui, // fincode UI instance (FincodeUI). : you can use the data input in the fincode ui component directly.
        customerId // customer id to register the card (string)
        useDefault // use the card as default card (boolean)
    )
})()
```

### `updateCard`
UIコンポーネントに入力されているカード情報をもとにカード情報を更新します。
Promiseを返し、解決時には更新されたカードオブジェクト（`CardObject`）を返します。

```ts
import { updateCard } from "@fincode/js"

(async () => {
    const card = await updateCard(
        fincode, // fincode instance (FincodeInstance)
        ui, // fincode UI instance (FincodeUI). : you can use the data input in the fincode ui component directly.
        id, // card id to update (string)
        cardId // card id to update (string)
        useDefault // use the card as default card (boolean)
    )
})()
```