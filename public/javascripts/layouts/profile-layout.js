window.addEventListener("scroll", () => {
    const element = byId("corner-details")

    if (window.scrollY > 100) {
        element.classList.add("scrolled")
    } else {
        element.classList.remove("scrolled")
    }
})