const _LOG_TYPES = {
    endurance: {
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Discipline",
                display: {
                    type: "text",
                    value: "discipline",
                    map: {
                        running: "Running",
                        mountainBiking: "Mountain Biking",
                        multiSport: "Multisport / Adventure Racing",
                        canoeing: "Canoeing",
                        horseRiding: "Endurance Horse Riding"
                    }
                },
                input: {
                    attribute: "discipline",
                    type: "select",
                    options: [
                        ["running", "Running"],
                        ["mountainBiking", "Mountain Biking"],
                        ["multisport", "Multisport / Adventure Racing"],
                        ["canoeing", "Canoeing"],
                        ["horseRiding", "Endurance Horse Riding"]
                    ]
                }
            },
            {
                name: "Distance",
                display: {
                    type: "text",
                    value: v => (v.distance / 1000) + "km"
                },
                input: {
                    attribute: "distance",
                    type: "slider",
                    slider: {
                        min: 3000,
                        max: 100000,
                        step: 100,
                        value: 10000,
                        display: n => (n / 1000) + "km"
                    }
                }
            },
            {
                name: "Time",
                display: {
                    type: "text",
                    value: v => formatDuration(v.time)
                },
                input: {
                    attribute: "time",
                    type: "duration"
                }
            },
            {
                name: "Description",
                display: {
                    type: "text",
                    value: "description"
                },
                input: {
                    attribute: "description",
                    type: "textLong"
                }
            }
        ]
    },
    flatWaterPaddling: {
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Training",
                display: {
                    type: "text",
                    value: "training"
                },
                input: {
                    attribute: "training",
                    description: "e.g. Time Trial, Slalom, etc.",
                    type: "textShort"
                }
            },
            {
                name: "Boat",
                display: {
                    type: "text",
                    value: "boat",
                    map: {
                        kayak: "Kayak",
                        k1: "K1",
                        k2: "K2",
                        other: "Other"
                    }
                },
                input: {
                    attribute: "boat",
                    type: "select",
                    options: [
                        ["kayak", "Kayak"],
                        ["k1", "K1"],
                        ["k2", "K2"],
                        ["other", "Other"]
                    ]
                }
            },
            {
                name: "Time",
                display: {
                    type: "text",
                    value: log => formatDuration(log.time, false)
                },
                input: {
                    attribute: "time",
                    type: "duration"
                }
            },
            {
                name: "Distance",
                display: {
                    type: "text",
                    value: "distance"
                },
                input: {
                    attribute: "distance",
                    description: "e.g. 3km, 5x fig 8's, etc.",
                    type: "textShort"
                }
            },
            {
                name: "Place",
                display: {
                    type: "text",
                    value: "place"
                },
                input: {
                    attribute: "place",
                    type: "textShort"
                }
            },
            {
                name: "Comments",
                display: {
                    type: "text",
                    value: "description"
                },
                input: {
                    attribute: "description",
                    type: "textLong"
                }
            }
        ]
    },
    midmarMileTraining: {
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Distance",
                display: {
                    type: "text",
                    value: log => log.distance + "m"
                },
                input: {
                    attribute: "distance",
                    type: "slider",
                    slider: {
                        min: 100,
                        max: 10000,
                        step: 25,
                        value: 1600,
                        display: v => v + "m"
                    }
                }
            },
            {
                name: "Time",
                display: {
                    type: "text",
                    value: log => formatDuration(log.time)
                },
                input: {
                    attribute: "time",
                    type: "duration"
                }
            },
            {
                name: "Description",
                display: {
                    type: "text",
                    value: "description"
                },
                input: {
                    attribute: "description",
                    type: "textLong"
                }
            }
        ]
    },
    mountaineering: {
        items: [
            {
                name: "Start Date",
                display: {
                    type: "date",
                    attribute: "start_date"
                },
                input: {
                    attribute: "start_date",
                    type: "date"
                }
            },
            {
                name: "Area",
                display: {
                    type: "text",
                    value: "area"
                },
                input: {
                    attribute: "area",
                    type: "textShort"
                }
            },
            {
                name: "Number of Days",
                display: {
                    type: "text",
                    value: log => log.days + " day" + (log.days == 1 ? "" : "s")
                },
                input: {
                    attribute: "days",
                    type: "slider",
                    slider: {
                        min: 1,
                        max: 30,
                        value: 5,
                        display: v => v + " day" + (v === 1 ? "" : "s")
                    }
                }
            },
            {
                name: "Hike Distance",
                display: {
                    type: "text",
                    value: log => (log.distance / 1000) + "km",
                },
                input: {
                    attribute: "distance",
                    type: "slider",
                    slider: {
                        min: 3000,
                        max: 220000,
                        step: 1000,
                        value: 10000,
                        display: v => (v / 1000) + "km"
                    }
                }
            },
            {
                name: "Elevation Gain",
                display: {
                    type: "text",
                    value: log => log.elevation_gain + "m"
                },
                input: {
                    attribute: "elevation_gain",
                    type: "slider",
                    slider: {
                        min: 10,
                        max: 10000,
                        step: 10,
                        value: 1000,
                        display: v => v + "m"
                    }
                }
            },
            {
                name: "Number in Party",
                display: {
                    type: "text",
                    value: log => log.party_size + " " + (log.party_size == 1 ? "person" : "people")
                },
                input: {
                    attribute: "party_size",
                    type: "slider",
                    slider: {
                        min: 1,
                        max: 20,
                        value: 5,
                        display: v => v + " " + (v == 1 ? "person" : "people")
                    }
                }
            },
            {
                name: "Shelter Type",
                display: {
                    type: "text",
                    value: "shelter",
                    map: {
                        tent: "Tent",
                        hut: "Hut",
                        cave: "Cave",
                        bivi: "Bivi",
                        combination: "Combination",
                        other: "Other"
                    }
                },
                input: {
                    attribute: "shelter",
                    type: "select",
                    options: [
                        ["tent", "Tent"],
                        ["hut", "Hut"],
                        ["cave", "Cave"],
                        ["bivi", "Bivi"],
                        ["combination", "Combination"],
                        ["other", "Other"]
                    ]
                }
            },
            {
                name: "Was the majority of the hike on a trail or path?",
                display: {
                    type: "boolean",
                    attribute: "trail"
                },
                input: {
                    attribute: "trail",
                    type: "boolean"
                }
            },
            {
                name: "Were you the leader of the group?",
                display: {
                    type: "boolean",
                    attribute: "leader"
                },
                input: {
                    attribute: "leader",
                    type: "boolean"
                }
            },
            {
                name: "Was the majority of the hike above 2000m?",
                display: {
                    type: "boolean",
                    attribute: "majority_above_2000m"
                },
                input: {
                    attribute: "majority_above_2000m",
                    type: "boolean"
                }
            },
            {
                name: "Route",
                display: {
                    type: "text",
                    value: "route"
                },
                input: {
                    attribute: "route",
                    type: "textLong"
                }
            },
            {
                name: "Weather Conditions",
                display: {
                    type: "text",
                    value: "weather"
                },
                input: {
                    attribute: "weather",
                    type: "textLong"
                }
            },
            {
                name: "Situations Dealt With",
                display: {
                    type: "text",
                    value: "situations"
                },
                input: {
                    attribute: "situations",
                    type: "textLong"
                }
            }
        ]
    },
    riverTrip: {
        signable: true,
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Put In",
                display: {
                    type: "text",
                    value: log => formatTime(log.put_in)
                },
                input: {
                    attribute: "put_in",
                    type: "time"
                }
            },
            {
                name: "Take Out",
                display: {
                    type: "text",
                    value: log => formatTime(log.take_out)
                },
                input: {
                    attribute: "take_out",
                    type: "time"
                }
            },
            {
                name: "Hours On River",
                display: {
                    type: "text",
                    value: log => formatDuration(log.time)
                },
                input: {
                    attribute: "time",
                    type: "duration"
                }
            },
            {
                name: "Distance On River",
                display: {
                    type: "text",
                    value: log => (log.distance / 1000) + "km"
                },
                input: {
                    attribute: "distance",
                    type: "slider",
                    slider: {
                        min: 1000,
                        max: 100000,
                        step: 500,
                        value: 10000,
                        display: v => (v / 1000) + "km"
                    }
                }
            },
            {
                name: "Number In Party",
                display: {
                    type: "text",
                    value: log => log.party_size + " " + (log.party_size == 1 ? "person" : "people")
                },
                input: {
                    attribute: "party_size",
                    type: "slider",
                    slider: {
                        min: 1,
                        max: 20,
                        value: 10,
                        display: v => v + " " + (v === 1 ? "person" : "people")
                    }
                }
            },
            {
                name: "River",
                display: {
                    type: "text",
                    value: "river"
                },
                input: {
                    attribute: "river",
                    type: "textShort"
                }
            },
            {
                name: "Water Level",
                display: {
                    type: "text",
                    value: "water_level"
                },
                input: {
                    attribute: "water_level",
                    type: "textShort"
                }
            },
            {
                name: "Boat(s)",
                display: {
                    type: "text",
                    value: "boat"
                },
                input: {
                    attribute: "boat",
                    description: "e.g. Kayak, Croc, K1, K2, etc.",
                    type: "textShort"
                }
            }
        ]
    },
    rockClimbing: {
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Area",
                display: {
                    type: "text",
                    value: "area"
                },
                input: {
                    attribute: "area",
                    type: "textShort"
                }
            },
            {
                name: "Number In Party",
                display: {
                    type: "text",
                    value: "party_size"
                },
                input: {
                    attribute: "party_size",
                    type: "slider",
                    slider: {
                        min: 1,
                        max: 20,
                        value: 3,
                        display: n => n + " " + (n == 1 ? "person" : "people")
                    }
                }
            },
            {
                name: "Weather",
                display: {
                    type: "text",
                    value: "weather"
                },
                input: {
                    attribute: "weather",
                    type: "textShort"
                }
            },
            {
                name: "Climbs",
                display: {
                    type: "sublogs",
                    sublog: "rockClimbingClimbs"
                }
            }
        ]
    },
    rockClimbingClimbs: {
        items: [
            {
                name: "Route Name",
                display: {
                    type: "text",
                    value: "route_name"
                },
                input: {
                    attribute: "route_name",
                    type: "textShort"
                }
            },
            {
                name: "Method",
                display: {
                    type: "text",
                    value: "method"
                },
                input: {
                    attribute: "method",
                    type: "textShort"
                }
            },
            {
                name: "Grade",
                display: {
                    type: "text",
                    value: "grade"
                },
                input: {
                    attribute: "grade",
                    type: "textShort"
                }
            },
            {
                name: "Pitches",
                display: {
                    type: "text",
                    value: "pitches"
                },
                input: {
                    attribute: "pitches",
                    type: "slider",
                    slider: {
                        min: 0,
                        max: 30,
                        value: 1,
                        display: val => val
                    }
                }
            }
        ]
    },
    rockClimbingInstruction: {
        signable: true,
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Duration",
                display: {
                    type: "text",
                    value: log => formatDuration(log.duration)
                },
                input: {
                    attribute: "duration",
                    type: "duration"
                }
            },
            {
                name: "Number Of Climbers",
                display: {
                    type: "text",
                    value: log => log.climbers + " climber" + (log.climbers == 1 ? "" : "s")
                },
                input: {
                    attribute: "climbers",
                    type: "slider",
                    slider: {
                        min: 1,
                        max: 4,
                        value: 1,
                        display: v => v + " climber" + (v === 1 ? "" : "s")
                    }
                }
            },
            {
                name: "Location",
                display: {
                    type: "text",
                    value: "location"
                },
                input: {
                    attribute: "location",
                    type: "textShort"
                }
            }
        ]
    },
    running: {
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Distance",
                display: {
                    type: "text",
                    value: log => (log.distance / 1000) + "km"
                },
                input: {
                    attribute: "distance",
                    type: "slider",
                    slider: {
                        min: 500,
                        max: 50000,
                        step: 100,
                        value: 3000,
                        display: val => (val / 1000) + "km"
                    }
                }
            },
            {
                name: "Time",
                display: {
                    type: "text",
                    value: log => formatDuration(log.time)
                },
                input: {
                    attribute: "time",
                    type: "duration"
                }
            },
            {
                name: "Comments / Race Category",
                display: {
                    type: "text",
                    value: "description"
                },
                input: {
                    attribute: "description",
                    type: "textLong"
                }
            }
        ]
    },
    service: {
        signable: true,
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Service",
                display: {
                    type: "text",
                    value: "service"
                },
                input: {
                    attribute: "service",
                    type: "textShort"
                }
            },
            {
                name: "Hours",
                display: {
                    type: "text",
                    value: log => formatDuration(log.time, false)
                },
                input: {
                    attribute: "time",
                    type: "slider",
                    slider: {
                        min: 30 * 60,
                        max: 48 * 60 * 60,
                        value: 2 * 60 * 60,
                        step: 30 * 60,
                        display: v => formatDuration(v, false)
                    }
                }
            },
            {
                name: "Details",
                display: {
                    type: "text",
                    value: "description"
                },
                input: {
                    attribute: "description",
                    type: "textLong"
                }
            }
        ]
    },
    solitaire: {
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Location",
                display: {
                    type: "text",
                    value: "location"
                },
                input: {
                    attribute: "location",
                    type: "textShort"
                }
            },
            {
                name: "Others Involved",
                display: {
                    type: "text",
                    value: "others_involved"
                },
                input: {
                    attribute: "others_involved",
                    type: "textShort"
                }
            },
            {
                name: "Supervisors",
                display: {
                    type: "text",
                    value: "supervisors"
                },
                input: {
                    attribute: "supervisors",
                    type: "textShort"
                }
            },
            {
                name: "What I Took With Me",
                display: {
                    type: "text",
                    value: "items"
                },
                input: {
                    attribute: "items",
                    type: "textShort"
                }
            },
            {
                name: "The Experience Described In One Paragraph",
                display: {
                    type: "text",
                    value: "experience"
                },
                input: {
                    attribute: "experience",
                    type: "textLong"
                }
            }
        ]
    },
    solitaireInstruction: {
        items: [
            {
                name: "Date",
                display: {
                    type: "date"
                },
                input: {
                    attribute: "date",
                    type: "date"
                }
            },
            {
                name: "Location",
                display: {
                    type: "text",
                    value: "location"
                },
                input: {
                    attribute: "location",
                    type: "textShort"
                }
            },
            {
                name: "Group Supervised",
                display: {
                    type: "text",
                    value: "group_supervised"
                },
                input: {
                    attribute: "group_supervised",
                    type: "textShort"
                }
            },
            {
                name: "Comments & Problems Overcome",
                display: {
                    type: "text",
                    value: "description"
                },
                input: {
                    attribute: "description",
                    type: "textLong"
                }
            }
        ]
    }
}

