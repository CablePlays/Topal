const express = require("express")
const general = require("../../server/general")
const sqlDatabase = require("../../server/sql-database")

const router = express.Router()

const typeRouter = express.Router()

router.use("/:logType", (req, res, next) => { // verify log type
    const { logType } = req.params

    if (general.isLogType(logType)) {
        req.logType = logType
        next()
    } else {
        res.res(404, "invalid_log_type")
    }
}, typeRouter)

function verifySelfOrManageAwards(req, res, next) {
    if (req.userId === req.targetUserId || req.permissions.manageAwards) {
        next()
    } else {
        res.res(403)
    }
}

typeRouter.get("/", verifySelfOrManageAwards, async (req, res) => { // get logs
    const { logType, targetUserId } = req

    async function getLogs(lt, where) {
        const tableName = general.getLogsTable(lt)
        const logs = await sqlDatabase.all(`SELECT * FROM ${tableName} WHERE ${where}`)
        const childrenLogTypes = general.getChildrenLogTypes(lt)

        for (let log of logs) {
            const { id: logId } = log

            for (let childLogType of childrenLogTypes) {
                log[childLogType] = await getLogs(childLogType, `parent = ${logId}`)
            }
        }

        return logs
    }

    let logs

    if (general.getParentLogType(logType)) { // has parent
        const logOwnerId = general.getLogOwner(logType, logId)

        if(logOwnerId !== targetUserId)

        logs = await getLogs(logType, `id = ${logId}`)
    } else {
        logs = await getLogs(logType, `user = ${targetUserId}`)
    }


    res.res(200, { logs })
})

module.exports = router