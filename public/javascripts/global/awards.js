function setAwardName(name) {
    byId("award-title").innerHTML = name + " Award"
    byId("award-info-title").innerHTML = name + " Award Info"
}

window.addEventListener("load", () => {
    const awardLinksElement = byId("award-links")
    const titleStart = byId("title-start")
    let next = titleStart

    while (true) {
        next = next.nextElementSibling
        const currentElement = next

        if (currentElement == null) break
        if (currentElement.tagName !== "H2") continue;

        const div = createElement("div", {
            p: awardLinksElement, onClick() {
                currentElement.scrollIntoView({ behavior: "smooth" })
            }
        })

        createElement("p", { p: div, t: next.innerHTML })
        createElement("div", { c: "material-icons", p: div, t: "keyboard_arrow_down" })
    }
})

function _setRating(rating, val) {
    const ratingElement = byId(rating)
    const children = ratingElement.childNodes

    ratingElement.classList.add("lvl" + val)

    for (let i = 0; i < val; i++) {
        children[i].classList.add("fill")
    }
}

function setDifficulty(val) {
    _setRating("difficulty", val)
}

function setSkillLevel(val) {
    _setRating("skill-level", val)
}

function setAwardDescription(desc) {
    byId("award-description").innerHTML = desc
}

function appendInfo(elements) {
    const infoElement = byId("info")

    createSpacer("20", { p: infoElement })
    createElement("div", { c: "line", p: infoElement })
    createSpacer("20", { p: infoElement })

    for (let element of elements) {
        infoElement.appendChild(element)
    }
}

function includePoints() {
    const points = new Promise(r => {
        setTimeout(() => r(263), 1000)
    })

    const pointsDisplay = createElement("p", { t: LOADING_TEXT })

    points.then(val => {
        pointsDisplay.innerHTML = val + " point" + (val === 1 ? "" : "s")
    })

    appendInfo([
        createElement("h3", { t: "Points" }),
        pointsDisplay
    ])
}