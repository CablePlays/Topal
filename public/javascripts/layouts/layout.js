window.addEventListener("load", () => {

    /* Log Out */

    byId("logout-button").addEventListener("click", () => {
        logOut()
        location.href = "/signin"
    })

    /* Search */

    const searchInput = byId("search-input")

    function search() {
        const query = searchInput.value.trim()

        if (query.length > 0) {
            window.location.href = "/search?query=" + query
        }
    }

    searchInput.addEventListener("keydown", e => {
        if (e.key == "Enter") {
            search()
        }
    })

    byId("search-icon").addEventListener("click", search)

    /* Sidebar */

    const sidebarIcon = byId("sidebar-icon")
    const sidebar = byId("sidebar")
    let sidebarVisible = false

    sidebarIcon.addEventListener("click", () => {
        sidebarVisible = !sidebarVisible

        if (sidebarVisible) {
            sidebarIcon.classList.add("active")
            sidebar.classList.add("visible")
        } else {
            sidebarIcon.classList.remove("active")
            sidebar.classList.remove("visible")
        }
    })
})