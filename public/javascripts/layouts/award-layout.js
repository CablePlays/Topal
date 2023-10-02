const _BASIC_LINK_ID = "basic-link"
const _INSTRUCTOR_LINK_ID = "instructor-link"
const _LEADER_LINK_ID = "leader-link"

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
    const infoElement = byId("award-info")
    createElement("div", { c: "line", p: infoElement })

    for (let element of elements) {
        infoElement.appendChild(element)
    }
}

function showPoints() {
    const points = new Promise(r => {
        setTimeout(() => r(263), 1000) // TODO: get points
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
    setVisible(logsSection)

    for (let logType of logTypes) {
        const logTypeContainer = createElement("div", { p: logsSection })

        const name = getLogTypeName(logType) + " Logs"
        const headingElement = createElement("h2", { c: ["heading", "pl16"], p: logTypeContainer, t: name })

        createSpacer(20, { p: logTypeContainer })

        const logDisplay = createLogDisplay({ logType, viewOnly: false })
        logTypeContainer.appendChild(logDisplay)

        createShortcut(name, "down", () => headingElement.scrollIntoView({ behavior: "smooth" }))
    }
}

function _createSignoffElement(options) {
    const { awardId, open, signoffData, signoffInfo } = options // if logged in then signoffData and awardId
    const { id, name, description } = signoffInfo

    const signoffElement = createElement("div", { c: "signoff" })
    if (open) signoffElement.classList.add("open")

    /* Open */

    let bottomOpen = open

    signoffElement.addEventListener("click", event => {
        const targetType = event.target.nodeName
        if (targetType === "A" || targetType === "BUTTON") return // clicked button or link -> ignore

        bottomOpen = !bottomOpen

        if (bottomOpen) {
            signoffElement.classList.add("open")
        } else {
            signoffElement.classList.remove("open")
        }
    })

    /* Top */

    const topElement = createElement("div", { c: "top", p: signoffElement })
    const statusElement = createElement("div", { c: ["material-icons", "status"], p: topElement, t: LOADING_ICON_TEXT })
    createElement("h3", { p: topElement, t: name })
    createElement("div", { c: ["dropdown", "material-icons"], p: topElement, t: "expand_more" })

    /* Bottom & Load */

    const bottomElement = createElement("div", { c: "bottom", p: signoffElement })

    setTimeout(async () => {
        const initialDescriptionElement = createElement("p", { p: bottomElement, t: description })
        const loadingTextElement = createElement("p", { p: bottomElement, t: LOADING_TEXT })

        const signoffDataLoaded = await signoffData
        const { complete, date, signer, requestDate, decline } = signoffDataLoaded ?? {}

        initialDescriptionElement.remove()
        loadingTextElement.remove()

        /* Status */

        const boxEmpty = "check_box_outline_blank"
        const boxPending = "pending_actions"
        let statusIcon

        if (signoffDataLoaded == null) {
            statusIcon = boxEmpty
        } else if (complete) {
            statusIcon = "check_box"
        } else if (requestDate) {
            statusIcon = boxPending
        } else if (decline) {
            statusIcon = "disabled_by_default"
        } else {
            statusIcon = boxEmpty
        }

        statusElement.innerHTML = statusIcon

        /* Completion Info */

        if (signoffDataLoaded && complete) {
            const completeInfoContainer = createElement("div", { p: bottomElement })
            createElement("p", { p: completeInfoContainer, t: "by " + signer.titleName })
            createElement("p", { p: completeInfoContainer, t: formatDate(date) })
        }

        createElement("p", { p: bottomElement, t: description })

        if (signoffDataLoaded) {
            if (!complete) {
                if (requestDate) {
                    const requestInfoContainer = createElement("div", { c: "horizontal-container", p: bottomElement })
                    createElement("p", { p: requestInfoContainer, t: "Signoff requested" })
                    createElement("button", {
                        p: requestInfoContainer, t: "Cancel", onClick() {
                            options.open = true
                            delete signoffDataLoaded.requestDate
                            signoffElement.replaceWith(_createSignoffElement(options))

                            putRequest(`/users/${getUserId()}/signoffs/${awardId}/${id}/cancel-request`)
                        }
                    })
                } else {
                    let declineContainer

                    if (decline) {
                        const { date: declineDate, message: declineMessage, user: declineUser } = decline
                        declineContainer = createElement("div", { p: bottomElement })

                        createElement("h3", { p: declineContainer, t: "Request Declined" })
                        createElement("p", { p: declineContainer, t: formatDate(declineDate) })
                        createElement("p", { p: declineContainer, t: "by " + declineUser.titleName })

                        if (declineMessage) {
                            createElement("p", { p: declineContainer, t: `Reason: "${declineMessage}"` })
                        }
                    }

                    const buttonContainer = createElement("div", { c: "horizontal-container", p: bottomElement })

                    createElement("button", {
                        p: buttonContainer, t: "Request", onClick() {
                            options.open = true
                            signoffDataLoaded.requestDate = true // indicate that there has been request made
                            delete signoffDataLoaded.decline
                            signoffElement.replaceWith(_createSignoffElement(options))

                            putRequest(`/users/${getUserId()}/signoffs/${awardId}/${id}/request-signoff`)
                        }
                    })

                    if (decline) {
                        createElement("button", {
                            p: buttonContainer, t: "Clear Decline", onClick(b) {
                                b.remove()
                                declineContainer.remove()
                                statusElement.innerHTML = boxEmpty
                                putRequest(`/users/${getUserId()}/signoffs/${awardId}/${id}/clear-decline`)
                            }
                        })
                    }
                }
            }
        } else {
            createElement("p", { p: bottomElement, t: "<a class='signin-link'>Sign in</a> for more information." })
        }
    })

    return signoffElement
}

function _showLinks(awardId) {
    const links = getAwardLinks(awardId)
    if (links == null) return

    function createLinkDisplay(linkId, linkName, link) {
        const container = createElement("div", { c: "link-group" })
        createElement("h3", { p: container, t: linkName })

        const icons = []

        function showInput() {
            icons.forEach(icon => icon.remove())

            const inputContainer = createElement("div", { c: "link-input-container" })
            container.insertAdjacentElement("afterend", inputContainer)

            const urlInput = createElement("input", { p: inputContainer })
            urlInput.type = "url"

            const doneElement = createElement("div", {
                c: "material-icons", p: inputContainer, t: "done", onClick: () => {
                    const url = urlInput.value

                    if (isValidUrl(url)) {
                        inputContainer.remove()
                        container.replaceWith(createLinkDisplay(linkId, linkName, url))
                        putRequest(`/users/${getUserId()}/links/${awardId}/${linkId}`, { link: url })
                    }
                }
            })
            doneElement.style.display = "none"

            urlInput.addEventListener("input", () => {
                doneElement.style.display = isValidUrl(urlInput.value) ? "block" : "none"
            })
        }

        function handleLoadedLink(l) {
            if (l == null) {
                icons.push(createElement("div", {
                    c: "material-icons", p: container, t: "add_circle", onClick: showInput
                }))
            } else {
                icons.push(createElement("div", {
                    c: "material-icons", p: container, t: "open_in_new", onClick: () => window.open(l, "_blank")
                }))
                icons.push(createElement("div", {
                    c: ["emerge", "material-icons"], p: container, t: "edit", onClick: showInput
                }))
                icons.push(createElement("div", {
                    c: ["emerge", "material-icons"], p: container, t: "delete", onClick: () => {
                        container.replaceWith(createLinkDisplay(linkId, linkName, null))
                        putRequest(`/users/${getUserId()}/links/${awardId}/${linkId}`)
                    }
                }))
            }
        }

        if (link instanceof Promise) {
            const loadingElement = createElement("div", { c: "material-icons", p: container, t: LOADING_ICON_TEXT })
            link.then(l => {
                loadingElement.remove()
                handleLoadedLink(l)
            })
        } else {
            handleLoadedLink(link)
        }

        return container
    }

    const appending = []
    const userLinksPromise = new Promise(async r => {
        const res = await getRequest(`/users/${getUserId()}/links`)
        r(res.links[awardId] ?? {})
    })

    for (let i = 0; i < links.length; i++) {
        const { id, name } = links[i]
        const linkPromise = new Promise(async r => {
            const awardLinks = await userLinksPromise
            r(awardLinks[id])
        })

        if (i > 0) appending.push(createSpacer(10))
        const linkDisplayElement = createLinkDisplay(id, name, linkPromise)
        appending.push(linkDisplayElement)
    }

    appendInfo(appending)
}

function _createSequelShortcuts(awardId) {
    let baseAwardId = awardId
    let sequelType

    for (let s of ["Instructor", "Leader"]) {
        if (awardId.endsWith(s)) {
            baseAwardId = awardId.substring(0, awardId.length - s.length)
            sequelType = s
            break
        }
    }

    const pathParts = location.pathname.split("/")
    let pathRoot = ""

    for (let i = 1; i < pathParts.length - 1; i++) { // start 1 -> skip blank
        pathRoot += "/" + pathParts[i]
    }

    const kebabBaseAwardId = pascalToKebab(baseAwardId)

    if (sequelType && isAward(baseAwardId)) {
        createShortcut("Basic Award", "right", () => location.href = `${pathRoot}/${kebabBaseAwardId}`)
    }
    if (awardHasInstructor(baseAwardId) && sequelType !== "Instructor") {
        createShortcut("Instructor Award", "right", () => location.href = `${pathRoot}/${kebabBaseAwardId}-instructor`)
    }
    if (awardHasLeader(baseAwardId) && sequelType !== "Leader") {
        createShortcut("Leader Award", "right", () => location.href = `${pathRoot}/${kebabBaseAwardId}-leader`)
    }
}

function _generateSignoffs(awardId) {
    const awardSignoffs = getAwardSignoffs(awardId)

    if (awardSignoffs) {
        const userId = getUserId()
        let signoffsPromise

        if (userId) {
            signoffsPromise = new Promise(async r => {
                const { signoffs } = await getRequest(`/users/${userId}/signoffs/${awardId}`)
                r(signoffs)
            })
        } else {
            signoffsPromise = new Promise(r => r(null))
        }

        const signoffsElement = byId("signoffs")

        for (let signoff of awardSignoffs) {
            const { id } = signoff

            const signoffPromise = new Promise(async r => {
                const signoffs = await signoffsPromise
                r(signoffs && (signoffs?.[id] ?? {}))
            })

            const signoffElement = _createSignoffElement({ awardId, signoffData: signoffPromise, signoffInfo: signoff })
            signoffsElement.appendChild(signoffElement)
        }

        setVisible("signoffs-section")
        createShortcut("Signoffs", "down", () => signoffsElement.scrollIntoView({ behavior: "smooth" }))
    }
}

function _displayStatus(awardId) {
    const awardStatus = byId("award-status")
    awardStatus.children[0].innerHTML = LOADING_TEXT
    setVisible(awardStatus)

    /* Request */

    const requestContainer = byId("request-container")

    requestContainer.children[0].addEventListener("click", () => {
        setVisible(requestContainer, false)
        setVisible("decline-container", false)
        setVisible("requested-container")
        putRequest(`/users/${getUserId()}/awards/${awardId}/request-signoff`)
    })

    /* Requseted */

    const requestedContainer = byId("requested-container")

    requestedContainer.children[1].addEventListener("click", () => {
        setVisible(requestedContainer, false)
        setVisible("request-container")
        putRequest(`/users/${getUserId()}/awards/${awardId}/cancel-request`)
    })

    getRequest(`/users/${getUserId()}/awards`).then(res => {
        const { awards } = res
        const { complete, date, decline, requestDate, signer } = awards[awardId] ?? {}

        awardStatus.children[0].innerHTML = (complete ? "Complete" : "Incomplete")
        awardStatus.children[1].innerHTML = (complete ? "check_box" : "check_box_outline_blank")

        if (complete) {
            const awardStatusInfo = byId("award-status-info")
            awardStatusInfo.children[0].innerHTML = formatDate(date)
            awardStatusInfo.children[1].innerHTML = "by " + signer.titleName
            setVisible(awardStatusInfo)
        } else if (requestDate) {
            setVisible(requestedContainer)
        } else {
            setVisible(requestContainer)

            /* Decline */

            if (decline) {
                const { date: declineDate, message: declineMessage, user: declineUser } = decline

                const declineContainer = byId("decline-container")
                const elements = declineContainer.children[1].children
                elements[1].innerHTML = formatDate(declineDate)
                elements[2].innerHTML = "by " + declineUser.titleName

                if (declineMessage) {
                    elements[3].innerHTML = `Reason: "${declineMessage}"`
                }

                let declineOpen = false

                declineContainer.addEventListener("click", () => {
                    declineOpen = !declineOpen

                    if (declineOpen) {
                        declineContainer.classList.add("open")
                    } else {
                        declineContainer.classList.remove("open")
                    }
                })

                elements[5].addEventListener("click", () => {
                    declineContainer.remove()
                    putRequest(`/users/${getUserId()}/awards/${awardId}/clear-decline`)
                })

                setVisible(declineContainer)
            }
        }
    })
}

function _showAuthorisedStaff(awardId) {
    const authorisedStaff = getAwardAuthorisedStaff(awardId)

    if (authorisedStaff) {
        const authorisedStaffElement = createElement("p", { t: "MIC's: " + authorisedStaff.join(", ") })
        authorisedStaffElement.style["font-size"] = "14px"
        appendInfo([authorisedStaffElement])
    }
}

function setAward(awardId) {
    const awardName = getAwardName(awardId)
    byId("award-title").innerHTML = awardName + " Award"
    byId("award-info-title").innerHTML = awardName + " Info"
    byId("award-description").innerHTML = getAwardDescription(awardId)

    if (isLoggedIn()) {
        _displayStatus(awardId)
        _showLinks(awardId)
    }

    _createSequelShortcuts(awardId)
    _generateSignoffs(awardId)
    _showAuthorisedStaff(awardId)
}