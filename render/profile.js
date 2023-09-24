const express = require("express")
const general = require("../server/general")
const sqlDatabase = require("../server/sql-database")

const router = express.Router()

const userRouter = express.Router()

router.use("/:userId", async (req, res, next) => { // verify user ID
    const { userId: profileUserId } = req.params

    if (await sqlDatabase.isUser(profileUserId)) {
        req.targetUserId = profileUserId
        const { placeholders } = res
        placeholders.profileUser = await general.getUserDetails(profileUserId)

        // grade
        let grade = await general.getGrade(profileUserId)
        if (grade) grade = (grade > 12) ? "Matriculated" : "Grade " + grade
        placeholders.grade = grade

        next()
    } else {
        res.ren("errors/invalid-user")
    }
}, userRouter)

userRouter.get("/", (req, res) => {
    res.ren("profile/profile")
})

module.exports = router