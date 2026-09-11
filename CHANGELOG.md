# 変更履歴

## 2.0.0

型定義をfincodeJSの実際の挙動に合わせ直し、Nodeから読み込めなかったパッケージ
構成を作り直したメジャーリリースです。移行手順は
[MIGRATION.md](./MIGRATION.md) を参照してください。

**コンパイルエラーにならない変更が1つあります。** `window.Fincode` の型拡張が
利用側に届くようになるため、同じ拡張を自前で宣言している場合は宣言が衝突します。

### 修正

パッケージがNodeから読み込めませんでした。`require` でも `import` でも
`ERR_UNSUPPORTED_DIR_IMPORT` になり、バンドラ経由でのみ動く状態でした。
CommonJSとES Moduleの両方を出力し、`exports` マップを付けました。ブラウザSDKの
ため大半の利用者は影響を受けませんが、Next.js のサーバーサイドレンダリング、
Jest、ts-node、素のES Moduleでは落ちていました。

`window.Fincode` の型拡張が利用側に届いていませんでした。`declare global` を
書いたファイルが型の入口から参照されておらず、`window.Fincode` を読むと
`Property 'Fincode' does not exist on type 'Window'` になっていました。
あわせて省略可能にしました。fincodeJSが読み込まれるまでは `undefined` なので、
必須で宣言するのは誤りでした。

読み込み済みの `fincode.js` を検出できていませんでした。`window.Fincode` が
未定義の状態で `initFincode` を呼ぶと、ページに既に `fincode.js` の
`script` タグがあっても検出できず、2つ目を注入していました。

送信・返却されるキー名が誤っていた項目を直しました。いずれも値がAPIに届かない、
あるいは常に `undefined` になっていました。

- カードトークン発行のレスポンスの `expore`（正しくは `expire`）。トークンの
  有効期限が読めませんでした
- エラーの `error_messaage`（正しくは `error_message`）。`executePayment` が
  通信失敗時に組み立てるエラーも同じ綴りでした
- 決済オブジェクトの `cpde_expiry_date`（正しくは `code_expiry_date`）と
  `payment_result_code`（正しくは `paypay_result_code`）

`PayType` の `"PayPay"` を `"Paypay"` にしました。APIが受け付ける値が書けず、
APIが弾く値が書ける状態でした。

`getFormData` の返却型を入力フォームの実装に合わせました。有効期限の年と月は
`year` / `month` で返ります。従来宣言していた `expireYear` / `expireMonth` は
プレースホルダー指定のキー名で、取り違えていました。年と月が常に `undefined`
になっていました。あわせて `payTimes` を任意にしました。支払方法がリボ払いの
ときは返りません。

`Appearance` の `labelCVC` を `labelCvc` にしました。入力フォームが読むのは
`labelCvc` で、旧名を渡しても効きませんでした。

`create` と `mount` の引数をfincodeJSに合わせました。どちらも `callBack` と
`errorCallBack` を受け取ります。ただしfincodeJSは宣言しているだけで呼んで
いないため、任意引数にしています。`mount` の `width` は省略できます。

`layout` のJSDocを直しました。`horizontal` の説明が「縦に並ぶ」、`vertical` の
説明が「横に広がる」と入れ違っていました。

READMEのサンプルコードを直しました。`ui.create("payment", ...)` は入力フォームが
認識しない値で、正しくは `"payments"` です。`const const onSubmit` は構文エラー
でした。`getCardToken(fincode, ui, "4")` は実際のシグネチャと合っておらず、
引数はオブジェクト1つです。

### 追加

決済手段を登録する `registerPaymentMethod` を追加しました。`payType` によって
必要な情報と戻り値の型が変わります。

| `payType`        | 必要な情報                     | 戻り値の型                          |
| :--              | :--                            | :--                                 |
| `Card`           | マウント済みのUIコンポーネント | `CardPaymentMethodObject`           |
| `Directdebit`    | 口座情報（引数で渡す）         | `DirectDebitPaymentMethodObject`    |
| `Virtualaccount` | なし                           | `VirtualAccountPaymentMethodObject` |

これまで登録時の3Dセキュア認証を行う手段がありませんでした。`registerCard` が
呼ぶ `fincode.cards()` はカードAPIで、`tds_type` を受け取りません。

