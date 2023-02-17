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
    getFormData: () => Promise<FormData>
    
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

export type FormData = {

    /**
     * Card ID
     */
    cardId?: string

    /**
     * Number of installment payments
     */
    payTimes: string

    /**
     * Payment method
     */
    method: "1" | "2"

    /**
     * Card number
     */
    cardNo?: string

    /**
     * CVC
     */
    CVC?: string

    /**
     * Year and month the card expires
     * 
     * format: `yyMM`
     */
    expire?: string

    /**
     * Year the card expires
     */
    expireYear?: string

    /**
     * Month the card expires
     */
    expireMonth?: string

    /**
     * Card holder name
     */
    holderName?: string
}