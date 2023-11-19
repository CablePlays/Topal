const express = require("express")
const general = require("../server/general")
const jsonDatabase = require("../server/json-database")
const sqlDatabase = require("../server/sql-database")
const middleware = require("./middleware")

const router = express.Router()

const micsRouter = express.Router()

router.use("/mics", micsRouter)

micsRouter.get("/", (req, res) => { // get MICs of awards
    const awards = jsonDatabase.get(jsonDatabase.AWARDS_PATH) ?? {}
    const awardMics = {}

    for (let awardId of Object.keys(awards)) {
        const mics = awards[awardId].mics
        if (mics) awardMics[awardId] = mics
    }

    res.res(200, { mics: awardMics })
})

const micsAwardIdRouter = express.Router()

micsRouter.use("/:awardId", middleware.getPermissionMiddleware("manageMics"), (req, res, next) => { // verify valid first level award ID
    const { awardId } = req.params

    if (general.isAward(awardId, true)) {
        req.awardId = awardId
        next()
    } else {
        res.res(404, "invalid_award")
    }
}, micsAwardIdRouter)

micsAwardIdRouter.delete("/", (req, res) => { // remove MIC for award
    const { awardId, body } = req
    const mic = body.mic?.trim()

    if (mic == null || mic === "") {
        res.res(400, "invalid_mic")
        return
    }

    const path = jsonDatabase.AWARDS_PATH + "." + awardId + ".mics"
    const mics = jsonDatabase.get(path) ?? []
    mics.splice(mics.indexOf(mic), 1)
    jsonDatabase.set(path, mics)

    res.res(204)
})

micsAwardIdRouter.post("/", (req, res) => { // add MIC for award
    const { awardId, body } = req
    const mic = body.mic?.trim()

    if (mic == null || mic === "") {
        res.res(400, "invalid_mic")
        return
    }

    jsonDatabase.push(jsonDatabase.AWARDS_PATH + "." + awardId + ".mics", mic)
    res.res(200, { mic })
})

module.exports = router