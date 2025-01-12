let checklistItemsContainer
let savedChecklistItems
let currentChecklistItems
let draggedItem = null
let saving = false

function getChecklistItemByElement(element) {
    const linkId = element.getAttribute("data-link")

    for (let item of currentChecklistItems) {
        if (item.link == linkId) {
            return item
        }
    }

    return null
}

function setSaveInfoText(text) {
    byId("save-info").innerHTML = text
}

function setSaveButtonVisible(visible = true) {
    setSaveInfoText(null)
    setVisible("unsaved-changes-container", visible)
}

function updateChecklistItems() {
    let linkId = 0
    checklistItemsContainer.innerHTML = ""

    for (let item of currentChecklistItems) {
        item.link = linkId

        const itemElement = createElement('div', { c: 'checklist-item', p: checklistItemsContainer })
        itemElement.setAttribute("data-link", linkId++)
        itemElement.setAttribute("draggable", "true")

        createElement('div', { c: "material-icons reorder-icon", p: itemElement, t: "reorder" })
        const itemName = createElement('p', { p: itemElement, t: item.name })

        const iconsContainer = createElement('div', { c: 'icons-container', p: itemElement })
        createElement('div', {
            c: "material-icons", p: iconsContainer, t: "edit", onClick: () => {
                setVisible(itemName, false)
                setVisible(iconsContainer, false)

                const nameInput = createElement("input", { p: itemElement })
                nameInput.type = "text"
                nameInput.placeholder = "New name"

                const saveButton = createElement("div", {
                    c: "material-icons save-name-button", p: itemElement, t: "check_circle", onClick: () => {
                        const name = nameInput.value.trim()

                        if (name.replaceAll(" ", "").length === 0) {
                            nameInput.placeholder = "Name cannot be blank!"
                            nameInput.value = ""
                            return
                        }

                        const item = getChecklistItemByElement(itemElement)
                        item.name = name

                        nameInput.remove()
                        saveButton.remove()

                        itemName.innerHTML = name
                        setVisible(itemName)
                        setVisible(iconsContainer)

                        setSaveButtonVisible(true)
                    }
                })
            }
        })
        createElement('div', {
            c: "material-icons", p: iconsContainer, t: "delete", onClick: () => {
                currentChecklistItems = currentChecklistItems.filter(v => v !== item)
                updateChecklistItems()
                setSaveButtonVisible()
            }
        })
    }
}

async function loadChecklistItems() {
    checklistItemsContainer.innerHTML = LOADING_TEXT
    const { items } = await getRequest("/admin/checklist")
    savedChecklistItems = items
    currentChecklistItems = structuredClone(items)
    updateChecklistItems()
}

function makeDraggable() {
    checklistItemsContainer.addEventListener("dragstart", e => {
        draggedItem = e.target

        setTimeout(() => {
            e.target.style.display = "none"
        })
    })

    checklistItemsContainer.addEventListener("dragend", e => {
        e.target.style.display = ""
        draggedItem = null

        const children = [...checklistItemsContainer.children]
        const newChecklistItems = []

        for (let child of children) {
            newChecklistItems.push(getChecklistItemByElement(child))
        }

        currentChecklistItems = newChecklistItems
        setSaveButtonVisible()
    })

    checklistItemsContainer.addEventListener("dragover", e => {
        e.preventDefault()

        const afterElement = getDragAfterElement(e.clientY)

        if (afterElement == null) {
            checklistItemsContainer.appendChild(draggedItem)
        } else {
            checklistItemsContainer.insertBefore(draggedItem, afterElement)
        }
    })

    const getDragAfterElement = y => {
        const draggableElements = [...checklistItemsContainer.children]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2

            if (offset < 0 && offset > closest.offset) {
                return {
                    offset,
                    element: child,
                }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }
}

function handleCreateNew() {
    byId("create-button").addEventListener("click", () => {
        const input = byId("create-input")
        const name = input.value.trim()

        if (name.replaceAll(" ", "").length === 0) {
            input.placeholder = "Name cannot be blank!"
        } else {
            input.placeholder = "Item name"
            currentChecklistItems.push({ name: name })
            updateChecklistItems()
            setSaveButtonVisible()
        }

        input.value = ""
    })
}

function setChangesButtonsDisabled(disabled) {
    if (disabled) {
        byId("save-button").classList.add("disabled")
        byId("cancel-button").classList.add("disabled")
    } else {
        byId("save-button").classList.remove("disabled")
        byId("cancel-button").classList.remove("disabled")
    }
}

function handleSaveButton() {
    byId("save-button").addEventListener("click", async () => {
        if (saving) return
        saving = true

        setSaveInfoText(null)
        setChangesButtonsDisabled(true)

        const current = [...currentChecklistItems]
        const { ok, items: newItems } = await putRequest("/admin/checklist", { items: current })

        if (ok) {
            currentChecklistItems = newItems
            savedChecklistItems = structuredClone(newItems)
            updateChecklistItems() // in case user makes changes during saving
            setSaveButtonVisible(false)
            setSaveInfoText("Changes saved.")
        } else {
            setSaveInfoText("Could not save. Please try again.")
        }

        saving = false
        setChangesButtonsDisabled(false)
    })
}

function handleCancelButton() {
    byId("cancel-button").addEventListener("click", () => {
        if (saving) return

        currentChecklistItems = structuredClone(savedChecklistItems)
        updateChecklistItems()
        setSaveButtonVisible(false)
        setSaveInfoText(null)
    })
}

window.addEventListener("load", () => {
    checklistItemsContainer = byId("checklist-items-container")
    loadChecklistItems()
    makeDraggable()
    handleCreateNew()
    handleSaveButton()
    handleCancelButton()
})