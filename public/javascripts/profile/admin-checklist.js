async function loadItems() {
    const itemsContainer = byId("items-container")

    const totalCompleteElement = byId("total-complete")
    totalCompleteElement.innerHTML = LOADING_TEXT

    const { items } = await getRequest(`/users/${getProfileUserId()}/checklist`)

    let totalComplete = 0

    for (let item of items) {
        if (item.complete) totalComplete++

        const itemElement = createElement("div", { c: "item", p: itemsContainer })

        const checkbox = createElement("input", { p: itemElement })
        checkbox.type = "checkbox"
        checkbox.checked = item.complete
        checkbox.addEventListener("change", async () => {
            checkbox.disabled = true
            const complete = checkbox.checked

            const { ok } = await putRequest(`/users/${getProfileUserId()}/checklist`, { itemId: item.id, complete })

            if (ok) {
                if (complete) {
                    totalComplete++
                } else {
                    totalComplete--
                }

                totalCompleteElement.innerHTML = `${totalComplete} / ${Object.keys(items).length}`
            } else {
                checkbox.checked = !complete
            }

            checkbox.disabled = false
        })

        createElement("p", { p: itemElement, t: item.name })
    }

    totalCompleteElement.classList.add("total-complete")
    totalCompleteElement.innerHTML = `${totalComplete} / ${Object.keys(items).length}`
}

window.addEventListener("load", () => {
    loadItems()
})