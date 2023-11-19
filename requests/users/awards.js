const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const sqlDatabase = require("../../server/sql-database")
const middleware = require("../middleware")
const userDatabase = require("../../server/user-database")

const router = express.Router()

router.get("/", async (req, res) => { // get user award info
    const { permissions, targetUserId, userId } = req
    const awards = userDatabase.getUser(targetUserId).get(userDatabase.AWARDS_PATH) ?? {}

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

router.get("/midmarMile/distance", async (req, res) => { // get total training distance
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM midmar_mile_training_logs WHERE user = ${targetUserId}`)
    res.res(200, { distance: total ?? 0 })
})

router.get("/kayaking/distance", async (req, res) => { // get total distance paddled on trips
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM river_trip_logs WHERE user = ${targetUserId}`)
    res.res(200, { distance: total ?? 0 })
})

router.get("/kayaking/trips", async (req, res) => { // get total paddling trips
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT COUNT() AS total FROM river_trip_logs WHERE user = ${targetUserId}`)
    res.res(200, { trips: total ?? 0 })
})

router.get("/mountaineering/elevation", async (req, res) => { // get total elevation gained
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT SUM(elevation_gain) AS total FROM mountaineering_logs WHERE user = ${targetUserId}`)
    res.res(200, { elevation: total ?? 0 })
})

router.get("/mountaineering/distance", async (req, res) => { // get total distance hiked
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM mountaineering_logs WHERE user = ${targetUserId}`)
    res.res(200, { distance: total ?? 0 })
})

router.get("/mountaineering/trips", async (req, res) => { // get total hiking trips
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT COUNT() AS total FROM mountaineering_logs WHERE user = ${targetUserId}`)
    res.res(200, { trips: total ?? 0 })
})

router.get("/running/distance", async (req, res) => { // get total distance run
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM running_logs WHERE user = ${targetUserId}`)
    res.res(200, { distance: total ?? 0 })
})

router.get("/service/hours", async (req, res) => { // get total service hours
    const { targetUserId } = req
    const { total } = await sqlDatabase.get(`SELECT SUM(time) AS total FROM service_logs WHERE user = ${targetUserId}`)
    res.res(200, { time: total ?? 0 })
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

awardRouter.put("/", middleware.getPermissionMiddleware("manageAwards"), async (req, res) => { // set user award completion
    const { awardId, body, targetUserId, userId } = req
    const { complete } = body

    const userDb = userDatabase.getUser(targetUserId)
    const path = userDatabase.AWARDS_PATH + "." + awardId

    if (complete === true) {
        if (userDb.get(path + ".complete")) {
            res.res(409, "already_signed")
            return
        }

        userDb.set(path, {
            complete: true,
            date: new Date(),
            signer: userId
        })

        // add to recent awards
        const recentAwards = jsonDatabase.get(jsonDatabase.RECENT_AWARDS_PATH) ?? []
        recentAwards.unshift({
            user: targetUserId,
            award: awardId,
            date: new Date()
        })
        jsonDatabase.set(jsonDatabase.RECENT_AWARDS_PATH, recentAwards)
    } else {
        userDb.delete(path + ".complete")
        userDb.delete(path + ".date")
        userDb.delete(path + ".signer")
    }

    const awardData = userDb.get(path)
    await general.provideUserInfoToStatus(awardData)
    res.res(200, { award: awardData })
})

awardRouter.put("/cancel-request", middleware.requireSelf, (req, res) => { // cancel signoff request
    const { awardId, targetUserId } = req
    userDatabase.getUser(targetUserId).delete(`${userDatabase.AWARDS_PATH}.${awardId}.requestDate`)
    res.res(204)
})

awardRouter.put("/clear-decline", middleware.requireSelf, (req, res) => { // clear decline
    const { awardId, targetUserId } = req
    userDatabase.getUser(targetUserId).delete(`${userDatabase.AWARDS_PATH}.${awardId}.decline`)
    res.res(204)
})

awardRouter.put("/decline-request", middleware.getPermissionMiddleware("manageAwards"), (req, res) => { // decline signoff request
    const { awardId, body, targetUserId, userId } = req
    const { message } = body

    const userDb = userDatabase.getUser(targetUserId)
    const path = userDatabase.AWARDS_PATH + "." + awardId

    if (userDb.get(path + ".complete")) {
        res.res(409, "already_signed")
        return
    }

    const decline = {
        date: new Date(),
        user: userId
    }

    if (message) decline.message = message
    userDb.set(path, { decline })

    res.res(204)
})

awardRouter.put("/request-signoff", middleware.requireSelf, (req, res) => { // request signoff
    const { awardId, targetUserId } = req

    const path = `${userDatabase.AWARDS_PATH}.${awardId}`
    const userData = userDatabase.getUser(targetUserId)
    const awardData = userData.get(path) ?? {}

    if (awardData.complete) {
        res.res(409, "already_signed")
        return
    }

    userData.set(path, { requestDate: new Date() })
    res.res(204)
})

module.exports = router