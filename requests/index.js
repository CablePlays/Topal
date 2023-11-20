const express = require("express")
const cookies = require("../server/cookies")
const general = require("../server/general")

const accountRouter = require("./account")
const adminRouter = require("./admin")
const awardsRouter = require("./awards")
const logsRouter = require("./logs")
const usersRouter = require("./users")

const router = express.Router()

router.use("/", (req, res, next) => { // provide response method
    res.res = (responseCode, extra) => {
        if (extra == null) {
            res.sendStatus(responseCode)
        } else if (typeof extra === "string") { // error: message
            res.status(responseCode).json({ error: extra })
        } else if (typeof extra === "object") { // success: json
            res.status(responseCode).json(extra)
        } else {
            throw new Error("Invalid type of extra: " + typeof extra)
        }
    }

    next()
})

router.use("/", async (req, res, next) => { // provide user information
    if (await general.isPasswordValid(req)) {
        const userId = cookies.getUserId(req)
        req.loggedIn = true
        req.userId = userId
        req.permissions = general.getPermissions(userId)
    } else {
        req.permissions = {}
        req.loggedIn = false
    }

    next()
})

/* Routers */

router.use("/account", accountRouter)
router.use("/admin", adminRouter)
router.use("/awards", awardsRouter)
router.use("/logs", logsRouter)
router.use("/users", usersRouter)

module.exports = router