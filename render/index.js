const express = require("express")
const cookies = require("../server/cookies")
const general = require("../server/general")
const jsonDatabase = require("../server/json-database")
const middleware = require("./middleware")

const awardsRouter = require("./awards")
const profileRouter = require("./profile")

const router = express.Router()

/* Middleware */

async function advancedRender(req, res, path, options) {
    const { adminPage } = options ?? {}
    const loggedIn = cookies.isLoggedIn(req)
    const userId = cookies.getUserId(req)
    let permissions = {}

    if (loggedIn && await general.isPasswordValid(req)) {
        const userId = cookies.getUserId(req)
        permissions = jsonDatabase.getPermissions(userId)
    }

    const generateDisplays = condition => {
        return {
            block: (condition ? "block" : "none"),
            flex: (condition ? "flex" : "none"),
            inlineBlock: (condition ? "inline-block" : "none")
        }
    }

    const { placeholders } = res

    const displays = {
        adminPage: {
            true: generateDisplays(adminPage)
        },
        loggedIn: {
            false: generateDisplays(!loggedIn),
            true: generateDisplays(loggedIn)
        },
        permission: {
            any: generateDisplays(permissions.any)
        }
    }

    for (let permission of general.PERMISSIONS) {
        displays.permission[permission] = generateDisplays(permissions[permission])
    }

    placeholders.displays = displays
    placeholders.user = userId ? await general.getUserDetails(userId) : { id: 0 }

    res.render(path, placeholders)
}

router.use("/", (req, res, next) => { // provide advanced render & placeholders
    res.placeholders = {}
    res.ren = (path, options) => {
        advancedRender(req, res, path, options)
    }

    next()
})

router.use("/", async (req, res, next) => { // verify login
    if (cookies.isLoggedIn(req) && !await general.isPasswordValid(req)) { // invalid credentials
        cookies.logOut(res)
        res.redirect("/")
    } else {
        next()
    }
})

/* Get */

router.get("/", (req, res) => {
    res.ren("other/home")
})

router.get("/about", (req, res) => {
    res.ren("other/about")
})

router.get("/leaderboard", (req, res) => {
    res.redirect("leaderboards")
})

router.get("/leaderboards", (req, res) => {
    res.ren("errors/coming-soon")
})

router.get("/login", (req, res) => {
    res.redirect("signin")
})

router.get("/search", (req, res) => {
    res.ren("other/search")
})

router.get("/settings", middleware.requireLoggedIn, (req, res) => {
    res.ren("other/settings")
})

router.get("/signin", middleware.requireLoggedOut, (req, res) => {
    res.ren("other/signin")
})

/* Routers */

router.use("/awards", awardsRouter)
router.use("/profile", profileRouter)

module.exports = router