const express = require("express")
const general = require("../server/general")
const sqlDatabase = require("../server/sql-database")

const router = express.Router()

const userRouter = express.Router()

router.use("/:userId", async (req, res, next) => { // verify user ID
    const { userId: profileUserId } = req.params

    if (await sqlDatabase.isUser(profileUserId)) {
        req.targetUserId = profileUserId
        res.placeholders.profileUser = await general.getUserDetails(profileUserId)
        next()
    } else {
        res.ren("errors/invalid-user")
    }
}, userRouter)

userRouter.get("/", (req, res) => {
    res.ren("profile/profile")
})

module.exports = router