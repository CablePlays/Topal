window.addEventListener("load", () => {
    renderAwards()
    setupProfileWindowButtons()
})

function setupProfileWindowButtons() {
    const buttons = byId("profile-window-buttons").children

    function setSelectedWindow(n) {
        const windows = byId("windows").children

        for (let windowElement of windows) {
            windowElement.style.display = "none"
        }

        windows[n].style.display = "block"
    }

    for (let i = 0; i < buttons.length; i += 2) {
        buttons[i].addEventListener("click", () => setSelectedWindow(i / 2))
    }
}

async function renderAwards() {
    const awardsDisplay = byId("awards-display")
    const awardsPromise = getRequest(`/users/${getProfileUserId()}/awards`)

    for (let awardId of getAwards()) {
        const tr = createElement("tr", { p: awardsDisplay })
        createElement("td", { c: "title", p: tr, t: getAwardName(awardId) + " Award" })

        const loadingElement = createElement("td", { p: tr })
        createElement("span", { c: "material-icons", p: loadingElement, t: "hourglass_empty" })

        awardsPromise.then(res => {
            const { complete, date, signer } = res.awards[awardId] ?? {}

            loadingElement.remove()

            // status
            const statusTd = createElement("td", { p: tr })
            const statusTdRow = createElement("div", { c: "row", p: statusTd })
            createElement("p", { p: statusTdRow, t: complete ? "Complete" : "Incomplete" })
            createElement("span", { c: "material-icons", p: statusTdRow, t: complete ? "check_box" : "check_box_outline_blank" })

            // date
            const dateTd = createElement("td", { p: tr })
            createElement("p", { c: "title", p: dateTd, t: "Date" })
            createElement("p", { c: "value", p: dateTd, t: complete ? formatDate(date) : "-" })

            // signer
            const signerTd = createElement("td", { p: tr })
            createElement("p", { c: "title", p: signerTd, t: "Signer" })
            createElement("p", { c: "value", p: signerTd, t: complete ? signer.titleName : "-" })
        })
    }
}