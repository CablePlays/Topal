const express = require("express")
const general = require("../../server/general")
const userDatabase = require("../../server/user-database")
const middleware = require("../middleware")

const router = express.Router()

router.use("/", middleware.getPermissionMiddleware("managePermissions"))

router.get("/", async (req, res) => { // get users with permissions & their permissions
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

router.put("/", (req, res) => { // set user permissions
    const { body, targetUserId } = req
    const { permissions } = body

    const userDb = userDatabase.getUser(targetUserId)

    for (let permissionId in permissions) {
        if (general.isPermission(permissionId)) {
            const has = permissions[permissionId]
            const path = userDatabase.PERMISSIONS_PATH + "." + permissionId

            if (has) {
                userDb.set(path, true)
            } else {
                userDb.delete(path)
            }
        }
    }

    res.res(204)
})

router.get("/user", async (req, res) => { // get user permissions
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

module.exports = router