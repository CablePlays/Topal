const _LOG_TYPES = {
    rockClimbing: {
        signable: false,
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
        signable: false,
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
    running: {
        signable: false,
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
    }
};

/*
    Types
        date
        sublogs
        text
*/
function _createDisplaySection({ fetchSublogs, log, logType, parentLogId, post, viewOnly }) {
    const displaySectionElement = createElement("div", { c: ["log", "display"] });
    const itemsContainer = createElement("div", { c: "items", p: displaySectionElement });

    const { items } = _LOG_TYPES[logType];

    let idPromiseR;
    const idPromise = new Promise(r => idPromiseR = r);

    for (let item of items) {
        const { name, display } = item;
        const { type } = display;

        const itemElement = createElement("div", { c: "item", p: itemsContainer });
        createElement("h3", { p: itemElement, t: name });

        switch (type) {
            case "date": {
                const { attribute = "date" } = display;
                const displayValue = formatDate(log[attribute]);
                createElement("p", { p: itemElement, t: displayValue });
                break;
            }
            case "sublogs": {
                const { sublog: sublogType } = display;
                itemElement.classList.add("sublogs");

                idPromise.then(id => {
                    createSpacer(10, { p: itemElement });

                    const sublogElement = createLogDisplay({
                        logType: sublogType,
                        parentLogId: id,
                        sublogs: log[sublogType] ?? (fetchSublogs ? null : []),
                        viewOnly
                    });

                    itemElement.appendChild(sublogElement);
                });

                break;
            }
            case "text": {
                const { value } = display;
                let displayValue;

                if (typeof value === "string") {
                    displayValue = log[value];
                } else {
                    displayValue = value(log);
                }

                createElement("p", { p: itemElement, t: displayValue });
                break;
            }
        }
    }

    if (viewOnly) {
        idPromiseR(log.id);
    } else {
        function loadOptions(logId) {
            idPromiseR(logId);
            const bottomBar = createElement("div", { c: "bottom-bar", p: displaySectionElement });

            createElement("button", {
                p: bottomBar, t: "Edit", onClick: () => {
                    const inputSectionElement = _createInputSection({
                        edit: true,
                        logId,
                        initialValues: log,
                        logType,
                        parentLogId
                    });
                    displaySectionElement.replaceWith(inputSectionElement);
                }
            });
            createElement("button", {
                p: bottomBar, t: "Delete", onClick: () => {
                    deleteRequest(`/logs/${logType}/${logId}`);
                    displaySectionElement.remove();
                }
            });
        }

        if (post) { // request needs to be handled
            const loadingElement = createElement("div", { c: "loading" });
            displaySectionElement.insertBefore(loadingElement, displaySectionElement.childNodes[0]);
            const infoElement = createElement("p", { p: loadingElement });

            function handlePost() {
                infoElement.innerHTML = LOADING_TEXT;

                post().then(logId => {
                    loadingElement.remove();
                    loadOptions(logId);
                }).catch(() => {
                    infoElement.innerHTML = "An error occured!";
                    createElement("button", {
                        p: loadingElement, t: "Try Again", onClick: b => {
                            b.remove();
                            handlePost();
                        }
                    });
                });
            }

            handlePost();
        } else {
            loadOptions(log.id);
        }
    }

    return displaySectionElement;
}

/*
    Types:
        date
        duration
        slider
        textLong
        textShort
*/
function _createInputSection(options) {
    const { edit, createLogElement, initialValues, logId, logsContainer, logType, parentLogId } = options ?? {}; // edit, logId || createLogElement, logsContainer

    const inputSectionElement = createElement("div", { c: ["log", "input"] });
    const itemsContainer = createElement("div", { c: "items", p: inputSectionElement });

    const { items } = _LOG_TYPES[logType];
    const itemStorage = {}; // stores value suppliers & item elements

    for (let item of items) {
        const { name, input } = item;
        if (!input) continue; // item does not support input

        const { attribute, type } = input;
        const initialValue = initialValues?.[attribute] ?? null;

        const itemElement = createElement("div", { c: "item", p: itemsContainer });
        const headingElement = createElement("h3", { p: itemElement, t: name });

        let valueSupplier; // null indicates no value provided

        switch (type) {
            case "date": {
                itemElement.classList.add("date");
                createSpacer(10, { p: itemElement });

                const inputElement = createElement("input", { p: itemElement });
                inputElement.type = "date";

                if (initialValue) {
                    inputElement.value = initialValue;
                } else {
                    setDateCurrent(inputElement);
                }

                valueSupplier = () => {
                    const val = inputElement.value;
                    return (val === "") ? null : val;
                };

                break;
            }
            case "duration": {
                itemElement.classList.add("duration");
                createSpacer(10, { p: itemElement });

                const inputContainer = createElement("div", { c: "input-container", p: itemElement });

                const createTimeInput = (unit, max, initialValue) => {
                    const inputElement = createElement("input", { p: inputContainer });
                    inputElement.type = "text";
                    inputElement.placeholder = 0;
                    inputElement.value = initialValue || null;

                    inputElement.addEventListener("input", () => {
                        const val = parseInt(inputElement.value);

                        if (isNaN(val) || val === 0) {
                            inputElement.value = null;
                        } else if (val > max) {
                            inputElement.value = max;
                        } else {
                            inputElement.value = Math.abs(val);
                        }
                    })

                    createElement("p", { p: inputContainer, t: unit });
                    return inputElement;
                }
                const createColon = () => createElement("p", { c: "colon", p: inputContainer, t: ":" });

                let ih, im, is;

                if (initialValue) {
                    ih = Math.floor(initialValue / 3600);
                    im = Math.floor((initialValue - ih * 3600) / 60);
                    is = initialValue - ih * 3600 - im * 60;
                }

                const hoursElement = createTimeInput("h", 99, ih);
                createColon();
                const minutesElement = createTimeInput("m", 59, im);
                createColon();
                const secondsElement = createTimeInput("s", 59, is);

                valueSupplier = () => {
                    const total = (hoursElement.value || 0) * 3600 + (minutesElement.value || 0) * 60 + (secondsElement.value || 0) * 1;
                    return (total > 0) ? total : null;
                }

                break;
            }
            case "slider": {
                const { min, max, step, value, display } = input.slider;
                itemElement.classList.add("slider");

                const sliderElement = createElement("input");
                sliderElement.type = "range";
                sliderElement.max = max;
                sliderElement.min = min;
                sliderElement.step = step
                sliderElement.value = initialValue ?? value;

                valueSupplier = () => sliderElement.value;

                if (display) {
                    const displayElement = createElement("p", { p: itemElement });
                    const updateDisplayText = () => displayElement.innerHTML = display(sliderElement.value);

                    updateDisplayText();
                    sliderElement.addEventListener("input", updateDisplayText);
                }

                itemElement.appendChild(sliderElement);
                break;
            }
            case "textLong": {
                itemElement.classList.add("text-long");
                createSpacer(10, { p: itemElement });

                const textElement = createElement("textarea", { p: itemElement });
                textElement.value = initialValue;

                valueSupplier = () => {
                    const val = textElement.value;
                    return (val === "") ? null : val;
                };

                break;
            }
            case "textShort": {
                itemElement.classList.add("text-short");
                createSpacer(10, { p: itemElement });

                const inputElement = createElement("input", { p: itemElement });
                inputElement.type = "text";
                inputElement.value = initialValue;

                valueSupplier = () => {
                    const val = inputElement.value;
                    return (val === "") ? null : val;
                };

                break;
            }
        }

        itemStorage[attribute] = {
            valueSupplier,
            heading: headingElement
        }
    }

    const infoElement = createElement("p", { p: inputSectionElement });

    createElement("button", {
        c: edit ? "save" : "create", p: inputSectionElement, t: edit ? "Save" : "Create", onClick: async () => {
            let missing = false;
            const log = {};

            for (let attribute in itemStorage) {
                const { heading, valueSupplier } = itemStorage[attribute];
                const value = valueSupplier();

                if (value == null) {
                    heading.classList.add("required");
                    missing = true;
                } else {
                    heading.classList.remove("required");
                    log[attribute] = value;
                }
            }

            if (missing) {
                infoElement.innerHTML = "You are missing required fields!";
                return;
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
                            postRequest(`/logs/${logType}`, { log, id: logId, parentLogId })
                                .then(() => r(logId)).catch(err => re(err));
                        });
                    }
                });
                inputSectionElement.replaceWith(logElement);
            } else {
                inputSectionElement.remove();
                createLogElement.style.display = "flex";

                const logElement = _createDisplaySection({
                    logType,
                    log,
                    parentLogId,
                    viewOnly: false,
                    post: () => {
                        return new Promise((r, re) => {
                            postRequest(`/logs/${logType}`, { log, parentLogId })
                                .then(json => r(json.id)).catch(err => re(err));
                        });
                    }
                });
                logsContainer.appendChild(logElement);
            }
        }
    });

    return inputSectionElement;
}