function getLogTypeName(logType) {
    return pascalToCapitalized(logType)
}

/*
    Types
        boolean
        date
        sublogs
        text
*/
function _createDisplaySection({ fetchSublogs, log, logType, parentLogId, post, viewOnly }) {
    const displaySectionElement = createElement("div", { c: ["log", "display"] })
    const itemsContainer = createElement("div", { c: "items", p: displaySectionElement })

    const { items, signable } = _LOG_TYPES[logType]

    let idPromiseResolve
    const idPromise = new Promise(r => idPromiseResolve = r)

    for (let item of items) {
        const { name, display } = item
        const { type } = display

        const itemElement = createElement("div", { c: "item", p: itemsContainer })
        createElement("h3", { p: itemElement, t: name })

        switch (type) {
            case "boolean": {
                const { attribute } = display
                const displayValue = log[attribute]
                createElement("p", { p: itemElement, t: displayValue === 0 ? "No" : "Yes" })
                break
            }
            case "date": {
                const { attribute = "date" } = display
                const displayValue = formatDate(log[attribute])
                createElement("p", { p: itemElement, t: displayValue })
                break
            }
            case "sublogs": {
                const { sublog: sublogType } = display
                itemElement.classList.add("sublogs")

                idPromise.then(id => {
                    createSpacer(10, { p: itemElement })

                    const sublogElement = createLogDisplay({
                        logType: sublogType,
                        parentLogId: id,
                        sublogs: log[sublogType] ?? (fetchSublogs ? null : []),
                        viewOnly
                    })

                    itemElement.appendChild(sublogElement)
                })

                break
            }
            case "text": {
                const { map, value } = display
                let displayValue

                if (typeof value === "string") { // attribute
                    displayValue = log[value]
                    if (map) displayValue = map[displayValue]
                } else {
                    displayValue = value(log)
                }

                createElement("p", { p: itemElement, t: displayValue })
                break
            }
        }
    }

    if (signable) {
        const signItemElement = createElement("div", { c: "item sign", p: itemsContainer })

        if (viewOnly) { // can sign
            let signed = log.signer != null

            const titleElement = createElement("h3", { p: signItemElement, t: "Signed" })
            const updateTitleText = () => titleElement.innerHTML = signed ? "Signed" : "Sign"
            updateTitleText()

            idPromise.then(id => {
                const buttonElement = createElement("button", {
                    c: "primary", p: signItemElement, t: "Remove Sign", onClick: () => {
                        signed = !signed
                        updateTitleText()
                        updateButtonText()
                        putRequest(`/logs/${logType}/${id}/sign`, { signed })
                    }
                })

                const updateButtonText = () => buttonElement.innerHTML = signed ? "Remove Sign" : "Sign Off"
                updateButtonText()
            })
        } else {
            createElement("h3", { p: signItemElement, t: "Signed" })
            createElement("p", { p: signItemElement, t: log.signer ? "Yes" : "No" })
        }
    }

    if (viewOnly) {
        idPromiseResolve(log.id)
    } else {
        function loadOptions(logId) {
            idPromiseResolve(logId)
            const bottomBar = createElement("div", { c: "bottom-bar", p: displaySectionElement })

            createElement("div", {
                c: "material-icons", p: bottomBar, t: "edit_square", onClick: () => {
                    const inputSectionElement = _createInputSection({
                        edit: true,
                        logId,
                        initialValues: log,
                        logType,
                        parentLogId
                    })
                    displaySectionElement.replaceWith(inputSectionElement)
                }
            })
            createElement("div", {
                c: "material-icons", p: bottomBar, t: "delete", onClick: () => {
                    deleteRequest(`/logs/${logType}/${logId}`)
                    displaySectionElement.remove()
                }
            })
        }

        if (post) { // request needs to be handled
            const loadingElement = createElement("div", { c: "loading" })
            displaySectionElement.insertBefore(loadingElement, displaySectionElement.childNodes[0])
            const infoElement = createElement("p", { p: loadingElement })

            function handlePost() {
                infoElement.innerHTML = LOADING_TEXT

                post().then(logId => {
                    loadingElement.remove()
                    loadOptions(logId)
                }).catch(() => {
                    infoElement.innerHTML = "An error occured!"
                    createElement("button", {
                        p: loadingElement, t: "Try Again", onClick: b => {
                            b.remove()
                            handlePost()
                        }
                    })
                })
            }

            handlePost()
        } else {
            loadOptions(log.id)
        }
    }

    return displaySectionElement
}

