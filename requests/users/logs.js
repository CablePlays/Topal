const express = require("express");
const general = require("../../server/general");
const sqlDatabase = require("../../server/sql-database");

const router = express.Router();

const typeRouter = express.Router();

router.use("/:logType", (req, res, next) => { // verify log type
    const { logType } = req.params;

    if (general.isLogType(logType)) {
        req.logType = logType;
        next();
    } else {
        res.res(404, "invalid_type");
    }
}, typeRouter);

function verifySelf(req, res, next) {
    if (req.userId === req.targetUserId) {
        next();
    } else {
        res.res(403);
    }
}

function verifySelfOrManageAwards(req, res, next) {
    if (req.userId === req.targetUserId || req.permissions.manageAwards) {
        next();
    } else {
        res.res(403);
    }
}

typeRouter.get("/", verifySelfOrManageAwards, async (req, res) => { // get logs
    const { logType, targetUserId } = req;

    const tableName = general.getLogsTable(logType);
    const logs = await sqlDatabase.all(`SELECT * FROM ${tableName} WHERE user = "${targetUserId}"`);

    res.res(200, { logs });
});

typeRouter.post("/", verifySelf, async (req, res) => { // create log
    const { logType, targetUserId } = req;
    const { log, id } = req.body;

    if (log == null) {
        res.res(400);
        return;
    }

    const table = general.getLogsTable(logType);

    if (general.isSingleton(logType) && await sqlDatabase.get(`SELECT * FROM ${table} WHERE userId = "${targetUserId}"`)) {
        res.res(409, "existing_singleton");
        return;
    }
    if (id != null) {
        const record = await sqlDatabase.get(`SELECT * FROM ${table} WHERE id = ${id}`);

        if (record?.user != targetUserId) { // ensures exists and self
            res.res(403, "invalid_id");
            return;
        }

        await sqlDatabase.run(`DELETE FROM ${table} WHERE id = ${id}`);
    }

    const columns = await sqlDatabase.getTableColumns(table);

    let insertingColumns = "";
    let insertingValues = "";

    for (let i = 2; i < columns.length; i++) { // start 2: skip ID and user
        if (i > 2) {
            insertingColumns += ", ";
            insertingValues += ", ";
        }

        const col = columns[i];
        const val = log[col];

        insertingColumns += col;

        if (typeof val === "string") {
            insertingValues += `"${val}"`;
        } else if (val == null) { // handle undefined
            insertingValues += null;
        } else {
            insertingValues += val;
        }
    }

    let finalId;

    if (id) {
        finalId = id;
        await sqlDatabase.run(`INSERT INTO ${table} (id, user, ${insertingColumns}) VALUES (${id}, "${targetUserId}", ${insertingValues})`);
    } else {
        await sqlDatabase.run(`INSERT INTO ${table} (user, ${insertingColumns}) VALUES ("${targetUserId}", ${insertingValues})`);
        const { id: recordId } = await sqlDatabase.get(`SELECT * FROM ${table} ORDER BY id DESC`);
        finalId = recordId;
    }

    res.res(200, { id: finalId });
});

module.exports = router;