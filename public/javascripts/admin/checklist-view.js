function handleBulkUpdate() {
    const enableButton = byId("bulk-update-enable")
    const disableButton = byId("bulk-update-disable")
    const selectElement = byId("bulk-update-select")
    const infoElement = byId("bulk-update-info")

    let initialEnable = true

    function setButtonsEnabled(enabled) {
        for (let v of [enableButton, disableButton]) {
            v.disabled = !enabled

            if (enabled) {
                v.classList.remove("disabled")
            } else {
                v.classList.add("disabled")
            }
        }
    }

    function getOnClickHandler(setEnabled) {
        return async () => {
            const grade = parseInt(selectElement.value)
            setButtonsEnabled(false)
            setInfoText(null)

            const { ok } = await putRequest("/admin/checklist/enabled", { enabled: setEnabled, grade })

            if (ok) {
                setInfoText(`The checklists of all grade ${grade} students are now ${setEnabled ? "enabled" : "disabled"}.`)
            } else {
                setInfoText("The checklists could not be updated. Please try again.")
            }

            loadUsers()
            setButtonsEnabled(true)
        }
    }

    function setInfoText(text) {
        setVisible(infoElement, text != null)
        infoElement.innerHTML = text
    }

    enableButton.addEventListener("click", getOnClickHandler(true))
    disableButton.addEventListener("click", getOnClickHandler(false))
    selectElement.addEventListener("change", () => {
        if (initialEnable) {
            initialEnable = false
            setButtonsEnabled(true)
        }
    })
}

function getOrderedUsers(users) {
    const usersArr = []

    for (let userId in users) {
        const { info } = users[userId]
        usersArr.push({ id: userId, name: info.fullName, grade: info.grade })
    }

    return usersArr.sort((a, b) => {
        const c = a.grade - b.grade
        return (c === 0) ? a.name.localeCompare(b.name) : c
    }).map(v => v.id)
}

async function loadUsers() {
    const usersContainer = byId("users-container")
    usersContainer.innerHTML = null

    const loadingElement = createElement("p", { c: "plr16", p: usersContainer, t: LOADING_TEXT })

    const { items, users } = await getRequest("/admin/checklist/users")
    let totalUsers = Object.keys(users).length

    loadingElement.remove()

    function addNoUsersElement() {
        createElement("p", { c: "plr16", p: usersContainer, t: "No users." })
    }

    if (totalUsers === 0) {
        addNoUsersElement()
    } else {
        loadingElement.remove()

        for (let userId of getOrderedUsers(users)) {
            const { completed, info } = users[userId]
            let totalCompleted = 0

            for (let c of completed) {
                // use find in case user has non-existing item
                if (items.find(v => v.id === c)) totalCompleted++
            }

            const userElement = createElement("div", { c: "user", p: usersContainer })

            let disableDebounce = false

            const infoContainer = createElement("div", { c: "info", p: userElement })
            createElement("p", { c: "name", p: infoContainer, t: info.fullName })
            createElement("p", { p: infoContainer, t: (info.grade > 12) ? "Matriculated" : "Grade " + info.grade })
            const amountElement = createElement("p", { c: "amount", p: infoContainer, t: `${totalCompleted} / ${items.length}` })
            createElement("button", {
                c: "primary", p: infoContainer, t: "Disable Checklist", onClick: async (_, e) => {
                    if (disableDebounce) return
                    disableDebounce = true

                    e.classList.add("disabled")

                    const { ok } = await putRequest(`/users/${userId}/checklist/enabled`, { enabled: false })

                    if (ok) {
                        userElement.remove()
                        if (--totalUsers === 0) addNoUsersElement()
                    } else {
                        e.classList.remove("disabled")
                        disableDebounce = false
                    }
                }
            })

            const itemsElement = createElement("div", { c: "items", p: userElement })

            for (let item of items) {
                const { id, name } = item

                const checkbox = createElement("input", { p: itemsElement })
                checkbox.type = "checkbox"
                checkbox.checked = completed.includes(id)
                checkbox.addEventListener("change", async () => {
                    checkbox.disabled = true

                    const complete = checkbox.checked
                    const { ok } = await putRequest(`/users/${userId}/checklist`, { itemId: id, complete })

                    if (ok) {
                        if (complete) {
                            totalCompleted++
                        } else {
                            totalCompleted--
                        }

                        amountElement.innerHTML = `${totalCompleted} / ${items.length}`
                    } else {
                        checkbox.checked = !complete
                    }

                    checkbox.disabled = false
                })

                createElement("p", { p: itemsElement, t: name })
            }
        }
    }
}

window.addEventListener("load", () => {
    handleBulkUpdate()
    loadUsers()
})