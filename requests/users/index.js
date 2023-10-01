const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const sqlDatabase = require("../../server/sql-database")

const awardsRouter = require("./awards")
const infoRouter = require("./info")
const linksRouter = require("./links")
const signoffsRouter = require("./signoffs")

const router = express.Router()

router.get("/search", async (req, res) => { // search users using query
    const { query } = req
    const searchQuery = query.query?.toLowerCase()

    if (searchQuery == null) {
        res.res(400, "missing_query")
        return
    }

    const resultUserIds = []
    const allUsers = await sqlDatabase.all(`SELECT * FROM users`)

    function storeResultPosition(userId) {
        if (!resultUserIds.includes(userId)) {
            resultUserIds.push(userId)
        }
    }

    // name
    for (let user of allUsers) {
        const { id } = user
        let { name, surname } = jsonDatabase.getUser(id).get(jsonDatabase.DETAILS_PATH) ?? {}
        name = name?.toLowerCase()
        surname = surname?.toLowerCase()

        if (searchQuery.includes(name) || name.includes(searchQuery)
            || searchQuery.includes(surname) || surname.includes(searchQuery)) {
            storeResultPosition(id)
        }
    }

    // grade
    for (let user of allUsers) {
        const { id, email } = user
        const grade = general.getGradeFromEmail(email)

        if (searchQuery == grade) {
            storeResultPosition(id)
        }
    }

    // email
    for (let user of allUsers) {
        const { id, email } = user

        if (email.includes(searchQuery) || searchQuery.includes(email)) {
            storeResultPosition(id)
        }
    }

    // remaining
    for (let user of allUsers) {
        storeResultPosition(user.id)
    }

    const results = []
    const asyncTasks = []

    for (let i = 0; i < resultUserIds.length; i++) {
        const userId = resultUserIds[i]

        asyncTasks.push(new Promise(async r => {
            const { email, profilePicture, titleName } = await general.getUserDetails(userId)

            results[i] = {
                id: userId,
                name: titleName,
                grade: general.getGradeFromEmail(email),
                profilePicture: profilePicture ?? general.DEFAULT_PROFILE_PICTURE_PATH
            }

            r()
        }))
    }

    await Promise.all(asyncTasks)
    res.res(200, { results })
})

const targetUserRouter = express.Router()

router.use("/:targetUserId", async (req, res, next) => { // verify target user
    const { targetUserId } = req.params

    if (await sqlDatabase.isUser(targetUserId)) {
        req.targetUserId = parseInt(targetUserId)
        next()
    } else {
        res.res(404, "invalid_user")
    }
}, targetUserRouter)

targetUserRouter.use("/awards", awardsRouter)
targetUserRouter.use("/info", infoRouter)
targetUserRouter.use("/links", linksRouter)
targetUserRouter.use("/signoffs", signoffsRouter)

module.exports = router