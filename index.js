const createError = require("http-errors")
const express = require("express")
const cookieParser = require("cookie-parser")
const general = require("./server/general")
const jsonDatabase = require("./server/json-database")
const sqlDatabase = require("./server/sql-database")
const consoleCommands = require("./server/console-commands")
const emailer = require("./server/emailer")
const requestsRouter = require("./requests/index")
const renderRouter = require("./render")
const userDatabase = require("./server/user-database")

const PORT = 3000
const ARTIFICIAL_LATENCY = 0
const REQUESTS_PATH = "/requests"

const app = express()
const devEnv = process.env.NODE_ENV === "development"

sqlDatabase.createTables().then(general.createDummyUsers)
jsonDatabase.setCompact(!devEnv)
userDatabase.setCompact(!devEnv)

// view engine setup
app.set("view engine", "pug")
app.set("views", "views")

app.use("/", express.static("public"))
app.use(express.json()) // for reading json post requests
app.use(cookieParser()) // for cookie object

app.use("/", renderRouter) // render
app.use(REQUESTS_PATH, (req, res, next) => { // requests
    if (devEnv && ARTIFICIAL_LATENCY > 0) {
        setTimeout(next, ARTIFICIAL_LATENCY)
    } else {
        next()
    }
}, requestsRouter)

app.use((req, res, next) => { // forward 404 to error handler
    next(createError(404))
})

app.use(REQUESTS_PATH, (err, req, res, next) => { // handle request errors
    const status = err.status ?? 500
    console.error(err)
    res.sendStatus(status)
})

app.use((err, req, res, next) => { // handle render errors
    const status = err.status ?? 500
    res.status(status)

    // set locals
    res.locals.message = err.message
    res.locals.status = status

    if (status === 404) {
        console.warn(`Not found: ${req.path}`)
        res.setTitle(404)
        res.ren("errors/not-found")
    } else {
        console.error(err)
        res.setTitle(status)
        res.ren("errors/other")
    }
})

app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`)
})

consoleCommands()
emailer.scheduleEmails()