function createCard(awardId, user, date) {
    const card = createElement("div", { c: "recent" })

    createElement("h1", { p: card, t: "Recent Awards" })
    createElement("p", {
        c: "info",
        p: card,
        t: `${user.titleName} recently achieved the <a href=/awards/${pascalToKebab(awardId)}>${getAwardName(awardId)} Award</a>`
    })
    createElement("button", { p: card, t: "Profile", onClick: () => window.location.href = `/profile/${user.id}` })
    createElement("p", { c: "date", p: card, t: formatDate(date) })

    return card
}

async function setupSlideshow() {
    const cardsPromise = new Promise(async r => {
        const { recentAwards } = await getRequest("/recent-awards")
        const cards = []

        if (recentAwards.length === 0) {
            const noneSlide = createElement("div", { c: "center-chv none" })
            createElement("h1", { p: noneSlide, t: "No Recent Awards" })
            createElement("p", { p: noneSlide, t: "Recent awards will show up here." })
            cards.push(noneSlide)
        } else {
            for (let recentAward of recentAwards) {
                const { award: awardId, date, user } = recentAward
                const card = createCard(awardId, user, date)
                cards.push(card)
            }
        }

        r(cards)
    })

    // loading slide
    const loadingSlide = createElement("div", { c: "center-rhv loading" })
    createElement("p", { p: loadingSlide, t: LOADING_TEXT })

    // previous arrow
    const previous = createElement("div")
    previous.classList.add("previous")
    createElement("img", { p: previous }).src = "/assets/icons/chevron_left.svg"

    // next arrow
    const next = createElement("div")
    next.classList.add("next")
    createElement("img", { p: next }).src = "/assets/icons/chevron_right.svg"

    const slideshow = createSlideshow(cardsPromise, 5000, {
        arrows: { previous, next },
        loadingSlide
    })

    byId("slideshow").replaceWith(slideshow)
}

window.addEventListener("load", () => {
    setupSlideshow()
})