export interface FincodeUI {

    /**
     * 
     * create fincode UI component for iframe embedding.
     */
    create: (
        method: "payments" | "cards" | "token",
        appearance: Appearance
    ) => void

    /**
     * 
     * mount fincode ui.
     * 
     * before calling this, call `UI.create(method, appearance)` method.
     */
    mount: (
        elementId: string,
        width: string,
    ) => void

    /**
     * 
     * get form data from UI component.
     * 
     */
    getFormData: () => Promise<FincodeUIFormData>

}
export type Appearance = {
    /**
     * Declare UI Layout
     * 
     * - `horizontal`: The elements that make up the form are aligned vertically, and the mounted form will be vertical.
     * - `vertical`: The elements that make up the form will spread horizontally, and the mounted form will be horizontal.
     * 
     * default `vertical`
     */
    layout?: "horizontal" | "vertical"

    /**
     * Customer ID
     */
    customerId?: string | null

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
    labelCVC?: string

    /**
     * Change label text of card holder name field.
     */
    labelHolderName?: string

    /**
     * Change label text of payment method field.
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
     */
    cvc?: string

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
     * Change font family of this ui component.
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