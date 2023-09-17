const LOADING_TEXT = "Loading . . ."

document.addEventListener("click", event => {

    /* Handle Signin Link */

    if (event.target.classList.contains("signin-link")) {
        location.href = `/signin?redirect=${location.pathname}`
    }
})

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

function getGrade(email) {
    const [a, b] = email
    let matricYear

    if (isNaN(parseInt(b))) {
        matricYear = parseInt("2" + a)
    } else {
        matricYear = parseInt(a + b)
    }

    const currentYear = new Date().getFullYear()
    return currentYear - matricYear - 1988
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

    let icon = (type === "success") ? "check_circle" : type
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