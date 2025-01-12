const cookies = require("../server/cookies")
const general = require("../server/general")

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

function getPermissionMiddleware(...requiredPermissions) {
    return (req, res, next) => {
        const { loggedIn, permissions } = req

        if (loggedIn) {
            for (let permission of requiredPermissions) {
                if (permissions[permission] === true) {
                    next()
                    return
                }
            }
        }

        res.ren("errors/not-found", 403) // make it look like page does not exist
    }
}

module.exports = {
    requireLoggedIn,
    requireLoggedOut,
    getPermissionMiddleware
}