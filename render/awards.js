const express = require('express')

const router = express.Router()

router.get("/running", (req, res) => {
    res.advancedRender("awards/running")
})

router.get("/endurance", (req, res) => {
    res.advancedRender("awards/endurance")
})

module.exports = router;