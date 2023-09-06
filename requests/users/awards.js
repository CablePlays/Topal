const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const middleware = require("../middleware")

const router = express.Router()

router.get("/", async (req, res) => { // get user award info
    const { targetUserId } = req
    const awards = jsonDatabase.getUser(targetUserId).get(jsonDatabase.AWARDS_PATH) ?? {}

    await general.provideUserInfoToStatuses(awards)
    res.res(200, { awards })
})

const awardRouter = express.Router()

router.use("/:awardId", (req, res, next) => {
    const { awardId } = req.params

    if (general.isAward(awardId)) {
        req.awardId = awardId
        next()
    } else {
        res.res(404, "invalid_award")
    }
}, awardRouter)

awardRouter.put("/cancel-request", middleware.requireSelf, (req, res) => { // cancel signoff request
    const { awardId, targetUserId } = req
    jsonDatabase.getUser(targetUserId).delete(`${jsonDatabase.AWARDS_PATH}.${awardId}.requestDate`)
    res.res(204)
})

awardRouter.put("/clear-decline", middleware.requireSelf, (req, res) => { // clear decline
    const { awardId, targetUserId } = req
    jsonDatabase.getUser(targetUserId).delete(`${jsonDatabase.AWARDS_PATH}.${awardId}.decline`)
    res.res(204)
})

awardRouter.put("/request-signoff", middleware.requireSelf, (req, res) => { // request signoff
    const { awardId, targetUserId } = req

    const path = `${jsonDatabase.AWARDS_PATH}.${awardId}`
    const userData = jsonDatabase.getUser(targetUserId)
    const awardData = userData.get(path) ?? {}

    if (awardData.complete) {
        res.res(409, "already_complete")
        return
    }

    userData.set(path, { requestDate: new Date() })
    res.res(204)
})

module.exports = router