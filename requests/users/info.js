const express = require("express")
const general = require("../../server/general")
const userDatabase = require("../../server/user-database")
const middleware = require("../middleware")

const router = express.Router()

router.get("/", async (req, res) => { // get user info
    const { targetUserId } = req
    const userInfo = await general.getUserInfo(targetUserId)
    res.res(200, { info: userInfo })
})

router.put("/title", middleware.requireSelf, async (req, res) => { // set user title
    const { body, targetUserId } = req
    const { title } = body

    const userDb = userDatabase.getUser(targetUserId)
    const path = userDatabase.DETAILS_PATH + ".title"

    if (["Mr", "Ms", "Mrs", "Dr"].includes(title)) {
        userDb.set(path, title)
    } else {
        userDb.delete(path)
    }

    res.res(204)
})

module.exports = router