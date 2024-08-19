function handleUpdateButton() {
    const button = byId("update-button")
    const houses = byId("houses")

    button.addEventListener("click", async () => {
        button.disabled = true
        setVisible("update-error", false)
        setVisible("update-success", false)

        const points = {}

        for (let houseElement of houses.children) {
            const housePoints = parseInt(houseElement.children[1].value)
            points[houseElement.getAttribute("data-house-id")] = housePoints ?? 0
        }

        const { ok } = await putRequest("/admin/house-points", points)

        setVisible("update-" + (ok ? "success" : "error"))
        button.disabled = false
    })
}

function handleVisibilityCheckbox() {
    const checkbox = byId("visibility-checkbox")
    const visibilityError = byId("visibility-error")

    checkbox.addEventListener("input", async () => {
        const checked = checkbox.checked

        checkbox.disabled = true
        setVisible(visibilityError, false)

        const { ok } = await putRequest("/admin/house-points/visible", { visible: checked })

        if (!ok) {
            checkbox.checked = !checked
            setVisible(visibilityError)
        }

        checkbox.disabled = false
    })
}

window.addEventListener("load", () => {
    handleUpdateButton()
    handleVisibilityCheckbox()
})