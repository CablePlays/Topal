const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const sqlDatabase = require("../../server/sql-database")
const middleware = require("../middleware")

const awardsRouter = require("./awards")
const infoRouter = require("./info")
const linksRouter = require("./links")
const permissionsRouter = require("./permissions")
const signoffsRouter = require("./signoffs")

const router = express.Router()

router.get("/permissions", middleware.getPermissionMiddleware("managePermissions"), async (req, res) => { // get users with permissions & their permissions
    const users = await sqlDatabase.getUsers()
    const permissionUsers = []
    const asyncTasks = []

    for (let userId of users) {
        const permissions = jsonDatabase.getPermissions(userId, true)

        if (permissions.any) {
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

router.get("/permissions/user", middleware.getPermissionMiddleware("managePermissions"), async (req, res) => { // get user permissions
    const { email } = req.query
    const userId = await sqlDatabase.getUserId(email)

    if (userId == null) {
        res.res(400, "invalid_user")
        return
    }

    const info = await general.getUserInfo(userId)
    const permissions = jsonDatabase.getPermissions(userId)
    res.res(200, { info, permissions })
})

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
            const { email, profilePicture, titleName } = await general.getUserInfo(userId)

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
targetUserRouter.use("/permissions", permissionsRouter)
targetUserRouter.use("/signoffs", signoffsRouter)

module.exports = router