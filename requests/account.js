const express = require("express")
const { v4: uuidv4 } = require("uuid")
const { OAuth2Client } = require("google-auth-library")
const cookies = require("../server/cookies")
const jsonDatabase = require("../server/json-database")
const sqlDatabase = require("../server/sql-database")

const router = express.Router()

const authClient = new OAuth2Client()

router.put("/handle-login", async (req, res) => { // handle login token from Google
    const { token } = req.body
    let ticket

    try {
        ticket = await authClient.verifyIdToken({
            idToken: token,
            audience: "234912320633-vfi8srp2bhol1lb0a814mn4e4oo7a920.apps.googleusercontent.com"
        })
    } catch (error) {
        console.warn("Invalid JWT: " + error.message)
        res.res(500)
        return
    }

    const { email, given_name, family_name } = ticket.getPayload()
    const domain = email.split("@")[1]

    if (domain !== "treverton.co.za") {
        res.res(500, "invalid_email")
        return
    }

    const record = await sqlDatabase.get(`SELECT * FROM users WHERE email = "${email}"`)
    let userId
    let sessionToken

    if (record) {
        const { id } = record
        const userDatabase = jsonDatabase.getUser(id)

        userId = id
        sessionToken = userDatabase.get(jsonDatabase.SESSION_TOKEN_PATH)

        if (sessionToken == null) {
            sessionToken = uuidv4()
            userDatabase.set(jsonDatabase.SESSION_TOKEN_PATH, sessionToken)
        }
    } else { // create account
        sessionToken = uuidv4()

        await sqlDatabase.run(`INSERT INTO users (email) VALUES ("${email}")`)
        userId = (await sqlDatabase.get(`SELECT * FROM users WHERE email = "${email}"`)).id

        const userDatabase = jsonDatabase.getUser(userId)
        userDatabase.set(jsonDatabase.SESSION_TOKEN_PATH, sessionToken)
        userDatabase.set(jsonDatabase.SETTINGS_PATH, {name: given_name, surname: family_name})
    }

    res.cookie(cookies.USER_COOKIE, userId)
    res.cookie(cookies.PASSWORD_COOKIE, sessionToken)
    res.res(204)
})

module.exports = router