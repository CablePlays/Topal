const LOADING_TEXT = "Loading . . ."

document.addEventListener("click", event => {
    if (event.target.classList.contains("signin-link")) { // signin link
        location.href = `/signin?redirect=${location.pathname}`
    }
})

function getParam(param) {
    return new URLSearchParams(location.search).get(param)
}

function setParam(param, value) {
    const url = new URL(location.href)
    const { searchParams } = url

    if (value == null) {
        searchParams.delete(param)
    } else {
        searchParams.set(param, value)
    }

    window.history.replaceState({}, "", url.toString())
}

function byId(id) {
    return (typeof id === "string") ? document.getElementById(id) : id
}

function setDateCurrent(dateInput) {
    let date = new Date()
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString()

    if (month.length === 1) {
        month = "0" + month
    }

    let day = date.getDate().toString()

    if (day.length === 1) {
        day = "0" + day
    }

    dateInput.value = year + "-" + month + "-" + day
}

function setVisible(element, visible) {
    element = byId(element)

    if (visible ?? true) {
        element.classList.remove("invisible")
    } else {
        element.classList.add("invisible")
    }
}

/* Create Element */

function createElement(type, options) {
    const element = document.createElement(type)
    const { c, onClick, consumer, p, r, t } = options ?? {}

    if (typeof c === "string") {
        element.classList.add(c)
    } else if (c) {
        for (let clazz of c) {
            element.classList.add(clazz)
        }
    }
    if (onClick) element.addEventListener("click", () => onClick(element))
    if (p) byId(p).appendChild(element)
    if (r) byId(r).replaceWith(element)
    if (t) element.innerHTML = t
    if (consumer) consumer(element)

    return element
}

function createSpacer(space, options) {
    const e = createElement("div", options)
    e.classList.add("spacer")
    e.classList.add("v" + space)
    return e
}

function createNotice(type, options) {
    const { t } = options
    delete options.t

    const e = createElement("div", options)
    e.classList.add("notice")
    e.classList.add(type)

    const icon = (type === "success") ? "check_circle" : type
    createElement("div", { c: ["material-icons", "notice-type"], p: e, t: icon })
    createElement("p", { p: e, t })
    return e
}

/* Formatting */

function pascalToCapitalized(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())
}

function pascalToKebab(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function formatDate(date) {
    if (typeof date === "string") {
        date = new Date(date)
    }

    let day = date.getDate() + ""
    if (day.length === 1) day = "0" + day

    let month = date.getMonth() + 1 + ""
    if (month.length === 1) month = "0" + month

    return `${day}/${month}/${date.getFullYear()}`
}

function formatDuration(seconds, showSeconds = true) {
    let h = Math.floor(seconds / 3600)
    seconds -= h * 3600

    let m = Math.floor(seconds / 60)
    let s = seconds - m * 60

    let formatted = `${h}h ${m}m`

    if (showSeconds === true) {
        formatted += ` ${s}s`
    }

    return formatted
}

function formatTime(time) {
    let [hour, minute] = time.split(":")
    let period

    if (hour < 12) {
        period = "am"

        if (hour === "0") {
            hour = 12
        }
    } else {
        period = "pm"

        if (hour !== "12") {
            hour -= 12
        }
    }
    if (minute.length === 1) {
        minute = "0" + minute
    }

    let format = `${hour}:${minute}${period}`
    return format
}

/* Custom Elements */

class JoinedButtons extends HTMLElement {
    static SELECTED_ATTRIBUTE = "selected"
    constructor() { super() }

    static get observedAttributes() {
        return [JoinedButtons.SELECTED_ATTRIBUTE]
    }

    updateUnderlinePosition() {
        const selected = this.getAttribute(JoinedButtons.SELECTED_ATTRIBUTE) ?? 0
        this.underline.style.transform = `translateX(${selected * 100}%)`
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === JoinedButtons.SELECTED_ATTRIBUTE && this.underline) {
            this.updateUnderlinePosition()
        }
    }

    connectedCallback() {
        setTimeout(() => {
            const buttons = this.querySelectorAll("a, button")
            const buttonCount = buttons.length
            this.buttonCount = buttonCount

            this.innerHTML = null

            const buttonsContainer = createElement("div", { c: "buttons", p: this })

            for (let i = 0; i < buttonCount; i++) {
                if (i > 0) createElement("div", { c: "joiner", p: buttonsContainer })
                const button = buttons[i]
                button.style.width = `calc(100% / ${buttonCount})`
                button.addEventListener("click", e => {
                    if (button.tagName !== "A" || !e.ctrlKey && !e.shiftKey) { // ensure not opening link in new place
                        this.setAttribute(JoinedButtons.SELECTED_ATTRIBUTE, i)
                    }
                })
                buttonsContainer.appendChild(button)
            }

            this.underline = createElement("div", { c: "underline", p: this })
            this.underline.style = `width: ${100 / buttonCount}%`
            this.updateUnderlinePosition()
        })
    }
}

customElements.define("joined-buttons", JoinedButtons)