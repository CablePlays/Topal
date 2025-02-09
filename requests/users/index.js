const express = require("express")
const general = require("../../server/general")
const userDatabase = require("../../server/user-database")
const sqlDatabase = require("../../server/sql-database")
const middleware = require("../middleware")

const awardsRouter = require("./awards")
const checklistRouter = require("./checklist")
const infoRouter = require("./info")
const leaderboardsRouter = require("./leaderboards")
const linksRouter = require("./links")
const permissionsRouter = require("./permissions")
const signoffsRouter = require("./signoffs")

const router = express.Router()

const permissionsRouter0 = express.Router()

router.use("/permissions", middleware.getPermissionMiddleware("managePermissions"), permissionsRouter0)

permissionsRouter0.get("/", async (req, res) => { // get users with permissions & their permissions
    const users = await sqlDatabase.getUsers()
    const permissionUsers = []
    const asyncTasks = []

    for (let userId of users) {
        const permissions = general.getPermissions(userId, true)

        if (permissions.any && !general.isUserInvisible(userId)) {
            const promise = general.getUserInfo(userId)
            const obj = { permissions }

            asyncTasks.push(promise)
            promise.then(val => obj.info = val)
            permissionUsers.push(obj)
        }
    }

    await Promise.all(asyncTasks)
    res.res(200, { users: permissionUsers })
})

permissionsRouter0.get("/user", middleware.getPermissionMiddleware("managePermissions"), async (req, res) => { // get user permissions from email
    const { email } = req.query
    const userId = await sqlDatabase.getUserId(email)

    if (userId == null) {
        res.res(400, "invalid_user")
        return
    }

    const info = await general.getUserInfo(userId)
    const permissions = general.getPermissions(userId, true)
    res.res(200, { info, permissions })
})

router.get("/search", async (req, res) => { // search users using query
    const { query } = req
    const searchQuery = query.query?.toLowerCase()

    if (searchQuery == null) {
        res.res(400, "missing_query")
        return
    }

    let results = []
    const allUsers = await sqlDatabase.all(`SELECT * FROM users`)

    function storeResultPosition(userId) {
        if (!results.includes(userId)) {
            results.push(userId)
        }
    }

    // name
    for (let user of allUsers) {
        const { id } = user
        let { name, surname } = userDatabase.getUser(id).get(userDatabase.DETAILS_PATH) ?? {}
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
        const { id } = user
        storeResultPosition(id)
    }

    // remove invisible
    results = results.filter((userId) => !general.isUserInvisible(userId))

    // supply user info
    const asyncTasks = []

    for (let i = 0; i < results.length; i++) {
        const userId = results[i]

        asyncTasks.push(new Promise(async r => {
            const { grade, profilePicture, titleName } = await general.getUserInfo(userId)

            results[i] = {
                id: userId,
                name: titleName,
                grade,
                profilePicture
            }

            r()
        }))
    }

    await Promise.all(asyncTasks)
    res.res(200, { results })
})

router.use("/leaderboards", leaderboardsRouter)

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
targetUserRouter.use("/checklist", checklistRouter)
targetUserRouter.use("/info", infoRouter)
targetUserRouter.use("/links", linksRouter)
targetUserRouter.use("/permissions", permissionsRouter)
targetUserRouter.use("/signoffs", signoffsRouter)

module.exports = router