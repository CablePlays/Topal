const express = require("express")
const cookies = require("../server/cookies")
const general = require("../server/general")
const middleware = require("./middleware")

const adminRouter = require("./admin")
const awardsRouter = require("./awards")
const profileRouter = require("./profile")

const router = express.Router()

async function advancedRender(req, res, path, statusCode = 200) {
    let { placeholders, title } = res
    const loggedIn = cookies.isLoggedIn(req)
    const userId = cookies.getUserId(req)
    let permissions = {}

    placeholders.title = title

    if (loggedIn && await general.isPasswordValid(req)) {
        const userId = cookies.getUserId(req)
        permissions = general.getPermissions(userId)
    }

    const generateDisplays = condition => {
        return {
            block: (condition ? "block" : "none"),
            flex: (condition ? "flex" : "none"),
            inlineBlock: (condition ? "inline-block" : "none")
        }
    }

    const displays = {
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

    placeholders.canonicalUrl = `https://opawards.treverton.co.za${req.originalUrl}`
    placeholders.displays = displays
    placeholders.user = userId ? await general.getUserInfo(userId) : { id: 0 }

    res.status(statusCode).render(path, placeholders)
}

router.use("/", (req, res, next) => { // provide advanced render, placeholders & titles related
    res.placeholders = {}

    res.title = "TOPAL" // provide default title
    res.setTitle = title => res.title = `${title} | TOPAL`

    res.ren = (path, statusCode) => advancedRender(req, res, path, statusCode)
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

router.get("/", (req, res) => {
    res.setTitle("Home")
    res.ren("other/home")
})

router.get("/award-requirements", (req, res) => {
    res.setTitle("Award Requirements")
    res.ren("other/award-requirements")
})

router.get("/awards", (req, res) => {
    res.setTitle("Awards")
    res.ren("other/awards")
})

router.get("/credits", (req, res) => {
    res.setTitle("Credits")
    res.ren("other/credits")
})

router.get("/leaderboard", (req, res) => {
    res.redirect("leaderboards")
})

router.get("/leaderboards", (req, res) => {
    res.setTitle("Leaderboards")
    res.ren("other/leaderboards")
})

router.get("/login", (req, res) => {
    res.redirect("signin")
})

router.get("/search", (req, res) => {
    res.setTitle("Search")
    res.ren("other/search")
})

router.get("/settings", middleware.requireLoggedIn, (req, res) => {
    res.setTitle("Settings")
    res.ren("other/settings")
})

router.get("/signin", middleware.requireLoggedOut, (req, res) => {
    res.setTitle("Sign In")
    res.ren("other/signin")
})

router.use("/admin", adminRouter)
router.use("/awards", awardsRouter)
router.use("/profile", profileRouter)

module.exports = router