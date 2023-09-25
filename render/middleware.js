const cookies = require("../server/cookies")
const general = require("../server/general")
const jsonDatabase = require("../server/json-database")

function requireLoggedIn(req, res, next) {
    if (cookies.isLoggedIn(req)) {
        next()
    } else {
        res.redirect(`/signin?redirect=${req.path}`)
    }
}

function requireLoggedOut(req, res, next) {
    if (cookies.isLoggedIn(req)) {
        res.redirect("/")
    } else {
        next()
    }
}

function getPermissionMiddleware(permission) {
    return (req, res, next) => {
        if (cookies.isLoggedIn(req)) {
            const userId = cookies.getUserId(req)
            const permissions = jsonDatabase.getPermissions(userId)

            if (permissions[permission] === true) {
                next()
                return
            }
        }

        res.ren("errors/not-found") // make it look like page does not exist
    }
}

module.exports = {
    requireLoggedIn,
    requireLoggedOut,
    getPermissionMiddleware
}