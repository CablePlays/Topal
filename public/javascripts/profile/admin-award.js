window.addEventListener("load", () => {
    byId("award-name").innerHTML = getAwardName(getCurrentAwardId()) + " Award"
    loadStatus()
    loadLinks()
    loadSignoffs()
    loadLogs()
})

function getCurrentAwardId() {
    const id = location.pathname.split("/")[4]
    return kebabToCamel(id)
}

function loadStatus() {
    const statusElement = byId("status")
    const awardsPromise = new Promise(async r => {
        const { awards } = await getRequest(`/users/${getProfileUserId()}/awards`)
        r(awards[getCurrentAwardId()] ?? {})
    })

    statusElement.appendChild(createStatus(awardsPromise, "Award", async complete => {
        const { award } = await putRequest(`/users/${getProfileUserId()}/awards/${getCurrentAwardId()}`, { complete })
        return award
    }, async message => {
        await putRequest(`/users/${getProfileUserId()}/awards/${getCurrentAwardId()}/decline-request`, { message })
    }))
}

function loadLinks() {
    const links = getAwardLinks(getCurrentAwardId())
    if (links == null) return

    const linksElement = byId("links")
    const linksPromise = getRequest(`/users/${getProfileUserId()}/links`)

    for (let link of links) {
        const { id, name } = link

        createElement("h3", { p: linksElement, t: name })
        const loadingElement = createElement("p", { p: linksElement, t: LOADING_TEXT })

        linksPromise.then(res => {
            const link = res.links[getCurrentAwardId()]?.[id]
            const iconElement = createElement("div", {
                c: "material-icons", p: linksElement, t: link ? "open_in_new" : "block"
            })

            if (link) {
                iconElement.classList.add("link-icon")
                iconElement.addEventListener("click", () => {
                    window.open(link, { target: "_blank" })
                })
            }

            loadingElement.replaceWith(iconElement)
        })
    }

    setVisible("links-container")
}

function loadSignoffs() {
    const signoffs = getAwardSignoffs(getCurrentAwardId())
    if (signoffs == null) return

    const signoffsElement = byId("signoffs")
    const signoffsPromise = getRequest(`/users/${getProfileUserId()}/signoffs/${getCurrentAwardId()}`)

    for (let i = 0; i < signoffs.length; i++) {
        if (i > 0) {
            createElement("div", { c: "subruler", p: signoffsElement })
        }

        const { id, name, description } = signoffs[i]

        const signoffElement = createElement("div", { p: signoffsElement })
        createElement("h3", { p: signoffElement, t: name })
        if (description) createElement("p", { c: "limit-width", p: signoffElement, t: `"${description}"` })
        createSpacer(20, { p: signoffElement })

        const signoffPromise = new Promise(async r => {
            const { signoffs } = await signoffsPromise
            r(signoffs[id] ?? {})
        })

        const status = createStatus(signoffPromise, "Signoff", async complete => {
            const { signoff } = await putRequest(`/users/${getProfileUserId()}/signoffs/${getCurrentAwardId()}/${id}`, { complete })
            return signoff
        }, async message => {
            await putRequest(`/users/${getProfileUserId()}/signoffs/${getCurrentAwardId()}/${id}/decline-request`, { message })
        })

        signoffElement.appendChild(status)
    }

    setVisible("signoffs-container")
}

function loadLogs() {
    const logTypes = getAwardLogTypes(getCurrentAwardId())
    if (logTypes == null) return

    const logsContainer = byId("logs-container")
    setVisible(logsContainer)

    for (let i = 0; i < logTypes.length; i++) {
        if (i > 0) {
            createElement("div", { c: "subruler", p: logsContainer })
        }

        const logType = logTypes[i]
        createElement("h3", { p: logsContainer, t: getLogTypeName(logType) + " Logs" })
        createSpacer(20, { p: logsContainer })

        const logDisplay = createLogDisplay({ logType: logType, userId: getProfileUserId(), viewOnly: true })
        logsContainer.appendChild(logDisplay)
    }
}

