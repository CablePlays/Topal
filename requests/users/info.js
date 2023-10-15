const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const middleware = require("../middleware")

const router = express.Router()

router.get("/", async (req, res) => { // get user info
    const { targetUserId } = req
    const userInfo = await general.getUserInfo(targetUserId)
    console.log(userInfo)
    res.res(200, { info: userInfo })
})

router.put("/title", middleware.requireSelf, async (req, res) => { // set user title
    const { body, targetUserId } = req
    const { title } = body

    const userDatabase = jsonDatabase.getUser(targetUserId)
    const path = jsonDatabase.DETAILS_PATH + ".title"

    if (["Mr", "Ms", "Mrs", "Dr"].includes(title)) {
        userDatabase.set(path, title)
    } else {
        userDatabase.delete(path)
    }

    res.res(204)
})

module.exports = router