const express = require("express")
const general = require("../server/general")
const jsonDatabase = require("../server/json-database")
const sqlDatabase = require("../server/sql-database")
const middleware = require("./middleware")

const router = express.Router()

const userRouter = express.Router()

router.use("/:userId", async (req, res, next) => { // verify user ID
    const { userId: profileUserId } = req.params

    if (await sqlDatabase.isUser(profileUserId)) {
        req.targetUserId = parseInt(profileUserId)
        const { placeholders } = res
        placeholders.profileUser = await general.getUserInfo(profileUserId)

        // grade
        let grade = await general.getGrade(profileUserId)
        if (grade) grade = (grade > 12) ? "Matriculated" : "Grade " + grade
        placeholders.grade = grade

        next()
    } else {
        res.ren("errors/invalid-user")
    }
}, userRouter)

userRouter.get("/", async (req, res) => {
    const { targetUserId } = req
    const { placeholders } = res

    function formatStat(val) {
        val = "" + val
        val = (val.length < 2 ? "0" : "") + val
        return val.replace(".", ",")
    }

    // total awards

    const awards = jsonDatabase.getUser(targetUserId).get(jsonDatabase.AWARDS_PATH)
    let totalAwards = 0
    let totalBaseAwards = 0

    for (let awardId in awards) {
        const { complete } = awards[awardId]

        if (complete) {
            totalAwards++

            if (!awardId.endsWith("Instructor") && !awardId.endsWith("Leader")) {
                totalBaseAwards++
            }
        }
    }

    // running distance
    const { total: totalDistanceRun } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM running_logs WHERE user = "${targetUserId}"`)

    // total kayaking
    const { total: totalPaddlingTrips } = await sqlDatabase.get(`SELECT COUNT(*) AS total FROM river_trip_logs WHERE user = "${targetUserId}"`)

    placeholders.profilePlaceholders = {
        stats: {
            opPoints: formatStat(0),
            totalAwards,
            totalAwards0: formatStat(totalAwards),
            totalAwardsPlural: totalAwards === 1 ? "" : "s",
            totalBaseAwards,
            totalDistanceRun: formatStat((totalDistanceRun ?? 0) / 1000),
            totalPaddlingTrips: formatStat(totalPaddlingTrips)
        }
    }

    res.ren("profile/profile")
})

userRouter.get("/admin", middleware.getPermissionMiddleware("manageAwards"), (req, res) => {
    res.ren("profile/admin")
})

userRouter.get("/admin/:awardId", middleware.getPermissionMiddleware("manageAwards"), (req, res) => {
    const { awardId } = req.params

    if (general.isAward(general.kebabToCamel(awardId))) {
        res.ren("profile/admin-award")
    } else {
        res.ren("errors/not-found")
    }
})

module.exports = router