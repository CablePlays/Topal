const express = require("express")
const general = require("../server/general")
const jsonDatabase = require("../server/json-database")
const middleware = require("./middleware")

const router = express.Router()

router.get("/award-history", middleware.getPermissionMiddleware("viewAwardHistory"), async (req, res) => { // get list of award grantings
    const history = []
    const asyncTasks = []

    await jsonDatabase.forEachUser((userId, db) => {
        const awards = db.get(jsonDatabase.AWARDS_PATH)

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

module.exports = router