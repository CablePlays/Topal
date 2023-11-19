const path = require("path")
const fsdb = require("file-system-db")

const DIRECTORY = "./database"
const SINGLETON_DIRECTORY = path.join(DIRECTORY, "/database.json")
let compact = true

const AWARDS_PATH = "awards"
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

function push(path, value) {
    getSingleton().push(path, value)
}

module.exports = {
    RECENT_AWARDS_PATH,
    AWARDS_PATH,
    setCompact: c => compact = c,
    get,
    set,
    push
}