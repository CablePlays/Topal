window.addEventListener("load", () => {

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
})