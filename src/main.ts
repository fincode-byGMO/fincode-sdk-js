import { FincodeSDKError } from "./_utils"
import { FincodeInstance } from "./js/fincode"

const SCRIPT_URL_BY_ENVIRONMENT = {
    test: "https://js.test.fincode.jp/v1/fincode.js",
    prod: "https://js.fincode.jp/v1/fincode.js",
} as const

/**
 * fincode environment to load fincodeJS from.
 *
 * - `test`: the test environment, matching a `p_test_` public key.
 * - `prod`: the production environment, matching a `p_prod_` public key.
 */
export type FincodeEnvironment = "test" | "prod"

/**
 * @deprecated Use `FincodeEnvironment`. This type was never used by the
 * loader, and its `live` does not match the `prod` the loader accepts.
 */
export type FincodeEnv = "test" | "live"

export type FincodeInitArgs = {
    publicKey: string,

    /**
     * fincode environment to load fincodeJS from. Defaults to `test`.
     */
    environment?: FincodeEnvironment,

    /**
     * @deprecated Use `environment` instead. `true` selects `prod`, `false`
     * selects `test`.
     */
    isLiveMode?: boolean,

    /**
     * Full URL to load fincodeJS from, in place of the fincode environment.
     *
     * Set this to load the script from somewhere else, such as a stub used
     * in tests. Only `https` is accepted, and the URL must not carry
     * credentials.
     *
     * The script runs in the page, so do not build this from anything a
     * visitor can influence.
     *
     * This replaces the source outright, so `environment` and `isLiveMode`
     * cannot be set alongside it.
     */
    scriptUrl?: string,
}

export type FincodeLoaderFn = (initArgs: FincodeInitArgs) => Promise<FincodeInstance>

/**
 * Checks a URL given through `scriptUrl`.
 *
 * Loading a script runs its code in the page, so a source that is not
 * `https`, or that carries credentials of its own, is refused here.
 */
const validateScriptUrl = (scriptUrl: string): string => {
    let url: URL
    try {
        url = new URL(scriptUrl)
    } catch {
        throw new FincodeSDKError(`scriptUrl is not a valid URL: ${scriptUrl}`)
    }
    if (url.protocol !== "https:") {
        throw new FincodeSDKError(`scriptUrl must use https: ${scriptUrl}`)
    }
    if (url.username || url.password) {
        throw new FincodeSDKError("scriptUrl must not carry credentials")
    }
    return scriptUrl
}

/**
 * Works out which fincodeJS to load.
 *
 * `scriptUrl` replaces the source outright, so pairing it with an environment
 * is refused: a stale `scriptUrl` left beside `environment: "prod"` would
 * otherwise load something else into a production page silently.
 */
const resolveScriptUrl = (initArgs: FincodeInitArgs): string => {
    const hasEnvironment = initArgs.environment !== undefined
    const hasLiveMode = initArgs.isLiveMode !== undefined

    if (initArgs.scriptUrl !== undefined) {
        if (hasEnvironment || hasLiveMode) {
            throw new FincodeSDKError(
                "scriptUrl cannot be combined with environment or isLiveMode. " +
                "Drop the environment when the source is given as a URL.",
            )
        }
        return validateScriptUrl(initArgs.scriptUrl)
    }

    if (hasEnvironment) {
        const resolved = SCRIPT_URL_BY_ENVIRONMENT[initArgs.environment as FincodeEnvironment]
        if (!resolved) {
            throw new FincodeSDKError(
                `environment must be "test" or "prod", got: ${String(initArgs.environment)}`,
            )
        }
        return resolved
    }

    return initArgs.isLiveMode ? SCRIPT_URL_BY_ENVIRONMENT.prod : SCRIPT_URL_BY_ENVIRONMENT.test
}

/**
 * Returns the script tag already on the page for the URL about to be loaded.
 *
 * The match is on that exact URL: reusing a script from another environment
 * would talk to somewhere other than the one asked for.
 */
const findFincodeScript = (scriptUrl: string): HTMLScriptElement | null => {
    if (typeof document === "undefined") return null

    // 属性セレクタでは完全一致を書けないため、ここでは絞り込まない。
    const scripts = document.querySelectorAll<HTMLScriptElement>("script[src]")

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i]

        if (script.src !== scriptUrl) continue

        return script
    }

    return null
}

const injectFincodeScript = (scriptUrl: string): HTMLScriptElement => {
    if (typeof document === "undefined") {
        throw new FincodeSDKError("document is undefined")
    }

    const script = document.createElement("script")
    script.src = scriptUrl

    const injectTarget = document.head || document.body

    if (!injectTarget) {
        throw new FincodeSDKError("Either head or body must be present")
    }

    injectTarget.appendChild(script)

    return script
}


/**
 * initialize fincode.js and return fincode instance
 * 
 * @param initArgs - initialization arguments
 * @param initArgs.publicKey - public API key for fincode.js
 * @param initArgs.environment - fincode environment to load fincodeJS from. Defaults to `test`.
 */
export const initFincode: FincodeLoaderFn = (initArgs) => {
    if (!initArgs.publicKey) {
        throw new FincodeSDKError("publicKey is required")
    }

    if (typeof initArgs.isLiveMode !== "boolean" && initArgs.isLiveMode !== undefined) {
        throw new FincodeSDKError("isLiveMode must be a boolean")
    }

    const scriptUrl = resolveScriptUrl(initArgs)

    const fincodePromise = new Promise<FincodeInstance>((resolve, reject) => {
        if (typeof window === "undefined") {
            reject(new FincodeSDKError("window is undefined"))
            return
        }

        const initializer = window.Fincode

        if (initializer) {
            resolve(initializer(initArgs.publicKey))
            return
        }

        try {
            let script = findFincodeScript(scriptUrl)
            if (!script) {
                script = injectFincodeScript(scriptUrl)
            }

            script.addEventListener("load", (evt) => {
                if (window.Fincode) {
                    resolve(window.Fincode(initArgs.publicKey))
                } else {
                    reject(new FincodeSDKError("fincode.js is not available"))
                }
            })

            script.addEventListener("error", (evt) => {
                reject(new FincodeSDKError("Cannot load fincode.js"))
            })
        } catch (e) {
            reject(e)
        }
    })

    return fincodePromise
}