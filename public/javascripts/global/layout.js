window.addEventListener("load", () => {

    /* Logo */

    byId("logo").addEventListener("click", () => {
        window.location.href = "/"
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

    /* Sign In */

    byId("sign-in-button").addEventListener("click", () => {
        document.cookie = "user_id=1"
        document.cookie = "session_token=abc"
        location.reload()
    })
})