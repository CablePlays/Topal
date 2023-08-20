const _LOG_TYPES = {
    running: {
        signable: false,
        items: [
            {
                name: "Date",
                display: {
                    type: "text",
                    value: log => formatDate(log.date)
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

function _createDisplaySection(logType, log, showOptions, idPromise) {
    const displaySectionElement = createElement("div", { c: ["log", "display"] });
    const itemsContainer = createElement("div", { c: "items", p: displaySectionElement });

    const { items } = _LOG_TYPES[logType];

    for (let item of items) {
        const { name, display } = item;
        const { type, value } = display;

        const itemElement = createElement("div", { c: "item", p: itemsContainer });
        createElement("h3", { p: itemElement, t: name });

        if (type === "text") {
            let displayValue;

            if (typeof value === "string") {
                displayValue = log[value];
            } else {
                displayValue = value(log);
            }

            createElement("p", { p: itemElement, t: displayValue });
        }
    }

    if (showOptions) {
        const bottomBar = createElement("div", { c: "bottom-bar", p: displaySectionElement });

        let idPromiseInternal = idPromise ?? new Promise(r => r(log.id));

        if (idPromise) {
            idPromiseInternal = idPromise;

            const loadingCoverElement = createElement("div", { c: "loading" });
            displaySectionElement.insertBefore(loadingCoverElement, displaySectionElement.childNodes[0]);

            idPromise.then(() => loadingCoverElement.remove());
        } else {
            idPromiseInternal = new Promise(r => r(log.id));
        }

        idPromiseInternal.then(logId => {
            createElement("button", {
                p: bottomBar, t: "Edit", onClick: () => {
                    const inputSectionElement = _createInputSection(logType, {
                        edit: true,
                        logId,
                        initialValues: log
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
        });
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
function _createInputSection(logType, options) {
    const { edit, createLogElement, initialValues, logId, logsContainer } = options ?? {}; // edit, logId || createLogElement, logsContainer

    const inputSectionElement = createElement("div", { c: ["log", "input"] });
    const itemsContainer = createElement("div", { c: "items", p: inputSectionElement });

    const { items } = _LOG_TYPES[logType];
    const itemStorage = {}; // stores value suppliers & item elements

    for (let item of items) {
        const { name, input } = item;
        const { attribute, type } = input;
        const initialValue = initialValues?.[attribute] ?? null;

        const itemElement = createElement("div", { c: "item", p: itemsContainer });
        const headingElement = createElement("h3", { p: itemElement, t: name });

        let valueSupplier; // null indicates no value provide

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
                    inputElement.value = initialValue ?? null;

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
        c: "create", p: inputSectionElement, t: edit ? "Save" : "Create", onClick: async () => {
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
                const logElement = _createDisplaySection(logType, log, true, new Promise(r => {
                    postRequest(`/users/${getUserId()}/logs/${logType}`, { log, id: logId }).then(() => r(logId));
                }));
                inputSectionElement.replaceWith(logElement);
            } else {
                inputSectionElement.remove();
                createLogElement.style.display = "flex";

                const logElement = _createDisplaySection(logType, log, true, new Promise(r => {
                    postRequest(`/users/${getUserId()}/logs/${logType}`, { log }).then(json => r(json.id));
                }));
                logsContainer.appendChild(logElement);
            }
        }
    });

    return inputSectionElement;
}

function createLogDisplay(options) {
    const { logType, showCreate, showOptions } = options ?? {};

    const logDisplayElement = createElement("div", { c: "logs" });

    if (showCreate) {
        const createLogElement = createElement("div", {
            c: "create-log", p: logDisplayElement, onClick: () => {
                const log = _createInputSection(logType, {
                    logsContainer: logDisplayElement,
                    createLogElement
                });
                createLogElement.style.display = "none";
                logDisplayElement.insertBefore(log, createLogElement);
            }
        });
        createElement("div", { c: "create-button", p: createLogElement, t: "+" });
        createElement("p", { p: createLogElement, t: "Create Log" });
    }

    getRequest(`/users/${getUserId()}/logs/${logType}`).then(res => {
        const { logs } = res;

        for (let log of logs) {
            const logElement = _createDisplaySection(logType, log, showOptions);
            logDisplayElement.appendChild(logElement);
        }
    });

    return logDisplayElement;
}

// function _createInputSection(logType, logDisplayElement, createLogElement) {
//     const inputSectionElement = createElement("div", { c: ["log", "input"] });
//     const itemsContainer = createElement("div", { c: "items", p: inputSectionElement });

//     const { items } = _LOG_TYPES[logType];
//     const itemStorage = {}; // stores value suppliers & item elements

//     for (let item of items) {
//         const { name, input } = item;
//         const { attribute, type } = input;

//         const itemElement = createElement("div", { c: "item", p: itemsContainer });
//         const headingElement = createElement("h3", { p: itemElement, t: name });

//         let valueSupplier; // null indicates no value provide

//         switch (type) {
//             case "date": {
//                 itemElement.classList.add("date");
//                 createSpacer(10, { p: itemElement });

//                 const inputElement = createElement("input", { p: itemElement });
//                 inputElement.type = "date";
//                 setDateCurrent(inputElement);

//                 valueSupplier = () => {
//                     const val = inputElement.value;
//                     return (val === "") ? null : val;
//                 };

//                 break;
//             }
//             case "duration": {
//                 itemElement.classList.add("duration");
//                 createSpacer(10, { p: itemElement });

//                 const inputContainer = createElement("div", { c: "input-container", p: itemElement });

//                 const createTimeInput = (unit, max) => {
//                     const inputElement = createElement("input", { p: inputContainer });
//                     inputElement.type = "text";
//                     inputElement.placeholder = 0;

//                     inputElement.addEventListener("input", () => {
//                         const val = parseInt(inputElement.value);

//                         if (isNaN(val) || val === 0) {
//                             inputElement.value = null;
//                         } else if (val > max) {
//                             inputElement.value = max;
//                         } else {
//                             inputElement.value = Math.abs(val);
//                         }
//                     })

//                     createElement("p", { p: inputContainer, t: unit });
//                     return inputElement;
//                 }
//                 const createColon = () => createElement("p", { c: "colon", p: inputContainer, t: ":" });

//                 const hoursElement = createTimeInput("h", 99);
//                 createColon();
//                 const minutesElement = createTimeInput("m", 59);
//                 createColon();
//                 const secondsElement = createTimeInput("s", 59);

//                 valueSupplier = () => {
//                     const total = (hoursElement.value || 0) * 3600 + (minutesElement.value || 0) * 60 + (secondsElement.value || 0);
//                     return (total > 0) ? total : null;
//                 }

//                 break;
//             }
//             case "slider": {
//                 const { min, max, step, value, display } = input.slider;
//                 itemElement.classList.add("slider");

//                 const sliderElement = createElement("input");
//                 sliderElement.type = "range";
//                 sliderElement.max = max;
//                 sliderElement.min = min;
//                 sliderElement.step = step
//                 sliderElement.value = value;

//                 valueSupplier = () => sliderElement.value;

//                 if (display) {
//                     const displayElement = createElement("p", { p: itemElement });
//                     const updateDisplayText = () => displayElement.innerHTML = display(sliderElement.value);

//                     updateDisplayText();
//                     sliderElement.addEventListener("input", updateDisplayText);
//                 }

//                 itemElement.appendChild(sliderElement);
//                 break;
//             }
//             case "textLong": {
//                 itemElement.classList.add("text-long");
//                 createSpacer(10, { p: itemElement });

//                 const textElement = createElement("textarea", { p: itemElement });

//                 valueSupplier = () => {
//                     const val = textElement.value;
//                     return (val === "") ? null : val;
//                 };

//                 break;
//             }
//             case "textShort": {
//                 itemElement.classList.add("text-short");
//                 createSpacer(10, { p: itemElement });

//                 const inputElement = createElement("input", { p: itemElement });
//                 inputElement.type = "text";

//                 valueSupplier = () => {
//                     const val = inputElement.value;
//                     return (val === "") ? null : val;
//                 };

//                 break;
//             }
//         }

//         itemStorage[attribute] = {
//             valueSupplier,
//             heading: headingElement
//         }
//     }

//     const infoElement = createElement("p", { p: inputSectionElement });

//     createElement("button", {
//         c: "create", p: inputSectionElement, t: "Create", onClick: async () => {
//             let missing = false;
//             const log = {};

//             for (let attribute in itemStorage) {
//                 const { heading, valueSupplier } = itemStorage[attribute];
//                 const value = valueSupplier();

//                 if (value == null) {
//                     heading.classList.add("required");
//                     missing = true;
//                 } else {
//                     heading.classList.remove("required");
//                     log[attribute] = value;
//                 }
//             }

//             if (missing) {
//                 infoElement.innerHTML = "You are missing required fields!";
//                 return;
//             }

//             const logElement = _createDisplaySection(logType, log, true);
//             logDisplayElement.appendChild(logElement);

//             const loadingElement = createElement("div", { c: "loading" });
//             logElement.insertBefore(loadingElement, logElement.childNodes[0]);

//             inputSectionElement.remove();
//             createLogElement.style.display = "flex";

//             await postRequest(`/users/${getUserId()}/logs/${logType}`, { log });
//             loadingElement.remove();
//         }
//     });

//     return inputSectionElement;
// }