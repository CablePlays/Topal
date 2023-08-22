const express = require("express");
const sqlDatabase = require("../../server/sql-database");

const logsRouter = require("./logs"); // TODO: remove

const router = express.Router();

const targetUserRouter = express.Router();

router.use("/:targetUserId", async (req, res, next) => { // verify target user
    const { targetUserId } = req.params;

    if (await sqlDatabase.isUser(targetUserId)) {
        req.targetUserId = parseInt(targetUserId);
        next();
    } else {
        res.res(404, "invalid_user");
    }
}, targetUserRouter);

// targetUserRouter.use("/logs", logsRouter);

module.exports = router;