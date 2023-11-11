const createError = require("http-errors")
const express = require("express")
const cookieParser = require("cookie-parser")
const general = require("./server/general")
const sqlDatabase = require("./server/sql-database")
const consoleCommands = require("./server/console-commands")
const requestsRouter = require("./requests/index")
const renderRouter = require("./render")
const https = require("https")
const fs = require("fs")

const PORT_HTTPS = 443
const PORT_HTTP = 80
const REQUESTS_PATH = "/requests"

const app = express()

sqlDatabase.createTables().then(general.createDummyUsers)

// view engine setup
app.set("views", "views")
app.set("view engine", "pug")

app.use(express.static("public"))
app.use(express.json()) // for reading json post requests
app.use(cookieParser()) // for cookie object

app.use("/", renderRouter) // render

app.use(REQUESTS_PATH, requestsRouter) // requests

app.use((req, res, next) => { // catch 404 and forward to error handler
    console.warn("Not found: " + req.url)
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
        console.warn("Page not found for client: " + req.path)
        res.setTitle(404)
        res.ren("errors/not-found")
    } else {
        console.error(err)
        res.setTitle(status)
        res.ren("errors/other")
    }
})

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/opawards.treverton.co.za/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/opawards.treverton.co.za/fullchain.pem')
}

https.createServer(options, app).listen(PORT_HTTPS, (req, res) => {
    console.info("Server started at port " + PORT_HTTPS)
})

const httpApp = express()

httpApp.use("/", (req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`)
});

httpApp.listen(PORT_HTTP)
consoleCommands()