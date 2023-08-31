const express = require('express')

const router = express.Router()

router.get("/running", (req, res) => {
    res.advancedRender("awards/running")
})

module.exports = router;