const express = require("express")
const cookies = require("../server/cookies")
const general = require("../server/general")
const jsonDatabase = require("../server/json-database")
const middleware = require("./middleware")

const awardsRouter = require("./awards")

const router = express.Router()

/* Middleware */

async function advancedRender(req, res, path, adminPage) {
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

    const placeholders = {
        userId,
        displays: {
            adminPage: {
                true: generateDisplays(adminPage)
            },
            loggedIn: {
                false: generateDisplays(!loggedIn),
                true: generateDisplays(loggedIn)
            },
            permission: {
                any: generateDisplays(general.hasAnyPermission(permissions))
            }
        }
    }

    for (let permission of general.PERMISSIONS) {
        placeholders.displays.permission[permission] = generateDisplays(permissions[permission])
    }

    res.render(path, placeholders)
}

router.use("/", (req, res, next) => { // provide advanced render
    res.ren = (path, adminPage) => {
        advancedRender(req, res, path, adminPage)
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

router.get("/login", middleware.requireLoggedOut, (req, res) => {
    res.ren("other/login")
})

router.get("/search", (req, res) => {
    res.ren("other/search")
})

router.get("/settings", (req, res) => {
    res.ren("other/settings")
})

/* Routers */

router.use("/awards", awardsRouter)

module.exports = router