export interface FincodeUI {

    /**
     * create fincode UI component for iframe embedding.
     *
     * `method` decides what the mounted form is used for. It also wins over
     * `appearance.method`, so set it here.
     *
     * `callBack` and `errorCallBack` are accepted but never called by
     * fincode.js.
     */
    create: (
        method: "payments" | "cards" | "token",
        appearance: Appearance,
        callBack?: () => void,
        errorCallBack?: () => void,
    ) => void

    /**
     * mount fincode ui.
     *
     * before calling this, call `UI.create(method, appearance)` method.
     *
     * The element with `elementId`, and one with `${elementId}-form`, must
     * both be present in the document.
     *
     * `width` defaults to `"500"`. Values below `250` are raised to `"250"`
     * and values from `768` up are lowered to `"768"`.
     *
     * `callBack` and `errorCallBack` are accepted but never called by
     * fincode.js.
     */
    mount: (
        elementId: string,
        width?: string,
        callBack?: () => void,
        errorCallBack?: () => void,
    ) => void

    /**
     * get form data from UI component.
     *
     * Reads the values out of the mounted iframe. fincode.js waits a fixed
     * 30ms for the iframe to answer, so calling this immediately after
     * `mount` can return an empty object.
     */
    getFormData: () => Promise<FincodeUIFormData>

    /**
     * remove the mounted form.
     *
     * Empties the element the form was mounted into. Throws if `mount` has
     * not been called.
     *
     * `callBack` and `errorCallBack` are accepted but never called by
     * fincode.js.
     */
    destroy: (
        callBack?: () => void,
        errorCallBack?: () => void,
    ) => void

}
/**
 * Customisation of the mounted card input form.
 *
 * Every `color*` value is a 6-digit hex code **without** a leading `#`, for
 * example `"1f1f1f"`. Setting `theme` overwrites the colours it covers, so
 * pass colours individually or pass a theme, not both.
 */
export type Appearance = {
    /**
     * Declare UI Layout
     *
     * - `horizontal`: use the horizontal form.
     * - `vertical`: use the vertical form.
     *
     * default `vertical`
     */
    layout?: "horizontal" | "vertical"

    /**
     * Preset colour scheme.
     *
     * - `fincode`: the fincode colours.
     * - `dark`: a dark scheme.
     *
     * Applied after the individual colour settings, so it overwrites
     * `colorBackground`, `colorBackgroundInput`, `colorPlaceHolder`,
     * `colorBackgroundRadio`, `colorLabelText`, `colorRadioText`,
     * `colorText`, `colorBorder`, `colorError` and `colorCheck`.
     */
    theme?: "fincode" | "dark"

    /**
     * Customer ID
     */
    customerId?: string | null

    /**
     * ID of the card to select in the form.
     *
     * Use together with `customerId` to preselect one of the customer's
     * saved cards.
     */
    cardId?: string | null

    /**
     * Hiding label text.
     * 
     * - `false`: Show label text.
     * - `true`: Hide label text.
     * 
     * default `false`
     */
    hideLabel?: boolean

    /**
     * Hiding card holder name.
     * 
     * - `false`: Show card holder.
     * - `true`: Hide label text.
     * 
     * default `false`
     */
    hideHolderName?: boolean

    /** 
     * Hide payment times.
     * 
     * - `false`: Show radio buttons they allow customer to select payment times.
     * - `true`: Hide radio buttons.
     * 
     * default `false`
    */
    hidePayTimes?: boolean

    /**
     * Change label text of card number field.
     */
    labelCardNo?: string

    /**
     * Change label text of card expires month field.
     */
    labelExpire?: string

    /**
     * Change label text of CVC field.
     */
    labelCvc?: string

    /**
     * Change label text of card holder name field.
     */
    labelHolderName?: string

    /**
     * Change label text of payment method field.
     *
     * default `お支払方法`
     */
    labelPaymentMethod?: string

    /**
     * Change placeholder text of card number field.
     */
    cardNo?: string

    /**
     * Change placeholder text of card expiring year field.
     */
    expireYear?: string

    /**
     * Change placeholder text of card expiring month field.
     */
    expireMonth?: string

    /**
     * Change placeholder text of CVC field.
     *
     * default `001`
     */
    cvc?: string

    /**
     * Change placeholder text of card holder name field.
     *
     * default `TARO YAMADA`
     */
    holderName?: string

    /**
     * Change background color of this ui component.
     */
    colorBackground?: string

    /**
     * Change background input text color of this ui component.
     */
    colorBackgroundInput?: string

    /**
     * Change text color of this ui component.
     */
    colorText?: string


    /**
     * Change placeholder text color of this ui component.
     */
    colorPlaceHolder?: string


    /**
     * Change label text color of this ui component.
     */
    colorLabelText?: string


    /**
     * Change input border color of this ui component.
     */
    colorBorder?: string


    /**
     * Change error message text color of this ui component.
     */
    colorError?: string


    /**
     * Change check text color of this ui component.
     */
    colorCheck?: string

    /**
     * Change background color of the radio buttons of this ui component.
     */
    colorBackgroundRadio?: string

    /**
     * Change color of the radio buttons of this ui component.
     */
    colorRadio?: string

    /**
     * Change text color of the radio button labels of this ui component.
     */
    colorRadioText?: string

    /**
     * Change text color of the select boxes of this ui component.
     */
    colorSelect?: string

    /**
     * Change font family of this ui component.
     *
     * default `Noto Sans JP, sans-serif`
     */
    fontFamily?: string
}

/**
 * Values read out of the mounted card input form.
 *
 * Which fields are present depends on what the customer chose in the form.
 *
 * - Selecting a saved card returns `customerId` and `cardId`.
 * - Entering a new card returns `cardNo`, `CVC`, `expire`, `year`, `month`
 *   and `holderName`.
 *
 * `method` is always present. `payTimes` is present for lump-sum and
 * installment payments, but not for revolving ones.
 */
export type FincodeUIFormData = {

    /**
     * Customer ID.
     *
     * Present only when the customer selected a saved card.
     */
    customerId?: string

    /**
     * Card ID.
     *
     * Present only when the customer selected a saved card.
     */
    cardId?: string

    /**
     * Card number, with any non-digit characters removed.
     *
     * Present only when the customer entered a new card.
     */
    cardNo?: string

    /**
     * CVC.
     *
     * Present only when the customer entered a new card.
     */
    CVC?: string

    /**
     * Year and month the card expires.
     *
     * Format: `yyMM`
     *
     * Present only when the customer entered a new card.
     */
    expire?: string

    /**
     * Year the card expires.
     *
     * Format: `yy`
     *
     * Present only when the customer entered a new card.
     */
    year?: string

    /**
     * Month the card expires.
     *
     * Format: `MM`
     *
     * Present only when the customer entered a new card.
     */
    month?: string

    /**
     * Card holder name.
     *
     * Present only when the customer entered a new card.
     */
    holderName?: string

    /**
     * Number of installment payments.
     *
     * `"1"` for a lump-sum payment, the number the customer chose for an
     * installment payment. Not present for a revolving payment.
     */
    payTimes?: string

    /**
     * Payment method.
     *
     * - `1`: lump-sum
     * - `2`: installments
     * - `5`: revolving
     */
    method: "1" | "2" | "5"
}

/**
 * @deprecated Renamed to `FincodeUIFormData` because `FormData` shadows the
 * built-in DOM type of the same name.
 */
export type FormData = FincodeUIFormData