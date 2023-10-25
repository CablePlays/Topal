window.addEventListener("load", () => {
    loadUsers()
})

function createCard(userInfo, requests) {
    const { fullName, grade, id } = userInfo

    const container = createElement("div", { c: "request", onClick: openLinkOnClick(`/profile/${id}/admin`) })
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
    const requestsElement = byId("requests")
    const loadingElement = createElement("p", { p: requestsElement, t: LOADING_TEXT })

    const { users } = await getRequest("/admin/requests")
    const userIds = Object.keys(users)

    if (userIds.length === 0) {
        loadingElement.innerHTML = "No requests."
    } else {
        loadingElement.remove()

        for (let userId of userIds) {
            const { info, requests } = users[userId]
            const card = createCard(info, requests)
            requestsElement.appendChild(card)
        }
    }
}