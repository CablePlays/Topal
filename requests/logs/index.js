const express = require("express");
const general = require("../../server/general");
const sqlDatabase = require("../../server/sql-database");

const router = express.Router();

const typeRouter = express.Router();

router.use("/:logType", (req, res, next) => { // verify log type
    const { logType } = req.params;

    if (general.isAward(logType)) {
        req.logType = logType;
        next();
    } else {
        res.res(404, "invalid_type");
    }
}, typeRouter);

const logIdRouter = express.Router();

typeRouter.use("/:logId", async (req, res, next) => { // verify log and self
    const { logType } = req;
    const { logId } = req.params;
    const logsTable = general.getLogsTable(logType);

    const record = await sqlDatabase.get(`SELECT * FROM ${logsTable} WHERE id = "${logId}"`);

    if (!record) {
        res.res(404, "invalid_log");
        return;
    }

    const { user } = record;

    if (user != req.userId) {
        res.res(403);
        return;
    }

    req.logId = logId;
    next();
}, logIdRouter);

logIdRouter.delete("/", async (req, res) => { // delete log
    const { logId, logType } = req;
    const logsTable = general.getLogsTable(logType);

    await sqlDatabase.run(`DELETE FROM ${logsTable} WHERE id = "${logId}"`);
    res.res(204);
});

logIdRouter.put("/", async (req, res) => { // edit log
    const { logId, logType } = req;
    const { log } = req.body;
    const logsTable = general.getLogsTable(logType);

    if (log == null) {
        res.res(400);
        return;
    }

    const columns = await sqlDatabase.getTableColumns(table);

    let setting = "";

    for (let column of columns) {
        if (column === "id" || column === "user") {
            continue;
        }

        let value = log[column];
        if (value == null) continue;

        if (setting.length > 0) {
            setting += ", ";
        }
        if (typeof value === "string") {
            value = `"${value}"`;
        }

        setting += `${column} = ${value}`;
    }

    if (setting.length > 0) {
        await sqlDatabase.run(`UPDATE ${logsTable} SET ${setting} WHERE id = ${logId}`);
    }

    res.res(204);
});

module.exports = router;