const TYPE_NAMES = {
    team: "Team",
    halfColours: "Half Colours",
    colours: "Colours",
    honours: "Honours"
}

async function load() {
    const container = byId("list-container")
    const loadingElement = createElement("p", { p: container, t: LOADING_TEXT })

    const { newAwards } = await getRequest("/admin/new-awards")
    loadingElement.remove()

    for (let id in newAwards) {
        const a = newAwards[id]
        const nameElement = createElement("p", { p: container, t: a.user.fullName })
        const dateElement = createElement("p", { p: container, t: formatDate(a.date) })
        const typeElement = createElement("p", { p: container, t: TYPE_NAMES[a.type] })

        let clearing = false

        createElement("button", {
            c: "primary", p: container, t: "Clear", onClick: async (_, b) => {
                if (clearing) return
                clearing = true
                b.classList.add("disabled")

                const { ok } = await deleteRequest("/admin/new-awards", { id })

                if (ok) {
                    nameElement.remove()
                    dateElement.remove()
                    typeElement.remove()
                    b.remove()
                }
            }
        })
    }
}

window.addEventListener("load", load)