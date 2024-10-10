const express = require("express")
const jsonDatabase = require("../server/json-database")
const middleware = require("./middleware")

const router = express.Router()

router.use("/", (req, res, next) => {
    res.setAdminTitle = title => res.setTitle("Admin - " + title)
    next()
})

router.get("/", middleware.getPermissionMiddleware("any"), (req, res) => {
    res.setTitle("Admin")
    res.ren("admin/admin")
})

router.get("/award-history", middleware.getPermissionMiddleware("viewAwardHistory"), (req, res) => {
    res.setAdminTitle("Award History")
    res.ren("admin/award-history")
})

router.get("/house-points", middleware.getPermissionMiddleware("manageMics"), (req, res) => {
    const { placeholders } = res
    res.setAdminTitle("House Points")

    placeholders.housePointsVisible = jsonDatabase.get(jsonDatabase.HOUSE_POINTS_PATH + ".visible") === true

    const points = {}
    const path = jsonDatabase.HOUSE_POINTS_PATH + ".points"

    for (let houseId of ["campbell", "harland", "jonsson"]) {
        points[houseId] = jsonDatabase.get(`${path}.${houseId}`) ?? 0
    }

    placeholders.points = points
    res.ren("admin/house-points")
})

router.get("/mics", middleware.getPermissionMiddleware("manageMics"), (req, res) => {
    res.setAdminTitle("Award MICs")
    res.ren("admin/mics")
})

router.get("/new-awards", middleware.getPermissionMiddleware("viewNewAwards"), (req, res) => {
    res.setAdminTitle("New Awards")
    res.ren("admin/new-awards")
})

router.get("/permissions", middleware.getPermissionMiddleware("managePermissions"), (req, res) => {
    res.setAdminTitle("Permissions")
    res.ren("admin/permissions")
})

router.get("/signoff-requests", middleware.getPermissionMiddleware("manageAwards"), (req, res) => {
    res.setAdminTitle("Signoff Requests")
    res.ren("admin/signoff-requests")
})

module.exports = router