/*
    Types:
        boolean
        date
        duration
        select
        slider
        textLong
        textShort
        time
*/
function _createInputSection(options) {
    const { edit, createLogElement, initialValues, logId, logsContainer, logType, parentLogId } = options ?? {} // edit, logId || createLogElement, logsContainer

    const inputSectionElement = createElement("div", { c: ["log", "input"] })
    const itemsContainer = createElement("div", { c: "items", p: inputSectionElement })

    const { items } = _LOG_TYPES[logType]
    const itemStorage = {} // stores value suppliers & item elements

    for (let item of items) {
        const { name, input } = item
        if (!input) continue // item does not support input

        const { attribute, description, type } = input
        const initialValue = initialValues?.[attribute] ?? null

        const itemElement = createElement("div", { c: "item", p: itemsContainer })
        const headingElement = createElement("h3", { p: itemElement, t: name })
        if (description) createElement("p", { p: itemElement, t: description })

        let valueSupplier // null indicates no value provided

        switch (type) {
            case "boolean": {
                itemElement.classList.add("boolean")

                const inputContainer = createElement("div", { c: "center-rv", p: itemElement })
                const checkboxInput = createElement("input", { p: inputContainer })
                checkboxInput.type = "checkbox"

                const textElement = createElement("p", { p: inputContainer })
                checkboxInput.addEventListener("input", () => textElement.innerHTML = checkboxInput.checked ? "Yes" : "No")

                checkboxInput.checked = initialValue === 1 ? true : false
                textElement.innerHTML = initialValue === 1 ? "Yes" : "No"

                valueSupplier = () => checkboxInput.checked
                break
            }
            case "date": {
                itemElement.classList.add("date")
                createSpacer(10, { p: itemElement })

                const inputElement = createElement("input", { p: itemElement })
                inputElement.type = "date"

                if (initialValue) {
                    inputElement.value = initialValue
                } else {
                    setDateCurrent(inputElement)
                }

                valueSupplier = () => {
                    const val = inputElement.value
                    return (val === "") ? null : val
                }

                break
            }
            case "duration": {
                itemElement.classList.add("duration")
                createSpacer(10, { p: itemElement })

                const inputContainer = createElement("div", { c: "input-container", p: itemElement })

                const createTimeInput = (unit, max, initialValue) => {
                    const inputElement = createElement("input", { p: inputContainer })
                    inputElement.type = "text"
                    inputElement.placeholder = 0
                    inputElement.value = initialValue || null

                    inputElement.addEventListener("input", () => {
                        const val = parseInt(inputElement.value)

                        if (isNaN(val) || val === 0) {
                            inputElement.value = null
                        } else if (val > max) {
                            inputElement.value = max
                        } else {
                            inputElement.value = Math.abs(val)
                        }
                    })

                    createElement("p", { p: inputContainer, t: unit })
                    return inputElement
                }
                const createColon = () => createElement("p", { c: "colon", p: inputContainer, t: ":" })

                let ih, im, is

                if (initialValue) {
                    ih = Math.floor(initialValue / 3600)
                    im = Math.floor((initialValue - ih * 3600) / 60)
                    is = initialValue - ih * 3600 - im * 60
                }

                const hoursElement = createTimeInput("h", 99, ih)
                createColon()
                const minutesElement = createTimeInput("m", 59, im)
                createColon()
                const secondsElement = createTimeInput("s", 59, is)

                valueSupplier = () => {
                    const total = (hoursElement.value || 0) * 3600 + (minutesElement.value || 0) * 60 + (secondsElement.value || 0) * 1
                    return (total > 0) ? total : null
                }

                break
            }
            case "select": {
                const { options } = input
                itemElement.classList.add("select")

                const selectElement = createElement("select", { p: itemElement })

                // show select
                createElement("option", {
                    p: selectElement, t: "select...", consumer: e => {
                        e.setAttribute("hidden", "")
                        e.value = "initial"
                    }
                })

                for (let option of options) {
                    const [optionId, optionName] = option
                    createElement("option", { p: selectElement, t: optionName }).value = optionId
                }

                valueSupplier = () => {
                    const value = selectElement.value
                    return value == "initial" ? null : value
                }

                if (initialValue) selectElement.value = initialValue
                break
            }
            case "slider": {
                const { min, max, step, value, display } = input.slider
                itemElement.classList.add("slider")

                const sliderElement = createElement("input")
                sliderElement.type = "range"
                sliderElement.max = max
                sliderElement.min = min
                sliderElement.step = step
                sliderElement.value = initialValue ?? value

                valueSupplier = () => sliderElement.value

                if (display) {
                    const displayElement = createElement("p", { p: itemElement })
                    const updateDisplayText = () => displayElement.innerHTML = display(parseFloat(sliderElement.value))

                    updateDisplayText()
                    sliderElement.addEventListener("input", updateDisplayText)
                }

                itemElement.appendChild(sliderElement)
                break
            }
            case "textLong": {
                itemElement.classList.add("text-long")
                createSpacer(10, { p: itemElement })

                const textElement = createElement("textarea", { p: itemElement })
                textElement.value = initialValue

                valueSupplier = () => {
                    const val = textElement.value
                    return (val === "") ? null : val
                }

                break
            }
            case "textShort": {
                itemElement.classList.add("text-short")
                createSpacer(10, { p: itemElement })

                const inputElement = createElement("input", { p: itemElement })
                inputElement.type = "text"
                inputElement.value = initialValue

                valueSupplier = () => {
                    const val = inputElement.value
                    return (val === "") ? null : val
                }

                break
            }
            case "time": {
                itemElement.classList.add("time")
                createSpacer(10, { p: itemElement })

                const inputElement = createElement("input", { p: itemElement })
                inputElement.type = "time"
                inputElement.value = initialValue

                valueSupplier = () => {
                    const val = inputElement.value
                    return (val === "") ? null : val
                }

                break
            }
        }

        itemStorage[attribute] = {
            valueSupplier,
            heading: headingElement
        }
    }

    const infoElement = createElement("p", { p: inputSectionElement })

    createElement("button", {
        c: edit ? "save" : "create", p: inputSectionElement, t: edit ? "Save" : "Create", onClick: async () => {
            let missing = false
            const log = {}

            for (let attribute in itemStorage) {
                const { heading, valueSupplier } = itemStorage[attribute]
                const value = valueSupplier()

                if (value == null) {
                    heading.classList.add("required")
                    missing = true
                } else {
                    heading.classList.remove("required")
                    log[attribute] = value
                }
            }

            if (missing) {
                infoElement.innerHTML = "You are missing some things!"
                return
            }
            if (edit) {
                const logElement = _createDisplaySection({
                    fetchSublogs: true,
                    logType,
                    log,
                    parentLogId,
                    viewOnly: false,
                    post: () => {
                        return new Promise((r, re) => {
                            postRequest(`/logs/${logType}`, { log, id: logId, parentLogId }).then(json => {
                                if (json.ok) {
                                    r(logId)
                                } else {
                                    re()
                                }
                            })
                        })
                    }
                })
                inputSectionElement.replaceWith(logElement)
            } else {
                inputSectionElement.remove()
                createLogElement.style.display = "flex"

                const logElement = _createDisplaySection({
                    logType,
                    log,
                    parentLogId,
                    viewOnly: false,
                    post: () => {
                        return new Promise((r, re) => {
                            postRequest(`/logs/${logType}`, { log, parentLogId }).then(json => {
                                if (json.ok) {
                                    r(json.id)
                                } else {
                                    re()
                                }
                            })
                        })
                    }
                })

                createLogElement.insertAdjacentElement("afterend", logElement)
            }
        }
    })

    return inputSectionElement
}

