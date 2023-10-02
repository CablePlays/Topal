const express = require("express")
const fs = require("fs")
const path = require("path")

const router = express.Router()

router.get("/drakensberg", (req, res) => {
    res.ren("awards/mountaineering/drakensberg")
})

router.get("/summit", (req, res) => {
    res.ren("awards/mountaineering/summit")
})

router.get("/traverse", (req, res) => {
    res.ren("awards/mountaineering/traverse")
})

router.get("/:awardType", (req, res, next) => {
    const sequelTypes = ["instructor", "leader"]
    const awardType = req.params.awardType
    let awardTypeShort = awardType // excludes sequel

    for (let st of sequelTypes) {
        if (awardTypeShort.endsWith(st)) {
            awardTypeShort = awardTypeShort.substring(0, awardTypeShort.length - st.length - 1)
            break
        }
    }

    const filePath = "awards/" + awardTypeShort.replaceAll("-", "_") + "/" + awardType
    const check = path.resolve("views/" + filePath + ".pug")

    fs.access(check, fs.constants.F_OK, err => {
        if (err) {
            next() // does not exist
        } else {
            res.ren(filePath)
        }
    })
})

module.exports = router