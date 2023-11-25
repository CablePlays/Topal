const filterSelection = [] // stores selected filter optinos
const usersStorage = [] // stores user card & array of request types

window.addEventListener("load", () => {
    handleFilter()
    loadUsers()
})

function updateFilter() {
    let totalShowing = 0

    for (let u of usersStorage) {
        const { card, requests } = u
        let show = false

        if (filterSelection.length === 0) {
            show = true
        } else {
            for (let filterAwardId of filterSelection) {
                if (requests.findIndex(requestAwardId => (filterAwardId === "mountaineering") && ["drakensberg", "summit", "traverse"].includes(requestAwardId)
                    || requestAwardId.startsWith(filterAwardId)) !== -1) {
                    show = true
                    break
                }
            }
        }

        if (show) totalShowing++
        setVisible(card, show)
    }

    setVisible("no-requests-indicator", totalShowing === 0)
}

function handleFilter() {
    const filterDropdown = byId("filter-dropdown")

    function createOption(awardId, awardName) {
        const optionId = "filter-option-" + awardId
        
        const p = createElement("label", { p: filterDropdown, t: awardName })
        p.setAttribute("for", optionId)

        const input = createElement("input", { p: filterDropdown })
        input.id = optionId
        input.type = "checkbox"
        input.addEventListener("input", () => {
            if (input.checked) {
                filterSelection.push(awardId)
            } else {
                filterSelection.splice(filterSelection.indexOf(awardId), 1)
            }

            updateFilter()
        })
    }

    createOption("mountaineering", "Mountaineering")

    for (let awardId of getFirstLevelAwards()) {
        if (!["drakensberg", "summit", "traverse"].includes(awardId)) {
            createOption(awardId, getAwardName(awardId))
        }
    }
}

function createCard(userInfo, requests) {
    const { fullName, grade, id } = userInfo

    const container = createElement("div", { c: "user", onClick: openLinkOnClick(`/profile/${id}/admin`) })
    createElement("img", { p: container }).src = userInfo.profilePicture
    createElement("p", { c: "name", p: container, t: fullName })
    createElement("p", { c: "grade", p: container, t: grade == null ? "" : (grade > 12 ? "Matriculated" : "Grade " + grade) })

    const requestInfoContainer = createElement("div", { c: "types", p: container })

    for (let awardId of Object.keys(requests).sort()) {
        const requestCount = requests[awardId]
        createElement("p", { p: requestInfoContainer, t: getAwardName(awardId) + ":" })
        createElement("p", { c: "number", p: requestInfoContainer, t: requestCount })
    }

    return container
}

async function loadUsers() {
    const usersContainer = byId("users")
    const loadingElement = createElement("p", { p: usersContainer, t: LOADING_TEXT })

    const { users } = await getRequest("/admin/requests")
    const userIds = Object.keys(users)

    loadingElement.remove()

    for (let userId of userIds) {
        const { info, requests } = users[userId]
        const card = createCard(info, requests)
        usersContainer.appendChild(card)

        usersStorage.push({
            card,
            requests: Object.keys(requests)
        })
    }

    updateFilter()
}