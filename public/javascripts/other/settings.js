window.addEventListener("load", () => {
    handleNameSetting()
})

async function handleNameSetting() {
    const nameSetting = byId("name-setting")
    const [, nameDisplay, , editContainer] = nameSetting.children[0].children
    const [titleInput, nameInput, surnameInput, saveButton, cancelButton] = editContainer.children

    let { info } = await getRequest(`/users/${getUserId()}/info`)
    let editing = false

    nameSetting.addEventListener("click", () => {
        if (editing) return
        editing = true

        const { name, surname, title } = info
        let titleSelectedIndex = 0

        if (title === "Mr") {
            titleSelectedIndex = 1
        } else if (title === "Ms") {
            titleSelectedIndex = 2
        } else if (title === "Mrs") {
            titleSelectedIndex = 3
        } else if (title === "Dr") {
            titleSelectedIndex = 4
        }

        titleInput.selectedIndex = titleSelectedIndex
        nameInput.value = name
        surnameInput.value = surname

        nameSetting.classList.remove("highlightable")
        setVisible(nameDisplay, false)
        setVisible(editContainer)
        setVisible("name-notice")
    })

    saveButton.addEventListener("click", async () => {
        nameDisplay.innerHTML = LOADING_TEXT

        setVisible(editContainer, false)
        setVisible("name-notice", false)
        setVisible(nameDisplay)

        const res = await putRequest(`/users/${getUserId()}/info`, {
            name: nameInput.value,
            surname: surnameInput.value,
            title: titleInput.value
        })

        info = res.info

        nameDisplay.innerHTML = info.fullName
        nameSetting.classList.add("highlightable")
        editing = false
    })

    cancelButton.addEventListener("click", () => {
        setVisible(editContainer, false)
        setVisible("name-notice", false)
        setVisible(nameDisplay)
        nameSetting.classList.add("highlightable")
        setTimeout(() => editing = false) // use timeout to prevent simultaneous setting click
    })
}