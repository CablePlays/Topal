const general = require("../server/general")

function getPermissionMiddleware(permission) {
    return (req, res, next) => {
        const { permissions } = req

        if (permissions[permission] === true) {
            next()
        } else {
            res.res(403)
        }
    }
}

function requireSelf(req, res, next) {
    const { targetUserId, userId } = req

    if (targetUserId === userId) {
        next()
    } else {
        res.res(403, "not_self")
    }
}

module.exports = {
    getPermissionMiddleware,
    requireSelf
}