function createLogDisplay(options) {
    const { logType, parentLogId, sublogs, viewOnly } = options ?? {};
    const logDisplayElement = createElement("div", { c: "logs" });

    if (!viewOnly) {
        const createLogElement = createElement("div", {
            c: "create-log", p: logDisplayElement, onClick: () => {
                const log = _createInputSection({
                    createLogElement,
                    logsContainer: logDisplayElement,
                    logType,
                    parentLogId
                });
                createLogElement.style.display = "none";
                createLogElement.insertAdjacentElement("afterend", log);
            }
        });
        createElement("div", { c: "create-button", p: createLogElement, t: "+" });
        createElement("p", { p: createLogElement, t: "Create Log" });
    }

    if (parentLogId && sublogs) { // requires no loading
        for (let log of sublogs) {
            const logElement = _createDisplaySection({ log, logType, parentLogId, viewOnly });
            logDisplayElement.appendChild(logElement);
        }
    } else {
        let promise;

        if (parentLogId) {
            promise = getRequest(`/logs/${logType}?parentLogId=${parentLogId}`);
        } else {
            promise = getRequest(`/logs/${logType}?targetUserId=${getUserId()}`);
        }

        const loadingElement = createElement("p", { c: "loading-text", p: logDisplayElement, t: LOADING_TEXT });

        promise.then(res => {
            const { logs } = res;
            loadingElement.remove();

            for (let log of logs) {
                const logElement = _createDisplaySection({ logType, log, viewOnly });
                logDisplayElement.appendChild(logElement);
            }
        });
    }

    return logDisplayElement;
}