const express = require("express")
const middleware = require("./middleware")

const router = express.Router()

router.get("/", middleware.getPermissionMiddleware("any"), (req, res) => {
    res.setTitle("Admin")
    res.ren("admin/admin")
})

router.get("/permissions", middleware.getPermissionMiddleware("managePermissions"), (req, res) => {
    res.setTitle("Permissions")
    res.ren("admin/permissions")
})

router.get("/requests", middleware.getPermissionMiddleware("manageAwards"), (req, res) => {
    res.setTitle("Signoff Requests")
    res.ren("admin/requests")
})

module.exports = router