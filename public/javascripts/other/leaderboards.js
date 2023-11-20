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

function generateLeaderboards() {
    const leaderboardsContainer = byId("leaderboards-container")
    const leaderboardSelection = byId("leaderboard-selection")
    const leaderboardTemplate = byId("leaderboard-template")

    const leaderboards = [
        "OP Awards",
        "Total Awards",
        "First-Level Awards",
        "Distance Run",
        "Distance Paddled",
        "Distance Swum",
        "Elevation Gained",
        "Service Hours",
        "Earliest Accounts"
    ]

    for (let i = 0; i < leaderboards.length; i++) {
        const leaderboard = leaderboards[i]
        const leaderboardView = leaderboardTemplate.content.cloneNode(true).children[0]
        if (i > 0) setVisible(leaderboardView, false)
        leaderboardsContainer.appendChild(leaderboardView)

        const selector = createElement("button", {
            p: leaderboardSelection, t: leaderboard, onClick: () => {
                for (let o of leaderboardSelection.children) {
                    o.classList.remove("selected")
                }
                for (let leaderboardView of leaderboardsContainer.children) {
                    setVisible(leaderboardView, false)
                }

                selector.classList.add("selected")
                setVisible(leaderboardView)
            }
        })
        if (i === 0) selector.classList.add("selected")
        createElement("div", { c: "underline", p: selector })
    }
}