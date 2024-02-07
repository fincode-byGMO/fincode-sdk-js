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
    ui.create("payment")
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