const express = require("express")
const general = require("../../server/general")
const userDatabase = require("../../server/user-database")
const middleware = require("../middleware")

const router = express.Router()

router.get("/", middleware.getPermissionMiddleware("manageAwards", true), (req, res) => { // get user links
    const { targetUserId } = req
    const links = userDatabase.getUser(targetUserId).get(userDatabase.LINKS_PATH) ?? {}
    res.res(200, { links })
})

const awardLinkRouter = express.Router()

router.use("/:awardId/:linkId", (req, res, next) => { // verify award & link
    const { awardId, linkId } = req.params

    if (!general.isAward(awardId)) {
        res.res(404, "invalid_award")
        return
    }
    if (!general.isLink(awardId, linkId)) {
        res.res(404, "invalid_link")
        return
    }

    req.awardId = awardId
    req.linkId = linkId
    next()
}, awardLinkRouter)

awardLinkRouter.put("/", middleware.requireSelf, (req, res) => { // set/delete user link
    const { awardId, body, linkId, targetUserId } = req
    const { link } = body

    const path = userDatabase.LINKS_PATH + "." + awardId + "." + linkId
    const userDb = userDatabase.getUser(targetUserId)

    if (link) {
        userDb.set(path, link)
    } else {
        userDb.delete(path)
    }

    res.res(204)
})

module.exports = router