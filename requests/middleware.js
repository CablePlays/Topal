function getPermissionMiddleware(permission, orSelf) {
    return (req, res, next) => {
        const { permissions, targetUserId, userId } = req

        if (permissions[permission] === true || orSelf && targetUserId === userId) {
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