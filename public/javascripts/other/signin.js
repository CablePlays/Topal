function redirect() {
    const params = new URLSearchParams(location.search)
    location.href = params.get("redirect") ?? "/"
}

async function handleLogin(val) {
    const { credential } = val

    const infoText = byId("info-text")
    infoText.innerHTML = "Please wait."

    const { ok } = await putRequest("/account/handle-login", {
        token: credential
    })

    if (ok) {
        infoText.innerHTML = "Signed in."
        redirect()
    } else {
        infoText.innerHTML = "Something went wrong. Please try again later."
    }
}

function dummySignin() {
    document.cookie = "user_id=3";
    document.cookie = "session_token=dummy3";
    redirect()
}