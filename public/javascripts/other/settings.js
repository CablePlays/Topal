window.addEventListener("load", () => {
    handleTitleSetting()
})

function handleSignoutButtonClicked() {
    logOut()
    location.href = "/"
}

async function handleTitleSetting() {
    const titleSetting = byId("title-setting")
    const [, titleDisplay, , inputContainer] = titleSetting.children
    const [titleInput, saveButton, cancelButton] = inputContainer.children

    let { info: { title = "None" } } = await getRequest(`/users/${getUserId()}/info`)
    let editing = false

    titleSetting.addEventListener("click", () => {
        if (editing) return
        editing = true

        titleInput.value = title
        titleSetting.classList.remove("highlightable")
        setVisible(titleDisplay, false)
        setVisible(inputContainer)
    })

    saveButton.addEventListener("click", async () => {
        titleDisplay.innerHTML = LOADING_TEXT

        setVisible(inputContainer, false)
        setVisible(titleDisplay)

        title = titleInput.value
        await putRequest(`/users/${getUserId()}/info/title`, { title })

        titleDisplay.innerHTML = title
        titleSetting.classList.add("highlightable")
        editing = false
    })

    cancelButton.addEventListener("click", () => {
        setVisible(inputContainer, false)
        setVisible(titleDisplay)
        titleSetting.classList.add("highlightable")
        setTimeout(() => editing = false) // use timeout to prevent simultaneous setting click
    })
}