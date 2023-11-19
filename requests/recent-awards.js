const express = require("express")
const general = require("../server/general")
const jsonDatabase = require("../server/json-database")
const userDatabase = require("../server/user-database")

const router = express.Router()

router.get("/", async (req, res) => { // get recent awards
    const recentAwards = jsonDatabase.get(jsonDatabase.RECENT_AWARDS_PATH) ?? []
    const now = new Date().getTime()
    let update = false

    for (let i = recentAwards.length - 1; i >= 0; i--) { // check expired
        const { date } = recentAwards[i]
        const hoursDifference = Math.floor((now - new Date(date).getTime()) / 3600000)

        if (hoursDifference > general.RECENT_AWARDS_LIFETIME) {
            recentAwards.splice(i, 1)
            update = true
        }
    }

    if (update) {
        jsonDatabase.set(jsonDatabase.RECENT_AWARDS_PATH, recentAwards)
    }
    if (recentAwards.length > general.RECENT_AWARDS_MAX) { // max
        recentAwards.splice(general.RECENT_AWARDS_MAX, recentAwards.length - general.RECENT_AWARDS_MAX)
    }

    await general.forEachAndWait(recentAwards, async recentAward => {
        recentAward.user = await general.getUserInfo(recentAward.user)
    })

    res.res(200, { recentAwards })
})

module.exports = router