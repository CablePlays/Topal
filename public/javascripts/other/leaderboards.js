window.addEventListener("load", () => {
    setupSidebar()
    generateLeaderboards()
})

function setupSidebar() {
    const toggleIcon = byId("leaderboards-sidebar-icon")
    const sidebar = byId("leaderboards-sidebar")

    toggleIcon.addEventListener("click", () => {
        let open = !toggleIcon.classList.contains("active")

        if (open) {
            toggleIcon.classList.add("active")
            sidebar.classList.add("open")
        } else {
            toggleIcon.classList.remove("active")
            sidebar.classList.remove("open")
        }
    })
}

async function generateLeaderboards() {
    const leaderboardsContainer = byId("leaderboards-container")
    const leaderboardSelection = byId("leaderboard-selection")
    const leaderboardTemplate = byId("leaderboard-template")
    const viewportSlider = byId("viewport-slider")

    const loadingElement = createElement("p", { c: "loading", p: leaderboardsContainer, t: LOADING_TEXT })

    const dataPromise = getRequest("/users/leaderboards")
    let loaded = false
    dataPromise.then(() => {
        loadingElement.remove()
        setVisible(viewportSlider)
        loaded = true
    })

    const leaderboards = [
        // "OP Awards",
        ["totalAwards", "Total Awards", v => "award" + (v === 1 ? "" : "s")],
        ["firstLevelAwards", "First-Level Awards", v => "award" + (v === 1 ? "" : "s")],
        ["distanceRun", "Distance Run", v => "distance", v => round(v / 1000, 1) + "km"],
        ["distancePaddled", "Distance Paddled", v => "distance", v => round(v / 1000, 1) + "km"],
        ["distanceSwum", "Distance Swum", v => "distance", v => v + "m"],
        ["elevationGained", "Elevation Gained", v => "elevation", v => v + "m"],
        ["serviceHours", "Service Hours", v => "hour" + (v === 1 ? "" : "s"), v => round(v / 3600, 1)],
        ["earliestAccounts", "Earliest Accounts"]
    ]

    let selected = 0

    function upadateSelected() {
        const width = leaderboardsContainer.clientWidth

        for (let leaderboardView of viewportSlider.children) {
            leaderboardView.style.width = width + "px"
        }

        viewportSlider.style.transform = `translateX(-${selected * width}px)`
    }

    for (let i = 0; i < leaderboards.length; i++) {
        const [leaderboardId, leaderboardName, leaderboardTypeFunction, formatter] = leaderboards[i]
        const leaderboardView = createElement("div", { p: viewportSlider })

        const podiumElement = leaderboardTemplate.content.cloneNode(true).children[0]
        const [silver, gold, bronze] = podiumElement.children

        leaderboardView.appendChild(podiumElement)

        const selector = createElement("button", {
            p: leaderboardSelection, t: leaderboardName, onClick: () => {
                if (!loaded) return

                selected = i
                upadateSelected()

                for (let o of leaderboardSelection.children) {
                    o.classList.remove("selected")
                }

                selector.classList.add("selected")
            }
        })
        createElement("div", { c: "underline", p: selector })

        dataPromise.then(res => {
            const { data } = res
            const leaderboardData = data[leaderboardId]

            if (formatter) {
                for (let d of leaderboardData) {
                    d.value = formatter(d.value)
                }
            }

            loadSwallowtail(gold, leaderboardData[0], leaderboardTypeFunction)
            loadSwallowtail(silver, leaderboardData[1], leaderboardTypeFunction)
            loadSwallowtail(bronze, leaderboardData[2], leaderboardTypeFunction)

            const cards = generateCards(leaderboardData, leaderboardTypeFunction)
            leaderboardView.appendChild(cards)

            if (i === selected) {
                selector.classList.add("selected")
            }
        })
    }

    upadateSelected()
    window.addEventListener("resize", upadateSelected)
}

function formatGrade(grade) {
    return grade && (grade > 12 ? "Matriculated" : "Grade " + grade)
}

