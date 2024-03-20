const express = require("express")
const general = require("../../server/general")
const sqlDatabase = require("../../server/sql-database")
const userDatabase = require("../../server/user-database")

const router = express.Router()

router.get("/", async (req, res) => {
    const data = {}
    const totalAwards = data.totalAwards = []
    const firstLevelAwards = data.firstLevelAwards = []

    await userDatabase.forEachUser((id, db) => {
        let userTotalAwards = 0
        let userFirstLevelAwards = 0

        const awards = db.get(userDatabase.AWARDS_PATH)

        for (let awardId in awards) {
            if (awards[awardId].complete) {
                userTotalAwards++

                if (general.isAward(awardId, true)) {
                    userFirstLevelAwards++
                }
            }
        }

        if (userTotalAwards > 0) totalAwards.push({ user: id, value: userTotalAwards })
        if (userFirstLevelAwards > 0) firstLevelAwards.push({ user: id, value: userFirstLevelAwards })
    })

    totalAwards.sort((a, b) => b.value - a.value)
    firstLevelAwards.sort((a, b) => b.value - a.value)

    data.distanceRun = await sqlDatabase.all("SELECT user, SUM(distance) AS value FROM running_logs GROUP BY user ORDER BY SUM(distance) DESC")
    data.distancePaddled = await sqlDatabase.all("SELECT user, SUM(distance) AS value FROM river_trip_logs GROUP BY user ORDER BY SUM(distance) DESC")
    data.distanceSwum = await sqlDatabase.all("SELECT user, SUM(distance) AS value FROM midmar_mile_training_logs GROUP BY user ORDER BY SUM(distance) DESC")
    data.elevationGained = await sqlDatabase.all("SELECT user, SUM(elevation_gain) AS value FROM mountaineering_logs GROUP BY user ORDER BY SUM(elevation_gain) DESC")
    data.serviceHours = await sqlDatabase.all("SELECT user, SUM(time) AS value FROM service_logs GROUP BY user ORDER BY SUM(time) DESC")

    await general.forEachAsync(Object.keys(data), async key => {
        const leaderboardType = data[key]
        await general.forEachAsync(leaderboardType, async val => {
            val.user = await general.getUserInfo(val.user)
        })
    })

    res.res(200, { data })
})

module.exports = router