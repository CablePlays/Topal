const nodemailer = require("nodemailer")
const schedule = require("node-schedule")
const general = require("./general")
const sqlDatabase = require("./sql-database")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "topal2024online@gmail.com",
        pass: "hrlz zflv zunz hqik"
    }
})

async function sendEmail(to, subject, html) {
    const totalUsers = to.split(" ").length
    console.info(`Sending email with subject "${subject}" to ${totalUsers} users`)

    transporter.sendMail({
        from: '"Topal" <topal2024online@treverton.co.za>',
        to,
        subject,
        html
    }, (error, info) => {
        if (error) {
            console.error("There was an error when sending the email:")
            console.error(error)
        } else {
            console.info("Email(s) sent successfully")
        }
    })
}

async function getRequestDetails() {
    const requests = await general.getSignoffRequestsInfo()
    const totals = {}

    const increase = (awardId, v) => {
        if (totals[awardId]) {
            totals[awardId] += v
        } else {
            totals[awardId] = v
        }
    }

    for (let userId in requests) {
        const { requests: ur } = requests[userId]

        for (let awardId in ur) {
            increase(awardId.replace("Instructor", "").replace("Leader", ""), ur[awardId])
        }
    }

    return [Object.keys(requests).length, totals]
}

function formatRequestTotals(totals) {
    const requestsArray = []

    for (let awardId in totals) {
        requestsArray.push({ name: general.getAwardName(awardId), total: totals[awardId] })
    }

    requestsArray.sort((a, b) => a.name.localeCompare(b.name))

    let html = "<ul>"

    for (let award of requestsArray) {
        html += `\n<li>${award.name}: ${award.total} request${award.total === 1 ? "" : "s"}</li>`
    }

    return html + "</ul>"
}

function getTotalRequests(requestTotals) {
    let total = 0

    for (let awardId in requestTotals) {
        total += requestTotals[awardId]
    }

    return total
}

async function generateEmailNotificationDetails() {
    const [totalUsers, requestTotals] = await getRequestDetails()
    const totalAwards = Object.keys(requestTotals).length
    const totalRequests = getTotalRequests(requestTotals)

    const s = `style='color: #f47721'`
    const message = `<h1 style="font-weight: 200">Topal Signoff Requests</h1>
<p style="font-size: 16px">There are a total of <span ${s}>${totalRequests}</span> requests from <span ${s}>${totalAwards}</span> award${totalAwards === 1 ? "" : "s"} by <span ${s}>${totalUsers}</span> user${totalUsers === 1 ? "" : "s"}.</p>
<p>Click <a ${s} href='https://opawards.treverton.co.za/admin/signoff-requests'>here</a> to sign off and manage requests.</p>
${formatRequestTotals(requestTotals)}`

    return [totalRequests, message]
}

async function sendEmailNotification() {
    const [totalRequests, message] = await generateEmailNotificationDetails()
    const emails = []

    for (let userId of await sqlDatabase.getUsers()) {
        const permissions = general.getPermissions(userId)

        if (permissions.manageAwards) {
            emails.push(await sqlDatabase.getEmail(userId))
        }
    }

    const users = emails.join(" ")
    sendEmail(users, `${totalRequests} Topal Signoff Request${totalRequests === 1 ? "" : "s"}`, message)
}

function scheduleEmails() {
    schedule.scheduleJob({
        dayOfWeek: 1,
        hour: 0,
        minute: 0
    }, sendEmailNotification)
}

module.exports = {
    scheduleEmails
}