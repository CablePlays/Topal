const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const userDatabase = require("../../server/user-database")
const middleware = require("../middleware")

const checklistRouter = require("./checklist")

const router = express.Router()

router.get("/award-history", middleware.getPermissionMiddleware("viewAwardHistory"), async (req, res) => { // get list of award grantings
    const history = []
    const asyncTasks = []

    await userDatabase.forEachUser((userId, db) => {
        const awards = db.get(userDatabase.AWARDS_PATH)

        for (let awardId in awards) {
            const award = awards[awardId]

            if (award.complete) {
                delete award.complete
                award.award = awardId

                const signerInfoPromise = general.getUserInfo(award.signer)
                signerInfoPromise.then(v => award.signer = v)
                asyncTasks.push(signerInfoPromise)

                const userInfoPromise = general.getUserInfo(userId)
                userInfoPromise.then(v => award.user = v)
                asyncTasks.push(userInfoPromise)

                history.push(award)
            }
        }
    })

    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    await Promise.all(asyncTasks)
    res.res(200, { history })
})

const housePointsRouter = express.Router()

router.use("/house-points", middleware.getPermissionMiddleware("manageHousePoints"), housePointsRouter)

housePointsRouter.put("/", (req, res) => {
    const { body } = req
    const path = jsonDatabase.HOUSE_POINTS_PATH + ".points"

    for (let houseId of ["campbell", "harland", "jonsson"]) {
        const housePoints = body[houseId]

        if (housePoints != null) {
            jsonDatabase.set(`${path}.${houseId}`, housePoints)
        }
    }

    jsonDatabase.set(jsonDatabase.HOUSE_POINTS_PATH + "." + "lastUpdated", new Date())
    res.res(204)
})

housePointsRouter.put("/visible", (req, res) => { // set house points visibility
    const { body } = req
    const visible = body.visible === true

    jsonDatabase.set(jsonDatabase.HOUSE_POINTS_PATH + ".visible", visible)
    res.res(204)
})

const newAwardsRouter = express.Router()

router.use("/new-awards", middleware.getPermissionMiddleware("viewNewAwards"), newAwardsRouter)

newAwardsRouter.delete("/", async (req, res) => { // delete a new award
    const { body } = req
    const { id } = body

    if (isNaN(parseInt(id))) {
        res.res(400, "invalid_id")
        return
    }

    jsonDatabase.del(jsonDatabase.NEW_AWARDS_PATH + "." + id)
    res.res(204)
})

newAwardsRouter.get("/", async (req, res) => { // get new awards
    const newAwards = jsonDatabase.get(jsonDatabase.NEW_AWARDS_PATH) ?? {}
    const promises = []

    for (let id in newAwards) {
        const promise = general.getUserInfo(newAwards[id].user).then(info => {
            newAwards[id].user = info
        })

        promises.push(promise)
    }

    await Promise.all(promises)
    res.res(200, { newAwards })
})

router.get("/requests", middleware.getPermissionMiddleware("manageAwards"), async (req, res) => { // get number of signoff requests for each user
    const users = await general.getSignoffRequestsInfo()
    res.res(200, { users })
})

router.use("/checklist", middleware.getPermissionMiddleware("manageChecklist"), checklistRouter)

module.exports = router