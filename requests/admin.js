const express = require("express")
const general = require("../server/general")
const jsonDatabase = require("../server/json-database")
const sqlDatabase = require("../server/sql-database")
const userDatabase = require("../server/user-database")
const middleware = require("./middleware")

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

router.get("/requests", middleware.getPermissionMiddleware("manageAwards"), async (req, res) => { // get number of signoff requests for each user
    const users = {}

    function incrementRequests(userId, awardId, amount = 1) {
        const user = users[userId] ??= {}
        const requests = user.requests ??= {}

        if (requests[awardId]) {
            requests[awardId] += amount
        } else {
            requests[awardId] = amount
        }
    }

    // awards and signoffs
    await userDatabase.forEachUser((userId, db) => {
        const awards = db.get(userDatabase.AWARDS_PATH) ?? {}

        for (let awardId in awards) {
            const award = awards[awardId]

            if (award.requestDate) {
                incrementRequests(userId, awardId)
            }
        }

        const signoffs = db.get(userDatabase.SIGNOFFS_PATH) ?? {}

        for (let awardId in signoffs) {
            const award = signoffs[awardId]

            for (let signoffId in award) {
                const signoff = award[signoffId]

                if (signoff.requestDate) {
                    incrementRequests(userId, awardId)
                }
            }
        }
    })

    // logs
    let asyncTasks = []

    for (let logType of general.getLogTypes()) {
        if (general.isSignable(logType)) {
            const logsTable = general.getLogsTable(logType)
            const promise = sqlDatabase.all(`SELECT user, COUNT() AS count FROM ${logsTable} WHERE sign_state = "requested" GROUP BY user`)
            asyncTasks.push(promise)

            promise.then(records => {
                const awardId = general.getLogTypeSignoffRequestAward(logType)

                for (let record of records) {
                    const { user: userId, count } = record
                    incrementRequests(userId, awardId, count)
                }
            })
        }
    }

    await Promise.all(asyncTasks)

    // provide user info
    asyncTasks = []

    for (let userId in users) {
        const promise = general.getUserInfo(userId)
        asyncTasks.push(promise)
        promise.then(info => users[userId].info = info)
    }

    await Promise.all(asyncTasks)
    res.res(200, { users })
})

module.exports = router