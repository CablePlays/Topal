async function handleLogin(val) {
    const { credential } = val

    const infoText = byId("info-text")
    infoText.innerHTML = "Please wait."

    const { ok, error } = await putRequest("/account/handle-login", {
        token: credential
    })

    if (ok) {
        infoText.innerHTML = "Signed in."
        location.href = getParam("redirect") ?? "/"
    } else if (error === "invalid_email") {
        infoText.innerHTML = "Please use a Treverton email address."
    } else {
        infoText.innerHTML = "Something went wrong. Please try again later."
    }
}