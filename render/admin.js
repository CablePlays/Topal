const express = require("express")
const middleware = require("./middleware")

const router = express.Router()

router.get("/", middleware.getPermissionMiddleware("any"), (req, res) => {
    res.ren("admin/admin")
})

router.get("/permissions", middleware.getPermissionMiddleware("managePermissions"), (req, res) => {
    res.ren("admin/permissions")
})

router.get("/requests", middleware.getPermissionMiddleware("manageAwards"), (req, res) => {
    res.ren("admin/requests")
})

module.exports = router