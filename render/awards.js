const express = require("express")
const fs = require("fs")
const path = require("path")
const general = require("../server/general")

const router = express.Router()

router.use("/", (req, res, next) => {
    const { setTitle } = res
    res.setTitle = awardId => setTitle(`Awards - ${general.getAwardName(awardId)}`)
    next()
})

router.get("/drakensberg", (req, res) => {
    res.setTitle("drakensberg")
    res.ren("awards/mountaineering/drakensberg")
})

router.get("/summit", (req, res) => {
    res.setTitle("summit")
    res.ren("awards/mountaineering/summit")
})

router.get("/traverse", (req, res) => {
    res.setTitle("summit")
    res.ren("awards/mountaineering/traverse")
})

router.get("/:awardId", (req, res, next) => {
    const { awardId: awardIdUnformatted } = req.params

    const awardId = general.kebabToCamel(awardIdUnformatted)
    let awardIdShort = awardIdUnformatted // excludes sequel
    const sequelTypes = ["instructor", "leader"]

    for (let st of sequelTypes) {
        if (awardIdShort.endsWith(st)) {
            awardIdShort = awardIdShort.substring(0, awardIdShort.length - st.length - 1)
            break
        }
    }

    const filePath = "awards/" + awardIdShort.replaceAll("-", "_") + "/" + awardIdUnformatted
    const check = path.resolve("views/" + filePath + ".pug")

    fs.access(check, fs.constants.F_OK, err => {
        if (err) {
            next() // does not exist
        } else {
            res.setTitle(awardId)
            res.ren(filePath)
        }
    })
})

module.exports = router