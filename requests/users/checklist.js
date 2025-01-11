const express = require("express")
const jsonDatabase = require("../../server/json-database")
const userDatabase = require("../../server/user-database")
const middleware = require("../middleware")

const router = express.Router()

router.get("/", async (req, res) => { // get completed status for all checklist items
    const { targetUserId } = req

    const checklistItems = jsonDatabase.get(jsonDatabase.CHECKLIST_PATH) ?? []
    const completeItems = userDatabase.getUser(targetUserId).get(userDatabase.CHECKLIST_COMPLETED_ITEMS_PATH) ?? []
    const checklistItemsStatus = {}

    for (let checklistItem of checklistItems) {
        checklistItemsStatus[checklistItem.id] = completeItems.includes(itemId)
    }

    res.res(200, { items: checklistItemsStatus })
})

router.put("/", middleware.getPermissionMiddleware("manageChecklist"), async (req, res) => { // update checklist item
    const { body, targetUserId } = req
    const { complete, itemId } = body

    const items = jsonDatabase.get(jsonDatabase.CHECKLIST_PATH) ?? []
    const itemIndex = items.findIndex(v => v.id === itemId)

    if (itemIndex === -1) {
        res.res(404, "invalid_item")
        return
    }

    const udb = userDatabase.getUser(targetUserId)

    if (complete === true) {
        const completeItems = udb.get(userDatabase.CHECKLIST_COMPLETED_ITEMS_PATH) ?? []

        if (!completeItems.includes(itemId)) {
            udb.push(userDatabase.CHECKLIST_COMPLETED_ITEMS_PATH, itemId)
        }
    } else {
        udb.pull(userDatabase.CHECKLIST_COMPLETED_ITEMS_PATH, itemId)
    }

    res.res(204)
})

module.exports = router