function loadSwallowtail(swalllowtail, data, typeLabel) {
    const available = (data != null)

    const { user, value } = data ?? {}
    const { id, grade, profilePicture } = user ?? {}
    const [, , profilePictureElement, nameElement, gradeElement, valueElement, typeElement] = swalllowtail.children

    profilePictureElement.src = available ? profilePicture : DEFAULT_PROFILE_PICTURE_PATH
    nameElement.innerHTML = available ? user.titleName : MISSING_TEXT
    valueElement.innerHTML = available ? value : "-"

    if (available) {
        profilePictureElement.addEventListener("click", openLinkOnClick(`/profile/${id}`))
        gradeElement.innerHTML = formatGrade(grade)
        if (typeLabel) typeElement.innerHTML = typeLabel(value)
    }
}

function generateCards(leaderboardData, typeLabel) {
    const cardsContainer = createElement("div", { c: "cards" })

    for (let i = 3; i < leaderboardData.length; i++) {
        const { user, value } = leaderboardData[i]
        const { id: userId, grade, profilePicture, titleName } = user
        const card = createElement("div", { c: "card", p: cardsContainer })
        createElement("img", { c: "background", p: card }).src = "/assets/pages/leaderboards/parms.svg"

        const contentContainer = createElement("div", { c: "content-container", p: card })
        const topContainer = createElement("div", { c: "top-container", p: contentContainer })

        createElement("p", { c: "position", p: topContainer, t: (i + 1).toString().padStart(2, "0") })
        createElement("img", { c: "profile-picture", p: topContainer, onClick: openLinkOnClick(`/profile/${userId}`) }).src = profilePicture

        const detailsElement = createElement("div", { c: "details", p: topContainer })
        createElement("p", { c: "name", p: detailsElement, t: titleName })
        createElement("p", { c: "grade", p: detailsElement, t: formatGrade(grade) })

        const bottomContainer = createElement("div", { c: "bottom-container", p: contentContainer })

        const starsContainer = createElement("div", { c: "stars", p: bottomContainer })
        const starCount = Math.ceil((leaderboardData.length - i) / leaderboardData.length * 5)
        for (let i = 0; i < 5; i++) {
            createElement("img", { p: starsContainer }).src = i < starCount ? "/assets/pages/leaderboards/star-full.svg" : "/assets/pages/leaderboards/star-empty.svg"
        }

        const typeValueElement = createElement("div", { c: "type-value", p: bottomContainer })
        createElement("p", { c: "value", p: typeValueElement, t: value })
        if (typeLabel) createElement("p", { c: "type", p: typeValueElement, t: typeLabel(value) })
    }

    for (let x = 0; x < Math.random() * 100; x++) {
        let i = 0
        const { user, value } = leaderboardData[i]
        const { id: userId, grade, profilePicture, titleName } = user
        const card = createElement("div", { c: "card", p: cardsContainer })
        createElement("img", { c: "background", p: card }).src = "/assets/pages/leaderboards/parms.svg"

        const contentContainer = createElement("div", { c: "content-container", p: card })
        const topContainer = createElement("div", { c: "top-container", p: contentContainer })

        createElement("p", { c: "position", p: topContainer, t: (x + 1).toString().padStart(2, "0") })
        createElement("img", { c: "profile-picture", p: topContainer, onClick: openLinkOnClick(`/profile/${userId}`) }).src = profilePicture

        const detailsElement = createElement("div", { c: "details", p: topContainer })
        createElement("p", { c: "name", p: detailsElement, t: titleName })
        createElement("p", { c: "grade", p: detailsElement, t: formatGrade(grade) })

        const bottomContainer = createElement("div", { c: "bottom-container", p: contentContainer })

        const starsContainer = createElement("div", { c: "stars", p: bottomContainer })
        const starCount = Math.ceil((leaderboardData.length - i) / leaderboardData.length * 5)
        for (let i = 0; i < 5; i++) {
            createElement("img", { p: starsContainer }).src = i < starCount ? "/assets/pages/leaderboards/star-full.svg" : "/assets/pages/leaderboards/star-empty.svg"
        }

        const typeValueElement = createElement("div", { c: "type-value", p: bottomContainer })
        createElement("p", { c: "value", p: typeValueElement, t: value })
        if (typeLabel) createElement("p", { c: "type", p: typeValueElement, t: typeLabel(value) })
    }

    return cardsContainer
}