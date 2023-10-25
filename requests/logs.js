const express = require("express")
const general = require("../server/general")
const sqlDatabase = require("../server/sql-database")
const middleware = require("./middleware")

const router = express.Router()

const typeRouter = express.Router()

async function getLogOwner(logType, logId) {
    while (true) {
        const table = general.getLogsTable(logType)
        const record = await sqlDatabase.get(`SELECT * FROM ${table} WHERE id = ${logId}`)

        logType = general.getParentLogType(logType)
        if (logType == null) return record.user

        logId = record.parent
    }
}

router.use("/:logType", (req, res, next) => { // verify log type
    const { logType } = req.params

    if (general.isLogType(logType)) {
        req.logType = logType
        next()
    } else {
        res.res(404, "invalid_log_type")
    }
}, typeRouter)

typeRouter.get("/", async (req, res) => { // get logs
    const { logType, permissions, userId } = req
    const { parentLogId, targetUserId } = req.query

    async function getLogs(lt, whereClause) {
        const tableName = general.getLogsTable(lt)
        const logs = await sqlDatabase.all(`SELECT * FROM ${tableName} WHERE ${whereClause}`)
        const childrenLogTypes = general.getChildrenLogTypes(lt)

        for (let log of logs) {
            const { id: logId } = log

            for (let childLogType of childrenLogTypes) {
                log[childLogType] = await getLogs(childLogType, `parent = ${logId}`)
            }
        }

        return logs
    }

    const parentLogType = general.getParentLogType(logType)
    let logs

    if (parentLogType) { // has parent
        const logOwnerId = await getLogOwner(parentLogType, parentLogId)

        if (logOwnerId !== userId && !permissions.manageAwards) { // verify self or manageAwards
            res.res(403)
            return
        }

        logs = await getLogs(logType, `parent = ${parentLogId}`)
    } else {
        if (targetUserId != userId && !permissions.manageAwards) { // verify self or manageAwards
            res.res(403)
            return
        }

        logs = await getLogs(logType, `user = ${targetUserId}`)
    }

    // provide signer info

    const asyncTasks = []

    for (let log of logs) {
        const signUserId = log.sign_user

        if (signUserId) {
            const promise = general.getUserInfo(signUserId)
            asyncTasks.push(promise)
            promise.then(val => log.sign_user = val)
        }
    }

    await Promise.all(asyncTasks)
    res.res(200, { logs })
})

typeRouter.post("/", async (req, res) => { // create log
    const { log, parentLogId, id: replaceId } = req.body
    const { loggedIn, logType, userId } = req

    if (!loggedIn) { // verify logged in
        res.res(401)
        return
    }
    if (log == null) {
        res.res(400)
        return
    }

    const table = general.getLogsTable(logType)

    if (parentLogId) { // sublog
        const parentLogType = general.getParentLogType(logType)

        if (!await sqlDatabase.get(`SELECT * FROM ${general.getLogsTable(parentLogType)} WHERE id = ${parentLogId}`)) {
            res.res(404, "invalid_id")
            return
        }

        const recordOwnerId = await getLogOwner(parentLogType, parentLogId)

        if (recordOwnerId !== userId) { // verify own
            res.res(403, "not_own")
            return
        }
        if (replaceId != null) { // own already verified -> delete
            await sqlDatabase.run(`DELETE FROM ${table} WHERE id = ${replaceId}`)
        }
    } else {
        if (replaceId != null) { // verify own
            const record = await sqlDatabase.get(`SELECT * FROM ${table} WHERE id = ${replaceId}`)

            if (record?.user != userId) {
                res.res(403, "invalid_id")
                return
            }

            await sqlDatabase.run(`DELETE FROM ${table} WHERE id = ${replaceId}`)
        }
    }

    const columns = await sqlDatabase.getTableColumns(table)

    let insertingColumns = ""
    let insertingValues = ""

    for (let i = 2; i < columns.length; i++) { // start 2: skip ID and user
        if (i > 2) {
            insertingColumns += ", "
            insertingValues += ", "
        }

        const col = columns[i]
        const val = log[col]

        insertingColumns += col

        if (typeof val === "string") {
            insertingValues += `"${val}"`
        } else if (val == null) { // handle undefined
            insertingValues += null
        } else {
            insertingValues += val
        }
    }

    let returnId

    if (replaceId) {
        returnId = replaceId
        let run

        if (parentLogId) {
            run = `INSERT INTO ${table} (id, parent, ${insertingColumns}) VALUES (${replaceId}, ${parentLogId}, ${insertingValues})`
        } else {
            run = `INSERT INTO ${table} (id, user, ${insertingColumns}) VALUES (${replaceId}, ${userId}, ${insertingValues})`
        }

        await sqlDatabase.run(run)
    } else {
        let run

        if (parentLogId) {
            run = `INSERT INTO ${table} (parent, ${insertingColumns}) VALUES (${parentLogId}, ${insertingValues})`
        } else {
            run = `INSERT INTO ${table} (user, ${insertingColumns}) VALUES (${userId}, ${insertingValues})`
        }

        await sqlDatabase.run(run)
        const { id: recordId } = await sqlDatabase.get(`SELECT * FROM ${table} ORDER BY id DESC`)
        returnId = recordId
    }

    res.res(200, { id: returnId })
})

