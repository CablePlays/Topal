const { v4: uuidv4 } = require("uuid")
const express = require("express")
const general = require("../../server/general")
const jsonDatabase = require("../../server/json-database")
const userDatabase = require("../../server/user-database")

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

router.put("/enabled", async (req, res) => { // set checklist enabled/disabled for a grade
    const { body } = req
    const { enabled, grade } = body

    if (![8, 9, 10, 11, 12].includes(grade)) {
        res.res(400, "invalid_grade")
        return
    }

    await userDatabase.forEachUser(async (userId, udb) => {
        const g = await general.getGrade(userId)

        if (g === grade) {
            udb.set(userDatabase.CHECKLIST_ENABLED_PATH, enabled === true)
        }
    })

    res.res(204)
})

router.get("/users", async (req, res) => { // get all users who have checklist enabled and their completed items
    const items = jsonDatabase.get(jsonDatabase.CHECKLIST_PATH) ?? []
    const users = {}

    await userDatabase.forEachUser(async (userId, udb) => {
        if (udb.get(userDatabase.CHECKLIST_ENABLED_PATH) === true) {
            const completed = udb.get(userDatabase.CHECKLIST_COMPLETED_ITEMS_PATH) ?? []
            users[userId] = {
                completed,
                info: await general.getUserInfo(userId)
            }
        }
    })

    res.res(200, { items, users })
})

module.exports = router