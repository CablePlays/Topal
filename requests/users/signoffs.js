const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const middleware = require("../middleware")

const router = express.Router()

const awardRouter = express.Router()

router.use("/:awardId", (req, res, next) => { // verify award
    const { awardId } = req.params

    if (general.isAward(awardId)) {
        req.awardId = awardId
        next()
    } else {
        res.res(404, "invalid_award")
    }
}, awardRouter)

awardRouter.get("/", async (req, res) => { // get user signoffs
    const { awardId, targetUserId } = req

    if (awardId == null) {
        res.res(400)
        return
    }

    let signoffs = jsonDatabase.getUser(targetUserId).get(jsonDatabase.SIGNOFFS_PATH + (awardId ? "." + awardId : ""))

    if (signoffs) {
        await general.provideUserInfoToStatuses(signoffs)
    } else {
        signoffs = {}
    }

    res.res(200, { signoffs })
})

const awardSignoffRouter = express.Router()

awardRouter.use("/:signoffId", (req, res, next) => { // verify signoff
    const { awardId } = req
    const { signoffId } = req.params

    if (general.isSignoff(awardId, signoffId)) {
        req.signoffId = signoffId
        next()
    } else {
        res.res(404, "invalid_signoff")
    }
}, awardSignoffRouter)

awardSignoffRouter.put("/cancel-request", middleware.requireSelf, (req, res) => { // cancel signoff request
    const { awardId, signoffId, targetUserId } = req
    jsonDatabase.getUser(targetUserId).delete(`${jsonDatabase.SIGNOFFS_PATH}.${awardId}.${signoffId}.requestDate`)
    res.res(204)
})

awardSignoffRouter.put("/clear-decline", middleware.requireSelf, (req, res) => { // clear decline
    const { awardId, signoffId, targetUserId } = req
    jsonDatabase.getUser(targetUserId).delete(`${jsonDatabase.SIGNOFFS_PATH}.${awardId}.${signoffId}.decline`)
    res.res(204)
})

awardSignoffRouter.put("/request-signoff", middleware.requireSelf, (req, res) => { // request signoff
    const { awardId, signoffId, targetUserId } = req

    const path = `${jsonDatabase.SIGNOFFS_PATH}.${awardId}.${signoffId}`
    const userData = jsonDatabase.getUser(targetUserId)
    const signoffData = userData.get(path) ?? {}

    if (signoffData.complete) {
        res.res(409, "already_complete")
        return
    }

    userData.delete(path + ".decline")
    userData.set(path + ".requestDate", new Date())

    res.res(204)
})

module.exports = router