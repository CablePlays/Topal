const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const consoleCommands = require("./server/console-commands");
const requestsRouter = require("./requests/index");
const renderRouter = require("./render");
const https = require("https");
const fs = require("fs");

const PORT = 90;
const REQUESTS_PATH = "/requests";

const app = express();

consoleCommands();

// view engine setup
app.set('views', 'views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.json()); // for reading json post requests
app.use(cookieParser()); // for cookie object

app.use("/", renderRouter); // render

app.use(REQUESTS_PATH, requestsRouter); // requests

app.use((req, res, next) => { // catch 404 and forward to error handler
    console.warn("Not found: " + req.url);
    next(createError(404));
});

app.use(REQUESTS_PATH, (err, req, res, next) => { // handle request errors
    console.error(err);
    let status = err.status || 500;
    res.sendStatus(status);
});

app.use((err, req, res, next) => { // handle render errors
    let status = err.status || 500;
    res.status(status);
    console.error(err);

    // set locals
    res.locals.message = err.message;
    res.locals.status = status;

    if (status === 404) {
        res.advancedRender("errors/not-found");
    } else {
        res.advancedRender("errors/other");
    }
});

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/opawards.treverton.co.za/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/opawards.treverton.co.za/fullchain.pem')
};

https.createServer(options, app).listen(PORT, (req, res) => {
    console.info("Server started at port " + PORT);
});