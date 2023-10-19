window.addEventListener("load", loadHistory)

async function loadHistory() {
    const historyContainer = byId("history-container")
    const loadingElement = createElement("p", { p: historyContainer, t: LOADING_TEXT })

    const { history } = await getRequest("/admin/award-history")
    loadingElement.remove()

    for (let heading of ["Date", "User", "Award", "Signer"]) {
        createElement("p", { c: "heading", p: historyContainer, t: heading })
    }
    for (let val of history) {
        const { award, date, signer, user } = val
        createElement("p", { c: "date", p: historyContainer, t: formatDate(date) })
        createElement("p", { p: historyContainer, t: user.titleName })
        createElement("p", { p: historyContainer, t: getAwardName(award) })
        createElement("p", { p: historyContainer, t: signer.titleName })
    }
}