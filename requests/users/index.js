const express = require("express")
const sqlDatabase = require("../../server/sql-database")

const awardsRouter = require("./awards")
const infoRouter = require("./info")
const signoffsRouter = require("./signoffs")
const general = require("../../server/general")

const router = express.Router()

const targetUserRouter = express.Router()

router.use("/:targetUserId", async (req, res, next) => { // verify target user
    const { targetUserId } = req.params

    if (await sqlDatabase.isUser(targetUserId)) {
        req.targetUserId = parseInt(targetUserId)
        next()
    } else {
        res.res(404, "invalid_user")
    }
}, targetUserRouter)

targetUserRouter.use("/awards", awardsRouter)
targetUserRouter.use("/info", infoRouter)
targetUserRouter.use("/signoffs", signoffsRouter)

module.exports = router