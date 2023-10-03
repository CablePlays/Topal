async function handleLogin(val) {
    const { credential } = val

    const infoText = byId("info-text")
    infoText.innerHTML = "Please wait."

    const { ok } = await putRequest("/account/handle-login", {
        token: credential
    })

    if (ok) {
        infoText.innerHTML = "Signed in."
        location.href = getParam("redirect") ?? "/"
    } else {
        infoText.innerHTML = "Something went wrong. Please try again later."
    }
}