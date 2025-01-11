const express = require("express")
const general = require("../../server/general")
const userDatabase = require("../../server/user-database")
const middleware = require("../middleware")

const router = express.Router()

router.use("/", middleware.getPermissionMiddleware("managePermissions"))

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

module.exports = router