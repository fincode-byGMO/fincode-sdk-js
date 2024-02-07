import { FincodeInstance } from "./js/fincode"

const V1_URL_TEST = "https://js.test.fincode.jp/v1/fincode.js"
const V1_URL_PROD = "https://js.fincode.jp/v1/fincode.js"
const V1_URL_REGEXP = /^https:\/\/js\.(test\.)*fincode\.jp\/v1\/fincode\.js$/

export type FincodeEnv = "test" | "live"

export type FincodeLoaderFn = (initArgs: {
    publicKey: string,
    isLiveMode?: boolean,
}) => Promise<FincodeInstance>

const findFincodeScript = (): HTMLScriptElement | null => {
    if (typeof document === "undefined") return null

    const scripts = document.querySelectorAll<HTMLScriptElement>(`script[src^="${V1_URL_REGEXP}"`)

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i]

        if (!V1_URL_REGEXP.test(script.src)) continue

        return script
    }

    return null
}

const injectFincodeScript = (
    isProduction: boolean,
): HTMLScriptElement => {
    if (typeof document === "undefined") {
        throw new Error("document is undefined")
    }


    const script = document.createElement("script")
    script.src = isProduction ? V1_URL_PROD : V1_URL_TEST

    const injectTarget = document.head || document.body

    if (!injectTarget) {
        throw new Error("Either head or body must be present")
    }

    injectTarget.appendChild(script)

    return script
}


/**
 * initialize fincode.js and return fincode instance
 * 
 * @param initArgs - initialization arguments
 * @param initArgs.publicKey - public API key for fincode.js
 * @param initArgs.isLiveMode - whether to use live environment. If true, it will use live environment. Otherwise, it will use test environment.
 */
export const initFincode: FincodeLoaderFn = (initArgs) => {
    if (!initArgs.publicKey) {
        throw new Error("publicKey is required")
    }

    if (typeof initArgs.isLiveMode === "boolean") {
        throw new Error("isLiveMode must be a boolean")
    }

    const fincodePromise = new Promise<FincodeInstance>((resolve, reject) => {
        if (typeof window === "undefined") {
            reject(new Error("window is undefined"))
            return
        }

        const initializer = window.Fincode

        if (initializer) {
            resolve(initializer(initArgs.publicKey))
            return
        }

        try {
            let script = findFincodeScript()
            if (!script) {
                script = injectFincodeScript(initArgs.isLiveMode || false)
            }

            script.addEventListener("load", (evt) => {
                if (window.Fincode) {
                    resolve(window.Fincode(initArgs.publicKey))
                } else {
                    reject(new Error("fincode.js is not available"))
                }
            })

            script.addEventListener("error", (evt) => {
                reject(new Error("Cannot load fincode.js"))
            })
        } catch (e) {
            reject(e)
        }
    })

    return fincodePromise
}