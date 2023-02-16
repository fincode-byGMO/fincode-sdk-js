import { Fincode } from "./js/fincode";

declare global {
    interface Window {
        Fincode: Fincode
    }
}