fincodeJSは決済手段API用の関数を持たないため、この関数はfincodeインスタンスが持つ
パブリックキーとヘッダーを使って自身でリクエストを送ります。送り方はfincodeJSに
揃えてあり、`setTenantShopId` と `setIdempotentKey` で設定した値は反映されます。

決済手段の型も追加しました。`PaymentMethodObject` は `pay_type` で判別する共用体
です。

`getCardsList` を追加しました。顧客が登録したカードの一覧を取得します。
`ui.destroy` も追加しました。マウントしたフォームを取り除きます。どちらも
fincodeJSは公開しているのに型がありませんでした。

`FincodeInstance` に `config` を追加しました。fincodeJSが返すオブジェクトは
APIのホストとヘッダー、パブリックキーを持っていますが、型にありませんでした。

`Appearance` に7項目を追加しました。これで入力フォームが受け取る31項目のうち
30項目を指定できます。

| 項目                   | 指定するもの                   |
| :--                    | :--                            |
| `theme`                | `fincode` または `dark` の配色 |
| `cardId`               | フォームで選択するカードのID   |
| `holderName`           | カード名義人のプレースホルダー |
| `colorBackgroundRadio` | ラジオボタンの背景色           |
| `colorRadio`           | ラジオボタンの色               |
| `colorRadioText`       | ラジオボタンのラベルの文字色   |
| `colorSelect`          | セレクトボックスの文字色       |

`CardObject` に洗替の3項目を追加しました。これで実APIの返却項目と過不足なく
一致します。

- `card_updater_mode`
- `card_updater_last_success_date`
- `card_updater_last_attempt_date`

`PaymentObject` に4項目を追加しました。

- `bill_id`
- `settlement_route`
- `use_exact_deposit_amount`
- `use_static_virtual_account`

enum に不足していた値を追加しました。

| 型                              | 追加した値                                                                       |
| :--                             | :--                                                                              |
| `PaymentStatus`                 | `AWAITING_CUSTOMER_PAYMENT` / `AWAITING_PAYMENT_APPROVAL` / `EXPIRED` / `FAILED` |
| `PayType`                       | `Googlepay`                                                                      |
| `KonbiniCode`                   | `00030`                                                                          |
| `DirectDebitResultCode`         | `"7"` / `"8"`                                                                    |
| 支払方法（`method`）            | `"5"`                                                                            |
| `tds2_three_ds_req_auth_method` | `"06"`                                                                           |

支払方法の `"5"` と `tds2_three_ds_req_auth_method` の `"06"` は、JSDocが説明して
いるのに値域に無い状態でした。

型を3つ追加しました。

- `CardUpdaterMode`
- `DirectDebitSettlementRoute`
- `RetrievingCardListResponse`

### 変更

カード登録・更新のリクエスト型をブラウザの実態に合わせました。
`RegisteringCardRequest` と `UpdatingCardRequest` はどこからも参照されておらず、
中身もサーバーサイドAPI用の型で `token` を必須にしていました。ブラウザの
`cards()` が実際に受け取るのはカード番号と有効期限です。`cards()` はカードIDの
有無で登録と更新に分岐するため、2つの型の共用体を引数にしました。

`getFormData` の戻り値の型名を `FincodeUIFormData` にしました。`FormData` は
DOM標準の型と衝突します。旧名は別名として残し `@deprecated` を付けています。

`FincodeSDKError` が原因を捨てていたので `cause` を持たせました。リクエストが
応答前に失敗した場合、CORSや名前解決といった理由が分からなくなっていました。

### テスト

テストが1件もありませんでした。83件追加しました。いずれも認証情報なしで動きます。
公開している関数5つと、`FincodeInstance` と `FincodeUI` の全メンバーを網羅しています。

読み込み処理について確かめることは次のとおりです。

- 引数の検証
- 読み込み済みの場合の即時解決
- テスト環境と本番環境の出し分け
- `load` と `error` の扱い
- `window` や `head` が無い環境での挙動
- 読み込み済みのスクリプトを二重に注入しないこと

ユーティリティ関数は、fincodeインスタンスとUIコンポーネントをスタブにして
確かめます。

## 1.1.0 以前

このリポジトリのコミット履歴を参照してください。
