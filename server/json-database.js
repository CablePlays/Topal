const path = require("path")
const fsdb = require("file-system-db")

const DIRECTORY = "./database"
const SINGLETON_DIRECTORY = path.join(DIRECTORY, "/database.json")
let compact = true

const AWARDS_PATH = "awards"

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
    AWARDS_PATH,
    setCompact: c => compact = c,
    get,
    set,
    push
}