const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const sqlDatabase = require("../../server/sql-database")
const middleware = require("../middleware")

const router = express.Router()

router.get("/", async (req, res) => { // get user award info
    const { permissions, targetUserId, userId } = req
    const awards = jsonDatabase.getUser(targetUserId).get(jsonDatabase.AWARDS_PATH) ?? {}

    if (userId !== targetUserId && !permissions.manageAwards) { // remove data other than complete, date and signer
        for (let awardId in awards) {
            const award = awards[awardId]

            for (let key in award) {
                if (key !== "complete" && key !== "date" && key !== "signer") {
                    delete award[key]
                }
            }
        }
    }

    await general.provideUserInfoToStatuses(awards)
    res.res(200, { awards })
})

router.get("/midmarMile/trainingDistance", async (req, res) => { // get total training distance
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM midmar_mile_training_logs WHERE user = "${targetUserId}"`)
    res.res(200, { distance: total ?? 0 })
})

router.get("/running/distance", async (req, res) => { // get total distance run
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM running_logs WHERE user = "${targetUserId}"`)
    res.res(200, { distance: total ?? 0 })
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