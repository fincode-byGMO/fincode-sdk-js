# v1 から v2 への移行

v2.0.0 では、型定義をfincodeJSの実際の挙動に合わせ直し、あわせてパッケージの
構成を作り直しました。

移行にあたっては、まず `tsc` を通してください。誤った名前や型はコンパイル
エラーになります。ただし **コンパイルエラーにならない変更が1つ** あるので、
そちらは先に確認してください。

---

## 1. コンパイルエラーにならない変更

### window.Fincode の型拡張

`window.Fincode` の型拡張が利用側に届くようになりました。

v1 では `declare global` を書いたファイルが型の入口から参照されておらず、
`window.Fincode` を読むと `Property 'Fincode' does not exist on type 'Window'`
になっていました。これを避けるために利用側で同じ拡張を自前で宣言していた場合、
v2 では宣言が衝突します。

```ts
// v1 で必要だった記述。v2 では削除してください
declare global {
    interface Window {
        Fincode: (publicKey: string) => FincodeInstance
    }
}
```

残したままにすると
`Subsequent property declarations must have the same type` になります。

v2 の宣言は省略可能（`Fincode?`）です。fincodeJSが読み込まれるまでは
`undefined` なので、読む前に確認してください。`initFincode` を使う場合は
読み込みと確認をそちらが行います。

---

## 2. パッケージの構成

v1 はNodeから読み込めませんでした。`require` でも `import` でも
`ERR_UNSUPPORTED_DIR_IMPORT` になり、バンドラ経由でのみ動く状態でした。

配布物の構成が変わります。

|           | v1                      | v2                |
| :--       | :--                     | :--               |
| CommonJS  | なし                    | `dist/index.js`   |
| ES Module | `dist/index.js`         | `dist/index.mjs`  |
| 型        | `dist/types/index.d.ts` | `dist/index.d.ts` |

`import { initFincode } from "@fincode/js"` のような通常の使い方は変わりません。
`exports` マップを付けたため、`dist` 配下を直接指定していた場合は影響します。

```ts
// v2 ではエラー
import { CardObject } from "@fincode/js/dist/types/api/card"

// パッケージのルートから import してください
import { CardObject } from "@fincode/js"
```

---

## 3. 名前が変わった型とフィールド

### 型名

| v1         | v2                  |
| :--        | :--                 |
| `FormData` | `FincodeUIFormData` |

`FormData` はDOM標準の型と同名で、`@fincode/js` から import すると標準の
`FormData` を隠してしまいます。旧名は別名として残しているので、すぐに直さなくても
動きます。

### レスポンスのフィールド

APIが返すキー名と一致しておらず、常に `undefined` になっていた項目です。

| v1                                        | v2                   |
| :--                                       | :--                  |
| `expore`（カードトークン発行）            | `expire`             |
| `error_messaage`（エラー）                | `error_message`      |
| `cpde_expiry_date`（決済オブジェクト）    | `code_expiry_date`   |
| `payment_result_code`（決済オブジェクト） | `paypay_result_code` |

`expore` はトークンの有効期限です。現在時刻がこれを過ぎたらトークンを再発行する
必要があるため、読めないと再発行の判断ができませんでした。

### 入力フォームの返却フィールド

`getFormData()` が返す有効期限の年と月は `year` / `month` です。

| v1            | v2      |
| :--           | :--     |
| `expireYear`  | `year`  |
| `expireMonth` | `month` |

`expireYear` / `expireMonth` は `Appearance` 側のプレースホルダー指定のキー名で、
取り違えていました。v1 の型に従って読んでいた場合、値は常に `undefined` でした。

`payTimes` は任意になりました。支払方法がリボ払い（`method` が `5`）のときは
返りません。値を使う場合は `undefined` の確認が必要です。

### Appearance のフィールド

| v1         | v2         |
| :--        | :--        |
| `labelCVC` | `labelCvc` |

入力フォームが読むのは `labelCvc` です。v1 の名前で渡してもセキュリティコードの
ラベルは変わりませんでした。

---

## 4. 値域が変わった型

