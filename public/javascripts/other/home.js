function createSlide(awardId, user, date) {
    const card = createElement("div", { c: "recent" })

    createElement("h1", { p: card, t: "Recent Awards" })
    createElement("p", {
        c: "info",
        p: card,
        t: `${user.titleName} recently achieved the <a href=/awards/${camelToKebab(awardId)}>${getAwardName(awardId)} Award</a>`
    })
    createElement("button", { p: card, t: "Profile", onClick: () => window.location.href = `/profile/${user.id}` })
    createElement("p", { c: "date", p: card, t: formatDate(date) })

    return card
}

async function setupSlideshow() {
    const slidesPromise = new Promise(async r => {
        const { recentAwards } = await getRequest("/awards/recents")
        const slides = []

        if (recentAwards.length === 0) {
            const noneSlide = createElement("div", { c: "center-chv none" })
            createElement("h1", { p: noneSlide, t: "No Recent Awards" })
            createElement("p", { p: noneSlide, t: "Recent awards will show up here." })
            slides.push(noneSlide)
        } else {
            for (let recentAward of recentAwards) {
                const { award: awardId, date, user } = recentAward
                const slide = createSlide(awardId, user, date)
                slides.push(slide)
            }
        }
        if (recentAwards.length <= 2) {
            const infoSlide = createElement("div", { c: "center-rhv info" })
            createElement("p", { p: infoSlide, t: "You will be displayed here when you earn an award." })
            slides.push(infoSlide)
        }

        r(slides)
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

    const slideshow = createSlideshow(slidesPromise, 5000, {
        arrows: { previous, next },
        loadingSlide
    })

    byId("slideshow").replaceWith(slideshow)
}

window.addEventListener("load", () => {
    setupSlideshow()
})