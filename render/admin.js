const express = require("express")
const middleware = require("./middleware")

const router = express.Router()

router.get("/", middleware.getPermissionMiddleware("any"), (req, res) => {
    res.setTitle("Admin")
    res.ren("admin/admin")
})

router.get("/award-history", middleware.getPermissionMiddleware("viewAwardHistory"), (req, res) => {
    res.setTitle("Award History")
    res.ren("admin/award-history")
})

router.get("/mics", middleware.getPermissionMiddleware("manageMics"), (req, res) => {
    res.setTitle("Award MICs")
    res.ren("admin/mics")
})

router.get("/permissions", middleware.getPermissionMiddleware("managePermissions"), (req, res) => {
    res.setTitle("Permissions")
    res.ren("admin/permissions")
})

router.get("/signoff-requests", middleware.getPermissionMiddleware("manageAwards"), (req, res) => {
    res.setTitle("Signoff Requests")
    res.ren("admin/signoff-requests")
})

module.exports = router