function createSlideshow(slidesPromise, period, options) {
    const requiresLoading = slidesPromise instanceof Promise
    const { arrows, loadingSlide } = options ?? {}
    const slideClass = "slide"

    /* Slideshow */

    const slideshow = createElement("div", { c: "slideshow" })
    const slideContainer = createElement("div", { c: "slide-container", p: slideshow })

    if (requiresLoading) {
        loadingSlide.classList.add(slideClass)
        slideContainer.appendChild(loadingSlide)
    }

    /* Load */

    new Promise(async r => {
        r(await slidesPromise)
    }).then(slides => {
        if (slides.length === 0) {
            throw new Error("No slides provided for slideshow")
        }

        const indicators = []
        let current = 0
        let resolve = () => { }

        if (requiresLoading) {
            loadingSlide.remove()
        }

        const update = indicator => {
            const width = slideshow.clientWidth

            if (indicator) {
                indicators.forEach(indicator => indicator.classList.remove("selected"))
                indicators[current].classList.add("selected")
            }

            slideContainer.style.transform = `translate(-${current * width}px)`
        }

        window.addEventListener("resize", () => update(false))

        /* Slides */

        slides.forEach(slide => {
            slide.classList.add(slideClass)
            slideContainer.appendChild(slide)
        })

        /* Indicators */

        const indicatorContainer = createElement("div", { c: "indicator-container", p: slideshow })

        for (let i = 0; i < slides.length; i++) {
            const indicator = createElement("div", { c: "indicator", p: indicatorContainer, onClick: () => resolve(i) })
            indicators.push(indicator)
        }

        update(true)

        /* Cycle */

        const goPrevious = () => {
            resolve(current === 0 ? slides.length - 1 : current - 1)
        }

        const getNext = () => (current === slides.length - 1) ? 0 : current + 1

        const goNext = () => {
            resolve(getNext())
        }

        /* Arrows */

        if (arrows) {
            const { next, previous } = arrows

            if (next) {
                next.addEventListener("click", goNext)
                slideshow.appendChild(next)
            }
            if (previous) {
                previous.addEventListener("click", goPrevious)
                slideshow.appendChild(previous)
            }
        }

        /* Timer */

        setTimeout(async () => {
            while (true) {
                current = await new Promise(r => {
                    resolve = r
                    setTimeout(() => r(getNext()), period)
                })

                update(true)
            }
        })
    })

    return slideshow
}