function setView(viewI) {
    const viewsContainer = byId("views").children

    for (let viewElement of viewsContainer) {
        viewElement.style.display = "none"
    }

    viewsContainer[viewI].style.display = "block"
    setParam("view", viewI)
}

function setInitialView() {
    let view = parseInt(getParam("view"))
    if (![0, 1, 2].includes(view)) view = 0

    setView(parseInt(view))
    byId("profile-view-buttons").setAttribute("selected", view)
}

async function renderAwards() {
    const awardsDisplay = byId("awards-display")
    const awardsPromise = getRequest(`/users/${getProfileUserId()}/awards`)

    for (let awardId of getAwards()) {
        const tr = createElement("tr", { p: awardsDisplay })
        createElement("td", { c: "title", p: tr, t: getAwardName(awardId) + " Award" })

        // status
        const statusTd = createElement("td", { p: tr })
        const statusTdRow = createElement("div", { c: "row", p: statusTd })
        const loadingElement = createElement("span", { c: "material-icons", p: statusTd, t: LOADING_ICON_TEXT })

        // date
        const dateTd = createElement("td", { p: tr })
        createElement("p", { c: "title", p: dateTd, t: "Date" })
        const dateDisplay = createElement("p", { c: "value", p: dateTd, t: "-" })

        // signer
        const signerTd = createElement("td", { p: tr })
        createElement("p", { c: "title", p: signerTd, t: "Signer" })
        const signerDisplay = createElement("p", { c: "value", p: signerTd, t: "-" })

        awardsPromise.then(res => {
            const { complete, date, signer } = res.awards[awardId] ?? {}
            loadingElement.remove()

            createElement("p", { p: statusTdRow, t: complete ? "Complete" : "Incomplete" })
            createElement("span", { c: "material-icons", p: statusTdRow, t: complete ? "check_box" : "check_box_outline_blank" })

            if (complete) {
                dateDisplay.innerHTML = formatDate(date)
                signerDisplay.innerHTML = signer.titleName
            }
        })
    }
}

async function loadChecklist() {
    const checklistContainer = byId("checklist-container")
    const loadingElement = createElement("p", { p: checklistContainer, t: LOADING_TEXT })

    const { items } = await getRequest(`/users/${getProfileUserId()}/checklist`)
    loadingElement.remove()

    for (let item of items) {
        const itemElement = createElement("div", { c: "item", p: checklistContainer })
        createElement("p", { c: "name", p: itemElement, t: item.name })
        createElement("div", { c: "material-icons", p: itemElement, t: item.complete ? "check_box" : "check_box_outline_blank" })
    }
}

window.addEventListener("load", () => {
    renderAwards()
    setInitialView()
})