function createLogDisplay(options) {
    const { logType, parentLogId, sublogs, viewOnly } = options
    let { userId } = options

    const logDisplayElement = createElement("div", { c: "logs" })

    if (userId == null) {
        if (isLoggedIn()) {
            userId = getUserId()
        } else {
            createElement("p", { c: "login-required", p: logDisplayElement, t: `<a class="signin-link">Sign in</a> to view your logs.` })
            return logDisplayElement
        }
    }

    if (!viewOnly) {
        const createLogElement = createElement("div", {
            c: "create-log", p: logDisplayElement, onClick: () => {
                const log = _createInputSection({
                    createLogElement,
                    logsContainer: logDisplayElement,
                    logType,
                    parentLogId
                })
                createLogElement.style.display = "none"
                createLogElement.insertAdjacentElement("afterend", log)
            }
        })
        createElement("div", { c: "create-button", p: createLogElement, t: "+" })
        createElement("p", { p: createLogElement, t: "Create Log" })
    }

    if (parentLogId && sublogs) { // requires no loading
        if (sublogs.length === 0) {
            if (viewOnly) {
                createElement("p", { p: logDisplayElement, t: NONE_TEXT })
            }
        } else {
            for (let log of sublogs.reverse()) {
                const logElement = _createDisplaySection({ log, logType, parentLogId, viewOnly })
                logDisplayElement.appendChild(logElement)
            }
        }
    } else {
        const loadingElement = createElement("p", { c: "loading-text", p: logDisplayElement, t: LOADING_TEXT })
        let promise

        if (parentLogId) {
            promise = getRequest(`/logs/${logType}?parentLogId=${parentLogId}`)
        } else {
            promise = getRequest(`/logs/${logType}?targetUserId=${userId}`)
        }

        promise.then(res => {
            const { logs } = res
            loadingElement.remove()

            if (logs.length === 0) {
                if (viewOnly) {
                    createElement("p", { p: logDisplayElement, t: NONE_TEXT })
                }
            } else {
                for (let log of logs.reverse()) {
                    const logElement = _createDisplaySection({ logType, log, viewOnly })
                    logDisplayElement.appendChild(logElement)
                }
            }
        })
    }

    return logDisplayElement
}