const logIdRouter = express.Router()

typeRouter.use("/:logId", async (req, res, next) => { // verify log and provide self
    const { logType, params, userId } = req
    const { logId } = params
    const logsTable = general.getLogsTable(logType)

    const record = await sqlDatabase.get(`SELECT * FROM ${logsTable} WHERE id = ${logId}`)

    if (!record) {
        res.res(404, "invalid_log")
        return
    }

    const recordOwnerId = await getLogOwner(logType, logId)
    req.self = recordOwnerId == userId
    req.logId = logId
    next()
}, logIdRouter)

function requireSelf(req, res, next) { // require self middleware
    if (req.self) {
        next()
    } else {
        res.res(403)
    }
}

logIdRouter.delete("/", requireSelf, async (req, res) => { // delete log
    const { logId, logType } = req

    async function deleteDescendantLogs(parentLogType, parentLogId) {
        const childrenLogTypes = general.getChildrenLogTypes(parentLogType)

        for (let childLogType of childrenLogTypes) {
            const table = general.getLogsTable(childLogType)
            const records = await sqlDatabase.all(`SELECT * FROM ${table} WHERE parent = ${parentLogId}`)
            sqlDatabase.run(`DELETE FROM ${table} WHERE parent = ${parentLogId}`)

            for (let record of records) {
                await deleteDescendantLogs(childLogType, record.id)
            }
        }
    }

    const logsTable = general.getLogsTable(logType)
    await sqlDatabase.run(`DELETE FROM ${logsTable} WHERE id = ${logId}`)

    await deleteDescendantLogs(logType, logId)
    res.res(204)
})

logIdRouter.put("/", middleware.getPermissionMiddleware("manageAwards"), async (req, res) => { // set signed off status
    const { body, logId, logType, userId } = req
    const { signed } = body

    if (!general.isSignable(logType)) {
        res.res(400, "not_signable")
        return
    }

    const table = general.getLogsTable(logType)
    let signoffData = {}

    if (signed === true) {
        let date = new Date()
        let dateFormatted = general.formatDateForStorage(date)

        signoffData.date = date
        signoffData.signer = await general.getUserInfo(userId)

        sqlDatabase.run(`UPDATE ${table} SET sign_state = "signed", sign_date = "${dateFormatted}", sign_user = ${userId} WHERE id = ${logId}`)
    } else {
        sqlDatabase.run(`UPDATE ${table} SET sign_state = null, sign_date = null, sign_user = null WHERE id = ${logId}`)
    }

    res.res(200, { signoff: signoffData })
})

logIdRouter.put("/cancel-request", requireSelf, async (req, res) => { // cancel signoff request
    const { logId, logType } = req
    const logsTable = general.getLogsTable(logType)
    await sqlDatabase.run(`UPDATE ${logsTable} SET sign_state = null, sign_date = null, sign_user = null WHERE id = ${logId}`)
    res.res(204)
})

logIdRouter.put("/clear-decline", requireSelf, async (req, res) => { // clear decline
    const { logId, logType } = req
    const logsTable = general.getLogsTable(logType)
    await sqlDatabase.run(`UPDATE ${logsTable} SET sign_state = null, sign_date = null, sign_user = null WHERE id = ${logId}`)
    res.res(204)
})

logIdRouter.put("/decline-request", middleware.getPermissionMiddleware("manageAwards"), async (req, res) => { // decline signoff request
    const { logId, body, logType, userId } = req
    const { message } = body

    const logsTable = general.getLogsTable(logType)
    const record = await sqlDatabase.get(`SELECT * FROM ${logsTable} WHERE id = ${logId}`)

    if (record.sign_state === "signed") {
        res.res(409, "already_signed")
        return
    }

    const signState = message ? message : "declined"
    const date = general.formatDateForStorage(new Date())
    await sqlDatabase.run(`UPDATE ${logsTable} SET sign_state = "${signState}", sign_date = "${date}", sign_user = ${userId}`)
    res.res(204)
})

logIdRouter.put("/request-signoff", requireSelf, async (req, res) => { // request signoff
    const { logId, logType } = req

    const logsTable = general.getLogsTable(logType)
    const record = await sqlDatabase.get(`SELECT * FROM ${logsTable} WHERE id = ${logId}`)

    if (record.sign_state === "signed") {
        res.res(409, "already_signed")
        return
    }

    const date = new Date()
    const dateFormatted = general.formatDateForStorage(date)
    await sqlDatabase.run(`UPDATE ${logsTable} SET sign_state = "requested", sign_date = "${dateFormatted}", sign_user = null`)
    res.res(204, { date })
})

module.exports = router