| 型                              | 変更                                                                                    |
| :--                             | :--                                                                                     |
| `PayType`                       | `"PayPay"` を `"Paypay"` に修正し、`"Googlepay"` を追加                                 |
| `PaymentStatus`                 | `AWAITING_CUSTOMER_PAYMENT` / `AWAITING_PAYMENT_APPROVAL` / `EXPIRED` / `FAILED` を追加 |
| `KonbiniCode`                   | `00030`（ファミリーマート）を追加                                                       |
| `DirectDebitResultCode`         | `"7"` と `"8"` を追加                                                                   |
| 支払方法（`method`）            | `"5"`（リボ払い）を追加                                                                 |
| `tds2_three_ds_req_auth_method` | `"06"`（FIDO認証）を追加                                                                |

`PayType` の `"PayPay"` は綴りが誤っており、APIが受け付ける値が書けず、APIが弾く
値が書ける状態でした。

```ts
// v1
payType: "PayPay"   // → "Paypay" に変える
```

これらの型で網羅的に分岐していた場合は、分岐の追加が必要です。

---

## 5. カード登録・更新のリクエスト型

`RegisteringCardRequest` と `UpdatingCardRequest` の項目が入れ替わりました。

v1 の定義はサーバーサイドAPI用のもので、カードトークン（`token`）を必須にして
いました。ブラウザの `cards()` が受け取るのはカード番号と有効期限です。v1 では
この2つの型がどこからも参照されておらず、`cards()` の引数は無名の型でした。

```ts
// v2
// 登録（card_id を渡さない）
fincode.cards({
    customer_id: "c_...",
    default_flag: "1",
    card_no: "4111111111111111",
    expire: "3012",
}, onSuccess, onError)

// 更新（card_id を渡す）
fincode.cards({
    customer_id: "c_...",
    card_id: "cs_...",
    expire: "3112",
}, onSuccess, onError)
```

必須・任意はAPIの挙動に合わせました。

- 登録では `default_flag` が必須です。省略すると
  `E0006019001`「デフォルトフラグが指定されていません。」になります
- 更新では `default_flag` に `"1"` しか渡せません。`"0"` を送ると
  `E0008019008`「デフォルトフラグの書式が正しくありません。」になります。
  既定のカードを移すには、移したいカードのフラグをオンにしてください

---

## 6. 引数が変わった関数

`create` と `mount` は `callBack` と `errorCallBack` を受け取ります。ただし
fincodeJSは宣言しているだけで呼んでいないため、渡しても実行されません。

`mount` の `width` は省略できるようになりました。既定値は `"500"` です。
`250` 以下は `"250"`、`768` 以上は `"768"` に丸められます。

```ts
// v1 では width が必須だった
ui.mount("fincode", "400")

// v2 では省略できる
ui.mount("fincode")
```

---

## 7. 追加された関数

v1 に型が無かったものです。fincodeJSは以前から公開していました。

| 呼び出し方                                                  | 説明                                   |
| :--                                                         | :--                                    |
| `fincode.getCardsList(customerId, callback, errorCallback)` | 顧客が登録したカードの一覧を取得します |
| `ui.destroy()`                                              | マウントしたフォームを取り除きます     |

`getCardsList` の応答は `list` だけを持ち、ページネーション項目はありません。

`FincodeInstance` や `FincodeUI` を自前で実装している場合（テストのスタブなど）は、
この2つを足す必要があります。

---

## 8. Appearance に追加されたフィールド

| フィールド             | 説明                           |
| :--                    | :--                            |
| `theme`                | `fincode` または `dark` の配色 |
| `cardId`               | フォームで選択するカードのID   |
| `holderName`           | カード名義人のプレースホルダー |
| `colorBackgroundRadio` | ラジオボタンの背景色           |
| `colorRadio`           | ラジオボタンの色               |
| `colorRadioText`       | ラジオボタンのラベルの文字色   |
| `colorSelect`          | セレクトボックスの文字色       |

色の指定は `#` を付けない16進6桁です。`theme` は個別の色指定より後に適用される
ため、両方を渡した場合は `theme` が優先されます。

---

## 9. 挙動が変わったところ

### fincode.js の二重読み込み

v1 は、ページに既に `fincode.js` の `script` タグがあっても検出できず、
`window.Fincode` が未定義のときは2つ目を注入していました。

v2 は既存のタグを見つけて流用します。`script` タグを自分で置いたうえで
`initFincode` を呼んでいた場合、読み込みが1回になります。
