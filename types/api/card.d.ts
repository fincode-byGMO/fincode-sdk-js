export namespace Card {
    /**
     * Card object
     */
    export type CardObject = {}    

    /**
     * Card brands user can use in fincode.
     * 
     * - `VISA`: Visa card.
     * - `MASTER`: MasterCard card.
     * - `JCB`: JCB card.
     * - `AMEX`: American Express card.
     * - `Diners`: DinersClub card.
     */
    export type Brand = "VISA" | "MASTER" | "JCB" | "AMEX" | "DINERS"
}