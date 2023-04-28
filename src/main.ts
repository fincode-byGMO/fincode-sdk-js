import { FincodeInitializer, FincodeInstance } from "./js/fincode"

const V1_URL_TEST = "https://js.test.fincode.jp/v1/fincode.js"
const V1_URL_PROD = "https://js.fincode.jp/v1/fincode.js"
const V1_URL_REGEXP = /^https:\/\/js\.(test\.)*fincode\.jp\/v1\/fincode\.js$/

export type FincodeConfig = {}

export type FincodeLoaderFn = (publicKey: string, isProduction?: boolean, config?: FincodeConfig) => Promise<FincodeInstance>

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

const injectFincodeScript = (isProduction?: boolean, config?: FincodeConfig): HTMLScriptElement => {
    if (typeof document === "undefined") {
        throw new Error("document is undefined")
    }

    const queryParam = buildQueryParam(config)

    const script = document.createElement("script")
    const param = queryParam ? `?${queryParam}` : ""
    script.src = isProduction ? `${V1_URL_PROD}${param}` : `${V1_URL_TEST}${param}`

    const injectTarget = document.head || document.body

    if (!injectTarget) {
        throw new Error("Either head or body must be present")
    }

    injectTarget.appendChild(script)

    return script
}

const buildQueryParam = (config?: FincodeConfig): string => {
    const params = new URLSearchParams()

    return params.toString()
}

const ALREADY_SCRIPT_LOADED_MESSAGE = "fincode.js is already loaded. Config will be ignored."

/**
 * initialize fincode.js and return fincode instance
 * 
 * @param publicKey 
 * @param isProduction 
 * @param config 
 * @returns {Promise<FincodeInstance>}
 */
export const initFincode: FincodeLoaderFn = (publicKey, isProduction, config) => {
    const fincodePromise = new Promise<FincodeInstance>((resolve, reject) => {
        if (typeof window === "undefined") {
            reject(new Error("window is undefined"))
            return
        }

        const initializer = window.Fincode

        if (initializer) {
            if (config) {
                console.warn(ALREADY_SCRIPT_LOADED_MESSAGE)
            }

            resolve(initializer(publicKey))
            return
        }

        try {
            let script = findFincodeScript()
            if (script) {
                if (config) {
                    console.warn("fincode.js is already loaded. Config will be ignored.")
                }
            } else {
                script = injectFincodeScript(isProduction, config,
                )
            }

            script.addEventListener("load", (evt) => {
                if (window.Fincode) {
                    resolve(window.Fincode(publicKey))
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