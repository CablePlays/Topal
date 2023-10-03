const fs = require("fs")
const path = require("path")
const fsdb = require("file-system-db")

const DIRECTORY = "./database"
const SINGLETON_DIRECTORY = path.join(DIRECTORY, "/singleton.json")
const USER_DIRECTORY = path.join(DIRECTORY, "/user_data")
const USER_FILE_PREFIX = "user"
let compact = true

// user
const APPROVALS_PATH = "approvals"
const AWARDS_PATH = "awards"
const DETAILS_PATH = "details"
const LINKS_PATH = "links"
const PERMISSIONS_PATH = "permissions"
const SIGNOFFS_PATH = "signoffs"

// singleton
const RECENT_AWARDS_PATH = "recentAwards"

/* Get File */

function getSingleton() {
    return new fsdb(SINGLETON_DIRECTORY, compact)
}

function get(path) {
    return getSingleton().get(path)
}

function set(path, value) {
    getSingleton().set(path, value)
}

function getUser(userId) {
    return new fsdb(path.join(USER_DIRECTORY, USER_FILE_PREFIX + userId), compact)
}

async function forEachUser(consumer) {
    await new Promise(r => fs.readdir(USER_DIRECTORY, async (error, files) => {
        if (error) {
            console.error(error)
        } else {
            const promises = []

            for (let fileName of files) {
                const userId = parseInt(fileName.substring(USER_FILE_PREFIX.length, fileName.length - ".json".length))
                const db = new fsdb(path.join(USER_DIRECTORY, fileName), compact)
                const promise = consumer(userId, db)

                if (promise instanceof Promise) {
                    promises.push(promise)
                }
            }

            if (promises.length > 0) {
                await Promise.all(promises)
            }
        }

        r()
    }))
}

/* Get Permissions */

function getPermissions(userId, raw) {
    const permissions = getUser(userId).get(PERMISSIONS_PATH) ?? {}

    if (!raw && permissions.managePermissions === true) {
        permissions.manageAwards = true
        permissions.viewAuditLog = true
    }

    for (let key in permissions) {
        if (permissions[key]) {
            permissions.any = true
            break
        }
    }

    return permissions
}

module.exports = {
    APPROVALS_PATH,
    AWARDS_PATH,
    DETAILS_PATH,
    LINKS_PATH,
    PERMISSIONS_PATH,
    SIGNOFFS_PATH,
    RECENT_AWARDS_PATH,

    setCompact: c => compact = c,
    getUser,
    forEachUser,
    getPermissions,
    get, set
}