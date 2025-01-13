async function loadItems() {
    const totalCompleteElement = byId("total-complete")
    totalCompleteElement.innerHTML = LOADING_TEXT

    let { enabled, items } = await getRequest(`/users/${getProfileUserId()}/checklist`)

    const itemsContainer = byId("items-container")

    function updateChecklistVisibility() {
        setVisible(totalCompleteElement, enabled)
        setVisible(itemsContainer, enabled)
    }

    updateChecklistVisibility()

    const checklistEnabledButton = byId("checklist-enabled-button")
    checklistEnabledButton.innerHTML = enabled ? "Disable Checklist" : "Enable Checklist"
    setVisible(checklistEnabledButton)
    let setEnabledDebounce = false

    checklistEnabledButton.addEventListener("click", async () => {
        if (setEnabledDebounce) return
        setEnabledDebounce = true
        checklistEnabledButton.classList.add("disabled")

        const newEnabled = !enabled
        const { ok } = await putRequest(`/users/${getProfileUserId()}/checklist/enabled`, { enabled: newEnabled })

        if (ok) {
            enabled = newEnabled
            checklistEnabledButton.innerHTML = enabled ? "Disable Checklist" : "Enable Checklist"
            updateChecklistVisibility()
        }

        checklistEnabledButton.classList.remove("disabled")
        setEnabledDebounce = false
    })

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