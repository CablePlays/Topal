let doingSearch = false

window.addEventListener("load", () => {
    byId("loading-indicator").innerHTML = LOADING_TEXT

    const query = getParam("query")
    setParam("query", null)
    doSearch(query ?? "12")

    setupSearchListeners()
})

function setupSearchListeners() {
    const searchBarInput = byId("search-bar-input")

    function searchUsingInput() {
        const query = searchBarInput.value.trim()
        if (query !== "") doSearch(query)
    }

    searchBarInput.addEventListener("keydown", e => {
        if (e.key == "Enter") searchUsingInput()
    })

    byId("search-bar-icon").addEventListener("click", searchUsingInput)
}

function createCard(result) {
    const { id, name, grade, profilePicture } = result
    const containerElement = createElement("div", { c: "card" })

    createElement("img", { c: "profile-picture", p: containerElement }).src = profilePicture
    createElement("p", { c: "name", p: containerElement, t: name })
    createElement("p", { c: "grade", p: containerElement, t: grade && "Grade " + grade })
    createElement("a", { p: containerElement, t: "Profile" }).href = `/profile/${id}`

    return containerElement
}

async function doSearch(query) {
    if (doingSearch) return
    doingSearch = true

    const resultsElement = byId("results")
    resultsElement.innerHTML = null
    setVisible("bottom-block", false)

    setVisible("loading-indicator")
    const { results } = await getRequest(`/users/search?query=${query}`)
    setVisible("loading-indicator", false)

    for (let result of results) {
        const card = createCard(result)
        resultsElement.appendChild(card)
    }

    setVisible("bottom-block")
    doingSearch = false
}