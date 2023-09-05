const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")

const router = express.Router()

router.get("/", async (req, res) => { // get user award info
    const { targetUserId } = req
    const awards = jsonDatabase.getUser(targetUserId).get(jsonDatabase.AWARDS_PATH) ?? {}

    await general.provideUserInfoToStatuses(awards)
    res.res(200, { awards })
})

module.exports = router