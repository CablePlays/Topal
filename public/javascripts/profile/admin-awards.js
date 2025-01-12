window.addEventListener("load", () => {
    loadAwards()
})

function loadAwards() {
    const cardsContainer = byId("cards")
    const requestsPromise = new Promise(async r => {
        const { users } = await getRequest("/admin/requests")
        r(users[getProfileUserId()]?.requests ?? {})
    })

    for (let awardId of getAwards()) {
        const linkElement = createElement("a", { p: cardsContainer, t: getAwardName(awardId) })
        linkElement.href = `/profile/${getProfileUserId()}/admin/awards/${camelToKebab(awardId)}`

        const loadingElement = createElement("div", { c: "material-icons", p: linkElement, t: LOADING_ICON_TEXT })

        requestsPromise.then(requests => {
            const count = requests[awardId]
            loadingElement.remove()
            if (count != null) createElement("p", { c: "request-count", p: linkElement, t: count })
        })
    }
}