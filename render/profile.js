const express = require("express")
const general = require("../server/general")
const userDatabase = require("../server/user-database")
const sqlDatabase = require("../server/sql-database")
const middleware = require("./middleware")

const router = express.Router()

const userRouter = express.Router()

router.use("/:userId", async (req, res, next) => { // verify user ID & provide placeholders
    const { permissions, userId } = req
    const { placeholders } = res
    let { userId: profileUserId } = req.params

    if (await sqlDatabase.isUser(profileUserId)) {
        const profileUserDb = userDatabase.getUser(profileUserId)

        profileUserId = parseInt(profileUserId)
        req.profileUserId = profileUserId

        // user info
        const userInfo = await general.getUserInfo(profileUserId)
        req.profileUser = userInfo
        placeholders.profileUser = userInfo

        // grade
        let grade = await general.getGrade(profileUserId)
        if (grade) grade = (grade > 12) ? "Matriculated" : "Grade " + grade
        placeholders.grade = grade

        // badges
        placeholders.badges = getBadgePlaceholders(profileUserId)

        // admin buttons
        placeholders.adminSwapButtonsDisplay = (permissions.manageAwards || permissions.manageChecklist) ? "block" : "none"

        // rise link
        placeholders.riseLinkDisplay = (profileUserDb.get(userDatabase.CHECKLIST_ENABLED_PATH) === true && (profileUserId === userId || permissions.manageChecklist)) ? "block" : "none"

        req.profileUserId = profileUserId
        next()
    } else {
        res.setTitle("Invalid User")
        res.ren("errors/invalid-user")
    }
}, userRouter)

function getBadgePlaceholders(userId) {
    const [totalAwards, totalFirstLevelAwards] = userDatabase.getTotalAwards(userId)
    const generatePlaceholder = b => b ? "block" : "none"

    const placeholders = {
        duo: generatePlaceholder(false) // unused feature
    }

    for (let milestoneId in general.MILESTONES) {
        const { awards, firstLevel } = general.MILESTONES[milestoneId]
        placeholders[milestoneId] = generatePlaceholder((firstLevel ? totalFirstLevelAwards : totalAwards) >= awards)
    }

    return placeholders
}

async function getStats(userId) {
    const stats = {}

    function formatStat(val, unit) {
        val += "" // convert to string

        if (unit) {
            val += unit
        } else if (val.length < 2) {
            val = "0" + val
        }

        return val.replace(".", ",")
    }

    // total awards
    const [totalAwards, totalFirstLevelAwards] = userDatabase.getTotalAwards(userId)
    stats.totalAwards = formatStat(totalAwards)
    stats.firstLevelAwards = formatStat(totalFirstLevelAwards)

    // kayaking
    const { total: distancePaddled } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM river_trip_logs WHERE user = ${userId}`)
    stats.distancePaddled = formatStat(distancePaddled / 1000, "km")
    const { total: paddlingTrips } = await sqlDatabase.get(`SELECT COUNT() AS total FROM river_trip_logs WHERE user = ${userId}`)
    stats.paddlingTrips = formatStat(paddlingTrips)

    // midmar mile
    const { total: distanceSwum } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM midmar_mile_training_logs WHERE user = ${userId}`)
    stats.distanceSwum = formatStat(distanceSwum ?? 0, "m")

    // mountaineering
    const { total: distanceHiked } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM mountaineering_logs WHERE user = ${userId}`)
    stats.distanceHiked = formatStat(distanceHiked / 1000, "km")
    const { total: elevationGain } = await sqlDatabase.get(`SELECT SUM(elevation_gain) AS total FROM mountaineering_logs WHERE user = ${userId}`)
    stats.elevationGain = formatStat(elevationGain ?? 0, "m")
    const { total: hikingTrips } = await sqlDatabase.get(`SELECT COUNT() AS total FROM mountaineering_logs WHERE user = ${userId}`)
    stats.hikingTrips = formatStat(hikingTrips)

    // running
    const { total: distanceRun } = await sqlDatabase.get(`SELECT SUM(distance) AS total FROM running_logs WHERE user = ${userId}`)
    stats.distanceRun = formatStat(distanceRun / 1000, "km")

    // service
    const { total: serviceHours } = await sqlDatabase.get(`SELECT SUM(time) AS total FROM service_logs WHERE user = ${userId}`)
    stats.serviceHours = formatStat(Math.floor(serviceHours / 3600))

    return stats
}

userRouter.get("/", async (req, res) => {
    const { permissions, profileUser, profileUserId } = req
    const { placeholders } = res

    placeholders.stats = await getStats(profileUserId)

    res.setTitle(profileUser.titleName)
    res.ren("profile/profile")
})

userRouter.use("/admin", (req, res, next) => {
    const { permissions, profileUser } = req
    const { placeholders } = res

    // admin buttons placeholder
    placeholders.adminButtonsDisplay = (permissions.manageAwards && permissions.manageChecklist) ? "block" : "none"

    res.setTitle(`${profileUser.titleName} - Admin`)
    next()
})

userRouter.get("/admin", middleware.getPermissionMiddleware("manageAwards", "manageChecklist"), async (req, res, next) => {
    const { permissions, profileUserId } = req

    if (permissions.manageAwards) {
        res.redirect(`/profile/${profileUserId}/admin/awards`)
    } else {
        res.redirect(`/profile/${profileUserId}/admin/checklist`)
    }
})

userRouter.get("/admin/awards", middleware.getPermissionMiddleware("manageAwards"), async (req, res) => {
    res.ren("profile/admin-awards")
})

userRouter.get("/admin/awards/:awardId", middleware.getPermissionMiddleware("manageAwards"), (req, res) => {
    const { awardId } = req.params

    if (general.isAward(general.kebabToCamel(awardId))) {
        res.ren("profile/admin-award")
    } else {
        res.ren("errors/not-found")
    }
})

userRouter.get("/admin/checklist", middleware.getPermissionMiddleware("manageChecklist"), async (req, res) => {
    res.ren("profile/admin-checklist")
})

module.exports = router