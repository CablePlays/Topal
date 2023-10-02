const createError = require("http-errors")
const express = require("express")
const cookieParser = require("cookie-parser")
const general = require("./server/general")
const sqlDatabase = require("./server/sql-database")
const consoleCommands = require("./server/console-commands")
const requestsRouter = require("./requests/index")
const renderRouter = require("./render")

const PORT = 80
const ARTIFICIAL_LATENCY = 500
const REQUESTS_PATH = "/requests"

const app = express()

sqlDatabase.createTables().then(general.createDummyUsers)

// view engine setup
app.set('views', 'views')
app.set('view engine', 'pug')

app.use(express.static('public'))
app.use(express.json()) // for reading json requests
app.use(cookieParser()) // for cookie object

app.use("/", renderRouter) // render

if (ARTIFICIAL_LATENCY > 0) {
    console.info(`Using artificial latency: ${ARTIFICIAL_LATENCY}ms`)

    app.use("/", (req, res, next) => {
        setTimeout(next, ARTIFICIAL_LATENCY)
    })
}

app.use(REQUESTS_PATH, requestsRouter) // requests

app.use((req, res, next) => { // catch 404 and forward to error handler
    console.warn("Not found: " + req.url)
    next(createError(404))
})

app.use(REQUESTS_PATH, (err, req, res, next) => { // handle request errors
    console.error(err)
    const status = err.status ?? 500
    res.sendStatus(status)
})

app.use((err, req, res, next) => { // handle render errors
    const status = err.status ?? 500
    res.status(status)
    console.error(err)

    // set locals
    res.locals.message = err.message
    res.locals.status = status

    if (status === 404) {
        res.ren("errors/not-found")
    } else {
        res.ren("errors/other")
    }
})

app.listen(PORT)
consoleCommands()