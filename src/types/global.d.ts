import {  FincodeInitializer } from "./js/fincode";

declare global {
    interface Window {
        Fincode: FincodeInitializer
    }
}