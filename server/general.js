const cookies = require("./cookies")
const jsonDatabase = require("./json-database")
const sqlDatabase = require("./sql-database")

const RECENT_AWARDS_LIFETIME = 48 // hours
const RECENT_AWARDS_MAX = 10

const DEFAULT_PROFILE_PICTURE_PATH = "/assets/other/default-profile-picture.jpg"
const UNKNOWN_TEXT = "N/A"

const APPROVALS = [
    "rockClimbingBelayer",
    "ventureProposal"
]

const AWARDS = [
    "drakensberg",
    "endurance", "enduranceInstructor", "enduranceLeader",
    "kayaking", "kayakingInstructor", "kayakingLeader",
    "midmarMile", "midmarMileInstructor", "midmarMileLeader",
    "mountaineeringInstructor", "mountaineeringLeader",
    "polarBear", "polarBearInstructor", "polarBearLeader",
    "rockClimbing", "rockClimbingInstructor", "rockClimbingLeader",
    "running",
    "service", "serviceInstructor", "serviceLeader",
    "solitaire", "solitaireInstructor", "solitaireLeader",
    "summit",
    "traverse",
    "venture", "ventureInstructor"
]

const PERMISSIONS = [
    "manageAwards",
    "managePermissions",
    "viewAuditLog"
]

const LOG_TYPES = { // cannot be both sublog and singleton
    endurance: {},
    flatWaterPaddling: {},
    midmarMileTraining: {},
    mountaineering: {},
    riverTrip: {
        signable: true
    },
    rockClimbing: {
        sublogs: true
    },
    rockClimbingClimbs: {
        parent: "rockClimbing"
    },
    rockClimbingInstruction: {
        signable: true
    },
    running: {},
    service: {
        signable: true
    },
    solitaire: {
        singleton: true
    },
    solitaireInstructor: {
        singleton: true
    },
    solitaireLeader: {
        singleton: true
    }
}

/* Data */

function getLogsTable(logType) {
    return camelToSnakeCase(logType) + "_logs"
}

function getSublogsTable(logType) {
    return camelToSnakeCase(logType) + "_sublogs"
}

function isAward(id) {
    return AWARDS.includes(id)
}

function isApproval(id) {
    return APPROVALS.includes(id)
}

function isLogType(logType) {
    return Object.getOwnPropertyNames(LOG_TYPES).includes(logType)
}

function getParentLogType(logType) {
    return LOG_TYPES[logType].parent
}

function getChildrenLogTypes(logType) {
    const children = []

    for (let key in LOG_TYPES) {
        const { parent } = LOG_TYPES[key]

        if (parent === logType) {
            children.push(key)
        }
    }

    return children
}

function isSignable(logType) {
    return LOG_TYPES[logType].signable === true
}

function isSingleton(logType) {
    return LOG_TYPES[logType].singleton === true
}

function hasSublogs(logType) {
    return LOG_TYPES[logType].sublogs === true
}

function isPermission(permission) {
    return PERMISSIONS.includes(permission)
}

function isSignoff(awardId, signoffId) {
    switch (awardId) {
        case "enduranceInstructor":
            return [
                "achievedTwice",
                "attitude",
                "firstAid",
                "instruction",
                "read",
                "voluntaryService",
                "whoseWho"
            ].includes(signoffId)
    }

    return false
}

/* Users */

function getGradeFromEmail(email) {
    const [a, b] = email
    if (isNaN(parseInt(a))) return null // does not begin with number

    let matricYear

    if (isNaN(parseInt(b))) {
        matricYear = parseInt("2" + a)
    } else {
        matricYear = parseInt(a + b)
    }

    const currentYear = new Date().getFullYear()
    return currentYear - matricYear - 1988
}

async function getGrade(userId) {
    const email = await sqlDatabase.getEmail(userId)
    return email && getGradeFromEmail(email)
}

async function getUserDetails(userId) {
    const record = await sqlDatabase.get(`SELECT * FROM users WHERE id = "${userId}"`)
    if (record == null) return {}

    const { email } = record
    const { name, surname, title, profilePicture } = jsonDatabase.getUser(userId).get(jsonDatabase.DETAILS_PATH)

    return {
        id: userId,
        email,
        name,
        surname,
        title,
        profilePicture: profilePicture ?? DEFAULT_PROFILE_PICTURE_PATH,
        fullName: (title ? title + " " : "") + `${name} ${surname}`, // e.g. Mr John Doe
        titleName: (title ? title : name) + " " + surname, // e.g. John Doe / Mr Doe
        titleSurname: title ? title + " " + surname : name // e.g. John / Mr Doe
    }
}

async function isPasswordValid(req) {
    const userId = cookies.getUserId(req)
    if (userId == null) return false

    const clientSessionToken = cookies.getPassword(req)
    if (clientSessionToken == null) return false

    const sessionToken = jsonDatabase.getUser(userId).get(jsonDatabase.DETAILS_PATH + ".sessionToken")
    return (clientSessionToken === sessionToken)
}

async function provideUserInfoToStatus(status) {
    const { decline, signer } = status

    if (signer != null && await sqlDatabase.isUser(signer)) {
        status.signer = await getUserDetails(signer)
    }
    if (decline != null) {
        const { user } = decline

        if (user != null && await sqlDatabase.isUser(user)) {
            decline.user = await getUserDetails(user)
        }
    }
}

async function provideUserInfoToStatuses(statuses) {
    const statusKeys = Object.getOwnPropertyNames(statuses)

    await forEachAndWait(statusKeys, async status => {
        await provideUserInfoToStatus(statuses[status])
    })
}

function createDummyUsers() {
    async function createDummy(userId, name, surname, title) {
        if (!await sqlDatabase.get(`SELECT * FROM users WHERE id = ${userId}`)) {
            sqlDatabase.run(`INSERT INTO users VALUES (${userId}, "dummy${userId}@treverton.co.za")`)
            jsonDatabase.getUser(userId).set(jsonDatabase.DETAILS_PATH, { name, surname, title, sessionToken: `dummy${userId}` })
        }
    }

    createDummy(1, "Astra", "Spero")
    createDummy(2, "James", "Lotz")
    createDummy(3, "John", "Doe", "Mr")
}

/* Utility */

function camelToSnakeCase(camelCaseString) {
    return camelCaseString.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
}

/*
    Runs an async function on a list of objects and waits for all functions to be completed.
*/
async function forEachAndWait(array, consumer) {
    const promises = []

    for (let value of array) {
        const promise = consumer(value)
        promises.push(promise)
    }

    return Promise.all(promises)
}

module.exports = {
    RECENT_AWARDS_LIFETIME,
    RECENT_AWARDS_MAX,
    PERMISSIONS,
    DEFAULT_PROFILE_PICTURE_PATH,
    UNKNOWN_TEXT,

    createDummyUsers,
    getLogsTable,
    getSublogsTable,
    isAward,
    isApproval,
    isLogType,
    getParentLogType,
    getChildrenLogTypes,
    isSignable,
    isSingleton,
    hasSublogs,
    isPermission,
    isSignoff,
    isPasswordValid,
    forEachAndWait,
    provideUserInfoToStatus,
    provideUserInfoToStatuses,
    getUserDetails,
    getGrade,
    getGradeFromEmail
}