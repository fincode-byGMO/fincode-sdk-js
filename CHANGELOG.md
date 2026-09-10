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

`getCardsList` を追加しました。顧客が登録したカードの一覧を取得します。
`ui.destroy` も追加しました。マウントしたフォームを取り除きます。どちらも
fincodeJSは公開しているのに型がありませんでした。

`Appearance` に7項目を追加しました。`theme`、`cardId`、`holderName`、
`colorBackgroundRadio`、`colorRadio`、`colorRadioText`、`colorSelect` です。
これで入力フォームが受け取る31項目のうち30項目を指定できます。

`CardObject` に洗替の3項目（`card_updater_mode`、
`card_updater_last_success_date`、`card_updater_last_attempt_date`）を
追加しました。これで実APIの返却項目と過不足なく一致します。

`PaymentObject` に `bill_id`、`settlement_route`、`use_exact_deposit_amount`、
`use_static_virtual_account` の4項目を追加しました。

enum に不足していた値を追加しました。`PaymentStatus` の
`AWAITING_CUSTOMER_PAYMENT` / `AWAITING_PAYMENT_APPROVAL` / `EXPIRED` /
`FAILED`、`PayType` の `Googlepay`、`KonbiniCode` の `00030`、
`DirectDebitResultCode` の `"7"` と `"8"`、支払方法の `"5"`、
`tds2_three_ds_req_auth_method` の `"06"` です。後ろ2つはJSDocが説明している
のに値域に無い状態でした。

`CardUpdaterMode` と `DirectDebitSettlementRoute` と
`RetrievingCardListResponse` を追加しました。

### 変更

カード登録・更新のリクエスト型をブラウザの実態に合わせました。
`RegisteringCardRequest` と `UpdatingCardRequest` はどこからも参照されておらず、
中身もサーバーサイドAPI用の型で `token` を必須にしていました。ブラウザの
`cards()` が実際に受け取るのはカード番号と有効期限です。`cards()` はカードIDの
有無で登録と更新に分岐するため、2つの型の共用体を引数にしました。

`getFormData` の戻り値の型名を `FincodeUIFormData` にしました。`FormData` は
DOM標準の型と衝突します。旧名は別名として残し `@deprecated` を付けています。

### テスト

テストが1件もありませんでした。58件追加しました。

読み込み処理は、引数の検証、読み込み済みの場合の即時解決、テスト環境と本番環境の
出し分け、`load` と `error` の扱い、`window` や `head` が無い環境での挙動、
二重注入をしないことを確かめます。ユーティリティ関数はfincodeインスタンスと
UIコンポーネントをスタブにして確かめます。いずれも認証情報なしで動きます。

## 1.1.0 以前

このリポジトリのコミット履歴を参照してください。
