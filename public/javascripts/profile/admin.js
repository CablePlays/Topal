window.addEventListener("load", () => {
    loadAwards()
})

function loadAwards() {
    const cardsContainer = byId("cards")

    for (let awardId of getAwards()) {
        const linkElement = createElement("a", { p: cardsContainer, t: getAwardName(awardId) })
        linkElement.href = `/profile/${getProfileUserId()}/admin/${pascalToKebab(awardId)}`
    }
}