const _loadedUserIds = []

window.addEventListener("load", () => {
    loadUsers()
    handleAddUserButton()
})

function createUserCard(userInfo, permissions) {
    const { id: userId } = userInfo
    _loadedUserIds.push(userId)

    const container = createElement("div", { c: "user" })
    createElement("img", { p: container }).src = userInfo.profilePicture

    const infoContainer = createElement("div", { p: container })
    createElement("p", { p: infoContainer, t: userInfo.fullName })
    createElement("p", { c: "email", p: infoContainer, t: userInfo.email })

    const permissionsContainer = createElement("div", { c: "permissions", p: container })
    const otherCheckboxes = {} // checkboxes which are not managePermission checkbox

    function setOtherCheckboxesDisabled(disabled) {
        for (let permissionId in otherCheckboxes) {
            otherCheckboxes[permissionId].disabled = disabled
        }
    }

    for (let permissionId of getPermissions()) {
        const permissionContainer = createElement("div", { p: permissionsContainer })
        createElement("p", { p: permissionContainer, t: getPermissionName(permissionId) })

        const checkboxElement = createElement("input", { p: permissionContainer })
        checkboxElement.type = "checkbox"
        checkboxElement.checked = permissions[permissionId]
        checkboxElement.addEventListener("input", () => {
            const permissionsObj = { [permissionId]: checkboxElement.checked }
            putRequest(`/users/${userId}/permissions`, { permissions: permissionsObj })
        })

        if (permissionId === "managePermissions") {
            checkboxElement.addEventListener("input", () => {
                setOtherCheckboxesDisabled(checkboxElement.checked)
            })
        } else {
            otherCheckboxes[permissionId] = checkboxElement
        }
    }

    setOtherCheckboxesDisabled(permissions.managePermissions)
    return container
}

async function loadUsers() {
    const usersContainer = byId("users")
    usersContainer.innerHTML = LOADING_TEXT

    const { users } = await getRequest(`/users/permissions`)
    const userId = getUserId()

    usersContainer.innerHTML = null

    for (let user of users) {
        const { info, permissions } = user

        if (info.id !== userId) {
            const cardElement = createUserCard(info, permissions)
            usersContainer.appendChild(cardElement)
        }
    }
}

function handleAddUserButton() {
    const addUserInfoContainer = byId("add-user-info-container")
    const addUserInfo = addUserInfoContainer.children[0]

    function setInfoText(text) {
        if (text) {
            addUserInfo.innerHTML = text
            setVisible(addUserInfoContainer)
        } else {
            setVisible(addUserInfoContainer, false)
        }
    }

    const addUserElement = byId("add-user")
    const addUserInputElement = byId("add-user-input")
    addUserElement.addEventListener("click", () => {
        setVisible(addUserElement, false)
        setVisible(addUserInputElement)
    })

    const addButton = byId("add-button")

    addButton.addEventListener("click", async () => {
        setVisible(addButton, false)
        setInfoText("Please wait...")

        const userInputElement = byId("user-input")
        const userEmail = userInputElement.value

        const { error, info, permissions } = await getRequest(`/users/permissions/user?email=${userEmail}`)

        if (error === "invalid_user") {
            setInfoText("Invalid user.")
        } else if (_loadedUserIds.includes(info.id)) {
            setInfoText("That user is alreay in the list!")
        } else {
            setVisible(addUserInputElement, false)
            setVisible(addUserElement)
            userInputElement.value = null
            setInfoText(null)

            const card = createUserCard(info, permissions)
            byId("users").insertAdjacentElement("afterbegin", card)
        }

        setVisible(addButton)
    })
}