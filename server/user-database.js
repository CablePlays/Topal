const fs = require("fs")
const path = require("path")
const fsdb = require("file-system-db")

const DIRECTORY = "./database"
const USER_DIRECTORY = path.join(DIRECTORY, "user_data")
const USER_FILE_PREFIX = "user"
let compact = true

const APPROVALS_PATH = "approvals"
const AWARDS_PATH = "awards"
const CHECKLIST_COMPLETED_ITEMS_PATH = "checklistCompletedItems"
const CHECKLIST_ENABLED_PATH = "checklistEnabled"
const DETAILS_PATH = "details"
const LINKS_PATH = "links"
const MILESTONES_PATH = "milestones"
const PERMISSIONS_PATH = "permissions"
const SIGNOFFS_PATH = "signoffs"

/* Get File */

function getUser(userId) {
    return new fsdb(path.join(USER_DIRECTORY, USER_FILE_PREFIX + userId), compact)
}

async function forEachUser(consumer) {
    await new Promise(r => fs.readdir(USER_DIRECTORY, async (error, files) => {
        if (error) {
            console.error(error)
        } else {
            const asyncTasks = []

            for (let fileName of files) {
                const userId = parseInt(fileName.substring(USER_FILE_PREFIX.length, fileName.length - ".json".length))
                const db = new fsdb(path.join(USER_DIRECTORY, fileName), compact)
                const promise = consumer(userId, db)

                if (promise instanceof Promise) {
                    asyncTasks.push(promise)
                }
            }

            if (asyncTasks.length > 0) {
                await Promise.all(asyncTasks)
            }
        }

        r()
    }))
}

function getTotalAwards(userId) {
    const awards = getUser(userId).get(AWARDS_PATH)

    let totalAwards = 0
    let totalFirstLevelAwards = 0

    for (let awardId in awards) {
        const { complete } = awards[awardId]

        if (complete) {
            totalAwards++

            if (!awardId.endsWith("Instructor") && !awardId.endsWith("Leader")) {
                totalFirstLevelAwards++
            }
        }
    }

    return [totalAwards, totalFirstLevelAwards]
}

module.exports = {
    APPROVALS_PATH,
    AWARDS_PATH,
    CHECKLIST_COMPLETED_ITEMS_PATH,
    CHECKLIST_ENABLED_PATH,
    DETAILS_PATH,
    LINKS_PATH,
    MILESTONES_PATH,
    PERMISSIONS_PATH,
    SIGNOFFS_PATH,
    setCompact: c => compact = c,
    getUser,
    forEachUser,
    getTotalAwards
}