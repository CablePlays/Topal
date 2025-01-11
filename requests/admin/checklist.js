const { v4: uuidv4 } = require("uuid")
const express = require("express")
const jsonDatabase = require("../../server/json-database")

const router = express.Router()

router.get("/", async (req, res) => { // get checklist items
    const items = jsonDatabase.get(jsonDatabase.CHECKLIST_PATH) ?? []
    res.res(200, { items })
})

router.put("/", async (req, res) => { // update checklist items
    const { body } = req
    const { items } = body

    if (!Array.isArray(items)) {
        res.res(400, "invalid_items")
        return
    }

    const currentItems = jsonDatabase.get(jsonDatabase.CHECKLIST_PATH) ?? []
    const newItems = []

    for (let item of items) {
        const { id, name } = item

        if (id) {
            if (currentItems.find(v => v.id === id) && item.name != null) {
                newItems.push({ id, name })
            }
        } else {
            newItems.push({ id: uuidv4(), name })
        }
    }

    jsonDatabase.set(jsonDatabase.CHECKLIST_PATH, newItems)
    res.res(200, { items: newItems })
})

module.exports = router