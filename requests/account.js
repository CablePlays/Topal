const express = require("express")
const { v4: uuidv4 } = require("uuid")
const { OAuth2Client } = require("google-auth-library")
const cookies = require("../server/cookies")
const sqlDatabase = require("../server/sql-database")
const userDatabase = require("../server/user-database")

const router = express.Router()

const authClient = new OAuth2Client()

router.put("/handle-login", async (req, res) => { // handle login token from Google
    const { token } = req.body
    let ticket

    try {
        ticket = await authClient.verifyIdToken({
            idToken: token,
            audience: "845759383814-euo1d2mg84udjd8nfb3a0g3iogrio2mp.apps.googleusercontent.com"
        })
    } catch (error) {
        console.warn("Invalid JWT: " + error.message)
        res.res(500)
        return
    }

    const { email, given_name, family_name, picture } = ticket.getPayload()
    const domain = email.split("@")[1]

    if (domain !== "treverton.co.za") {
        res.res(500, "invalid_email")
        return
    }

    const record = await sqlDatabase.get(`SELECT * FROM users WHERE email = "${email}"`)
    let userId
    let sessionToken
    let ud

    if (record) {
        const { id } = record
        ud = userDatabase.getUser(id)
        const sessionTokenPath = userDatabase.DETAILS_PATH + ".sessionToken"

        userId = id
        sessionToken = ud.get(sessionTokenPath)

        if (sessionToken == null) {
            sessionToken = uuidv4()
            ud.set(sessionTokenPath, sessionToken)
        }
    } else { // create account
        await sqlDatabase.run(`INSERT INTO users (email) VALUES ("${email}")`)
        userId = (await sqlDatabase.get(`SELECT * FROM users WHERE email = "${email}"`)).id
        sessionToken = uuidv4()

        ud = userDatabase.getUser(userId)
        ud.set(userDatabase.DETAILS_PATH, { sessionToken })
    }

    // update details
    ud.set(userDatabase.DETAILS_PATH + ".name", given_name)
    ud.set(userDatabase.DETAILS_PATH + ".surname", family_name)
    
    const profilePicturePath = userDatabase.DETAILS_PATH + ".profilePicture"

    if (picture) {
        ud.set(profilePicturePath, picture)
    } else { // profile picture only visible within organisation
        ud.delete(profilePicturePath)
    }

    res.cookie(cookies.USER_COOKIE, userId)
    res.cookie(cookies.PASSWORD_COOKIE, sessionToken)
    res.res(204)
})

module.exports = router