function createStatus(statusDetails, displayType, setComplete, onRequestDecline) {
    const statusElement = createElement("div", { c: "status" })

    const indicatorContainer = createElement("div", { p: statusElement })
    const indicatorElement = createElement("p", { p: indicatorContainer, t: LOADING_TEXT })
    const indicatorIconElement = createElement("span", { c: "material-icons", p: indicatorContainer, t: LOADING_ICON_TEXT })

    const dateContainer = createElement("div", { p: statusElement })
    createElement("h3", { p: dateContainer, t: "Date" })
    const dateElement = createElement("p", { p: dateContainer, t: LOADING_TEXT })

    const signerContainer = createElement("div", { p: statusElement })
    createElement("h3", { p: signerContainer, t: "Signer" })
    const signerElement = createElement("p", { p: signerContainer, t: LOADING_TEXT })

    function handleLoadedData(awardData) {
        const { complete, date, requestDate, signer } = awardData

        if (complete) {
            indicatorElement.innerHTML = "Complete"
            indicatorIconElement.innerHTML = "check_box"
            dateElement.innerHTML = formatDate(date)
            signerElement.innerHTML = signer.fullName
        } else {
            indicatorElement.innerHTML = "Incomplete"
            indicatorIconElement.innerHTML = "check_box_outline_blank"
            dateElement.innerHTML = MISSING_TEXT
            signerElement.innerHTML = MISSING_TEXT
        }
        if (requestDate) {
            const requestContainer = createElement("div", { c: "request-container", p: statusElement })
            createElement("h3", { p: requestContainer, t: "Requested" })
            createElement("p", { p: requestContainer, t: formatDate(requestDate) })

            const bottomContainer = createElement("div", { c: "row", p: requestContainer })
            createElement("button", { // accept button
                c: "primary shadow", p: bottomContainer, t: "Accept", onClick: async () => {
                    bottomContainer.innerHTML = LOADING_TEXT
                    const newStatusDetails = await setComplete(true)
                    statusElement.replaceWith(createStatus(newStatusDetails, displayType, setComplete, onRequestDecline))
                }
            })
            createElement("button", { // decline button
                c: "secondary shadow", p: bottomContainer, t: "Decline", onClick: () => {
                    bottomContainer.innerHTML = null

                    const declineInfoElement = createElement("p", {
                        c: "decline-info", p: bottomContainer, t: "Tell the user why you're declining the request (optional)."
                    })
                    bottomContainer.insertAdjacentElement("beforebegin", declineInfoElement)

                    const declineMessageInputElement = createElement("input", { p: bottomContainer })
                    declineMessageInputElement.type = "text"

                    createElement("button", { // confirm decline button
                        c: "secondary shadow", p: bottomContainer, t: "Decline", onClick: async () => {
                            declineInfoElement.remove()
                            bottomContainer.innerHTML = LOADING_TEXT

                            let message = declineMessageInputElement.value.trim()
                            if (message.length === 0) message = null
                            await onRequestDecline(message)

                            requestContainer.remove()
                        }
                    })
                }
            })
        } else {
            const toggleButtonElement = createElement("button", {
                c: "primary shadow toggle-button", p: statusElement, t: (complete ? "Revoke" : "Grant") + " " + displayType, onClick: async () => {
                    toggleButtonElement.replaceWith(createElement("p", { t: LOADING_TEXT }))
                    const newStatusDetails = await setComplete(!complete)
                    statusElement.replaceWith(createStatus(newStatusDetails, displayType, setComplete, onRequestDecline))
                }
            })
        }
    }

    if (statusDetails instanceof Promise) {
        statusDetails.then(handleLoadedData)
    } else {
        handleLoadedData(statusDetails)
    }

    return statusElement
}