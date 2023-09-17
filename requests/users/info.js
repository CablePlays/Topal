const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const middleware = require("../middleware")

const router = express.Router()

router.get("/", async (req, res) => {
    const { targetUserId } = req
    const userInfo = await general.getUserInfo(targetUserId)
    res.res(200, { info: userInfo })
})

router.put("/", middleware.requireSelf, async (req, res) => {
    const { body, targetUserId } = req
    let { name, surname, title } = body
    name = name?.trim()
    surname = surname?.trim()

    const userDatabase = jsonDatabase.getUser(targetUserId)

    if (name && name.trim()) userDatabase.set(jsonDatabase.DETAILS_PATH + ".name", name)
    if (surname) userDatabase.set(jsonDatabase.DETAILS_PATH + ".surname", surname)

    if (title !== undefined) {
        const path = jsonDatabase.DETAILS_PATH + ".title"

        if (["Mr", "Ms", "Mrs", "Dr"].includes(title)) {
            userDatabase.set(path, title)
        } else {
            userDatabase.delete(path)
        }
    }

    const userInfo = await general.getUserInfo(targetUserId)
    res.res(200, { info: userInfo })
})

module.exports = router