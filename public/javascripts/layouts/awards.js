const _BASIC_LINK_ID = "basic-link"
const _INSTRUCTOR_LINK_ID = "instructor-link"
const _LEADER_LINK_ID = "leader-link"

function setAward(awardId) {
    const name = getAwardName(awardId)
    byId("award-title").innerHTML = name + " Award"
    byId("award-info-title").innerHTML = name + " Info"
    byId("award-description").innerHTML = getAwardDescription(awardId)

    /* Status */

    if (isLoggedIn()) {
        const awardStatus = byId("award-status")
        awardStatus.children[0].innerHTML = LOADING_TEXT
        setVisible(awardStatus)

        getRequest(`/users/${getUserId()}/awards`).then(res => {
            const { awards } = res
            const { complete, date, signer } = awards[awardId] ?? {}

            awardStatus.children[0].innerHTML = (complete ? "Complete" : "Incomplete")
            awardStatus.children[1].innerHTML = (complete ? "check_box" : "check_box_outline_blank")

            if (complete) {
                const awardStatusInfo = byId("award-status-info")
                awardStatusInfo.children[0].innerHTML = formatDate(date)
                awardStatusInfo.children[1].innerHTML = "by " + signer.fullName
                setVisible(awardStatusInfo)
            } else {
                setVisible("request-container")
            }
        })
    }
}

function _setRating(ratingId, val) {
    const ratingElement = byId(ratingId)
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
        createShortcut("Basic Award", "right", () => location.href = `${pathRoot}/${awardType}`)
    }
    if (instructor && sequelType !== "instructor") {
        createShortcut("Instructor Award", "right", () => location.href = `${pathRoot}/${awardType}-instructor`)
    }
    if (leader && sequelType !== "leader") {
        createShortcut("Leader Award", "right", () => location.href = `${pathRoot}/${awardType}-leader`)
    }
}

function createShortcut(text, arrowType, onClick) {
    const linksElement = byId("award-links")
    const container = createElement("div", { p: linksElement, onClick })
    let icon

    if (arrowType === "down") {
        icon = "keyboard_arrow_down"
    } else if (arrowType === "right") {
        icon = "chevron_right"
    }

    createElement("p", { p: container, t: text })
    createElement("div", { c: "material-icons", p: container, t: icon })
}

function showLogs(...logTypes) {
    const logsSection = byId("logs-section")

    for (let logType of logTypes) {
        const logTypeContainer = createElement("div", { p: logsSection })

        const name = getLogTypeName(logType) + " Logs"
        const headingElement = createElement("h2", { c: "pl16", p: logTypeContainer, t: name })

        createSpacer("20", { p: logTypeContainer })

        const logDisplay = createLogDisplay({ logType, viewOnly: false })
        logTypeContainer.appendChild(logDisplay)

        createShortcut(name, "down", () => headingElement.scrollIntoView({ behavior: "smooth" }))
    }
}