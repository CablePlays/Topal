const LOADING_TEXT = "Loading . . ."

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

/* Create Element */

function createElement(type, options) {
    const element = document.createElement(type)
    const { c, onClick, consumer, p, t } = options ?? {}

    if (typeof c === "string") {
        element.classList.add(c)
    } else if (c) {
        for (let clazz of c) {
            element.classList.add(clazz)
        }
    }
    if (onClick) element.addEventListener("click", () => onClick(element))
    if (p) byId(p).appendChild(element)
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

/* Formatting */

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