const path = require("path")
const fsdb = require("file-system-db")

const DIRECTORY = "./database"
const SINGLETON_DIRECTORY = path.join(DIRECTORY, "/database.json")
let compact = true

const AWARDS_PATH = "awards"
const HOUSE_POINTS_PATH = "housePoints"
const NEW_AWARDS_PATH = "newAwards"

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

function del(path) {
    getSingleton().delete(path)
}

function push(path, value) {
    getSingleton().push(path, value)
}

module.exports = {
    AWARDS_PATH,
    HOUSE_POINTS_PATH,
    NEW_AWARDS_PATH,
    setCompact: c => compact = c,
    get,
    set,
    del,
    push
}