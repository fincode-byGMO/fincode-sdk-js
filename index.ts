import { getCardToken, initFincode } from "./src";

const main = async () => {
    const fincode = await initFincode("")
    const ui = fincode.ui({ layout: "vertical" })

    ui.create("payments", {})
    ui.mount("#fincode", "400")

    const onSubmit = async () => {
        console.log("onSubmit")
        const res = await getCardToken(fincode, ui)
        const token = res.list[0].token
        console.log({ token })
    }
}

main()