const ADD_BUTTON_ICON = "add_circle"

window.addEventListener("load", () => {
    loadAwards()
})

function loadAwards() {
    const awardsContainer = byId("awards-container")
    const micsPromise = getRequest("/awards/mics")

    for (let awardId of getFirstLevelAwards()) {
        const awardElement = createElement("div", { c: "award", p: awardsContainer })
        createElement("h2", { p: awardElement, t: getAwardName(awardId) })

        const micsContainer = createElement("div", { c: "mics-container", p: awardElement })
        const loadingElement = createElement("p", { p: micsContainer, t: LOADING_TEXT })

        function addMic(name) {
            createElement("p", { p: micsContainer, t: name })
            createElement("div", {
                c: "material-icons pointer", p: micsContainer, t: "delete", onClick: async (_, e) => {
                    e.innerHTML = LOADING_ICON_TEXT
                    e.classList.remove("pointer")

                    const { ok } = await deleteRequest(`/awards/mics/${awardId}`, { mic: name })

                    if (ok) {
                        e.previousElementSibling.remove()
                        e.remove()
                    }
                }
            })
        }

        micsPromise.then(res => {
            loadingElement.remove()

            const { mics } = res
            const awardMics = mics[awardId] ?? []

            for (let mic of awardMics) {
                addMic(mic)
            }

            // add option

            const createContainer = createElement("div", { c: "create-container", p: awardElement })
            const inputElement = createElement("input", { p: createContainer })

            let debounce = false

            createElement("div", {
                c: "material-icons pointer", p: createContainer, t: ADD_BUTTON_ICON, onClick: async (_, e) => {
                    if (debounce) return
                    debounce = true

                    const val = inputElement.value
                    inputElement.value = null

                    e.innerHTML = LOADING_ICON_TEXT
                    e.classList.remove("pointer")

                    const { ok, mic } = await postRequest(`/awards/mics/${awardId}`, { mic: val })
                    if (!ok) return

                    e.innerHTML = ADD_BUTTON_ICON
                    e.classList.add("pointer")

                    addMic(mic)
                    debounce = false
                }
            })
        })
    }
}