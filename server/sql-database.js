const fs = require("fs")
const sqlite3 = require("sqlite3").verbose()

if (!fs.existsSync("database")) {
    fs.mkdirSync("database")
}

/* Use */

function useDatabase(consumer) {
    const db = new sqlite3.Database("./database/database.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, error => {
        if (error) {
            console.error(error)
        }
    })

    consumer(db)

    db.close(error => {
        if (error) {
            console.error(error)
        }
    })
}

async function doOperation(operationName, sql) {
    return await new Promise(r => {
        useDatabase(db => {
            db.serialize(() => {
                db[operationName](sql, [], (error, val) => {
                    if (error) {
                        console.error(error)
                    } else {
                        r(val)
                    }
                })
            })
        })
    })
}

async function all(sql) {
    return await doOperation("all", sql)
}

async function get(sql) {
    return await doOperation("get", sql)
}

async function run(sql) {
    await doOperation("run", sql)
}

/* Helper */

async function getTableColumns(table) {
    let allColumns = await get(`SELECT GROUP_CONCAT(name, ",") FROM PRAGMA_TABLE_INFO("${table}")`)
    allColumns = allColumns[`GROUP_CONCAT(name, ",")`]
    return allColumns.split(",")
}

/* Users */

/*
    Checks that the given user is a valid one.
*/
async function isUser(userId) {
    const record = await get(`SELECT * FROM users WHERE id = "${userId}"`)
    return (record != null)
}

async function getUserId(userEmail) {
    const record = await get(`SELECT id FROM users WHERE email = "${userEmail}"`)
    return record?.id
}

async function getUsers() {
    const users = await all(`SELECT * FROM users`)
    const ids = []

    for (let user of users) {
        ids.push(user.id)
    }

    return ids
}

/* Create Tables */

function createTables() { // returns promise
    const tasks = []

    useDatabase(db => {
        const c = (tableName, details) => {
            const promise = new Promise(r => db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${details})`, r))
            tasks.push(promise)
        }

        /* General */

        c("users", "id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL")
        c("recent_awards", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, award TEXT NOT NULL, date INTEGER NOT NULL")

        /* Logs */

        c("endurance_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, distance INTEGER NOT NULL, time INTEGER NOT NULL, description TEXT")
        c("midmar_mile_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, distance INTEGER NOT NULL, time INTEGER NOT NULL, comments TEXT")
        c("mountaineering_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, start_date TEXT NOT NULL, area TEXT NOT NULL, days INTEGER NOT NULL, distance INTEGER NOT NULL, altitude_gained INTEGER NOT NULL, party_size INTEGER NOT NULL, shelter TEXT NOT NULL, trail INTEGER NOT NULL, leader INTEGER NOT NULL, majority_above_2000m INTEGER NOT NULL, route TEXT, weather TEXT, situations TEXT")
        c("running_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, distance INTEGER NOT NULL, time INTEGER NOT NULL, description TEXT")
        c("service_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, service TEXT NOT NULL, time INTEGER NOT NULL, description TEXT, signer INTEGER")

        // paddling
        c("flat_water_paddling_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT, training TEXT, boat TEXT, time INTEGER, distance TEXT, place TEXT, comments TEXT")
        c("river_trip_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT, put_in TEXT, take_out TEXT, time INTEGER, distance INTEGER, party_size INTEGER, river TEXT, water_level TEXT, boat TEXT, signer INTEGER")

        // rock climbing
        c("rock_climbing_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, area TEXT, party_size INTEGER, weather TEXT")
        c("rock_climbing_climbs_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, parent INTEGER NOT NULL, route_name TEXT, method TEXT, grade TEXT, pitches INTEGER")
        c("rock_climbing_instruction_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, duration INTEGER NOT NULL, climbers INTEGER NOT NULL, location TEXT NOT NULL, signer INTEGER")

        // solitaire
        c("solitaire_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, location TEXT NOT NULL, others_involved TEXT NOT NULL, supervisors TEXT NOT NULL, items TEXT NOT NULL, experience TEXT NOT NULL")
        c("solitaire_instructor_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, location TEXT NOT NULL, groupSupervised TEXT NOT NULL, comments TEXT NOT NULL")
        c("solitaire_leader_logs", "id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER NOT NULL, date TEXT NOT NULL, location TEXT NOT NULL, groupSupervised TEXT NOT NULL, comments TEXT NOT NULL")
    })

    return Promise.all(tasks)
}

module.exports = {
    all, get, run,

    getTableColumns,

    isUser,
    getUserId,
    getUsers,
    createTables
}