const _BASIC_LINK_ID = "basic-link"
const _INSTRUCTOR_LINK_ID = "instructor-link"
const _LEADER_LINK_ID = "leader-link"

function setAwardName(name) {
    byId("award-title").innerHTML = name + " Award"
    byId("award-info-title").innerHTML = name + " Award Info"
}

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
    createElement("div", { c: "line", p: infoElement })

    for (let element of elements) {
        infoElement.appendChild(element)
    }
}

function showPoints() {
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

function showSequels(instructor, leader) {
    const pathSplit = location.pathname.split("/")
    let awardType = pathSplit[pathSplit.length - 1]
    let sequelType

    for (let st of ["instructor", "leader"]) {
        if (awardType.endsWith("-" + st)) {
            awardType = awardType.substring(0, awardType.length - st.length - 1)
            sequelType = st
            break
        }
    }

    let pathRoot = ""

    for (let i = 1; i < pathSplit.length - 1; i++) { // start 1 -> skip blank
        pathRoot += "/" + pathSplit[i]
    }

    if (sequelType) {
        byId(_BASIC_LINK_ID).addEventListener("click", () => window.location.href = `${pathRoot}/${awardType}`)
        byId(_BASIC_LINK_ID).style.display = "flex"
    }
    if (instructor && sequelType !== "instructor") {
        byId(_INSTRUCTOR_LINK_ID).addEventListener("click", () => window.location.href = `${pathRoot}/${awardType}-instructor`)
        byId(_INSTRUCTOR_LINK_ID).style.display = "flex"
    }
    if (leader && sequelType !== "leader") {
        byId(_LEADER_LINK_ID).addEventListener("click", () => window.location.href = `${pathRoot}/${awardType}-leader`)
        byId(_LEADER_LINK_ID).style.display = "flex"
    }
}

window.addEventListener("load", () => {

    /* Log Headings */

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

    /* Status */

    const awardStatus = byId("award-status")
    awardStatus.children[0].innerHTML = LOADING_TEXT

    const completePromise = new Promise(r => setTimeout(() => r(false), 500))

    completePromise.then(complete => {
        awardStatus.children[0].innerHTML = (complete ? "Complete" : "Incomplete")
        awardStatus.children[1].innerHTML = (complete ? "check_box" : "check_box_outline_blank")

        if (complete) {
            byId("award-status-info").style.display = "block"
        } else {
            byId("request-container").style.display = "flex"
        }
    })
})