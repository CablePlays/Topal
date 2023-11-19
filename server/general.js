const cookies = require("./cookies")
const userDatabase = require("./user-database")
const sqlDatabase = require("./sql-database")

const RECENT_AWARDS_LIFETIME = 14 * 24 // hours
const RECENT_AWARDS_MAX = 10

const DEFAULT_PROFILE_PICTURE_PATH = "/assets/other/default-profile-picture.jpg"
const UNKNOWN_TEXT = "N/A"

const AWARDS = {
    drakensberg: {
        signoffs: ["backPack", "cooker", "ecologicalAwareness", "tent"]
    },
    endurance: {},
    enduranceInstructor: {
        signoffs: ["achievedTwice", "attitude", "firstAid", "instruction", "read", "voluntaryService", "whoseWho"]
    },
    enduranceLeader: {},
    kayaking: {
        signoffs: [
            "timeTrials",
            "slalomCircuits",
            "noviceKayakingTest",
            "checks",
            "riverStretch",
            "theoryTest",
            "safetyTest"
        ]
    },
    kayakingInstructor: {
        signoffs: [
            "riverStretches",
            "instructing",
            "attitude",
            "skill",
            "book",
            "equipmentMonitor",
            "rescue",
            "firstAid"
        ]
    },
    kayakingLeader: {},
    midmarMile: {},
    midmarMileInstructor: {
        links: ["previousRescues"]
    },
    midmarMileLeader: {},
    mountaineeringInstructor: {},
    mountaineeringLeader: {},
    polarBear: {},
    polarBearInstructor: {},
    polarBearLeader: {},
    rockClimbing: {
        signoffs: [
            "threadedFigureEight",
            "figureEightBight",
            "tapeKnot",
            "doubleFishermansKnot",
            "harnessTypes",
            "straps",
            "belayPoints",
            "calls",
            "ropeUsage",
            "ropeCoiling",
            "ropeCare",
            "belayingAtc",
            "belayingFigureEight",
            "grigri",
            "belayingLeadClimber",
            "fall",
            "safetyChecks",
            "spottingTechnique",
            "neilSolomonClimbs",
            "insideWallClimbs",
            "lowTraverse",
            "chimneying",
            "chilmneyMantelshelf",
            "cracks",
            "layback",
            "overhangExternal",
            "overhangInternal",
            "quickdraws",
            "clipping",
            "chains",
            "abseilingFigureEight",
            "abseilingAtc",
            "stance",
            "theoryTest",
            "finalAbseil",
            "finalClimbs"
        ]
    },
    rockClimbingInstructor: {
        links: ["bookReviews"],
        signoffs: [
            "bookReviews",
            "knots",
            "maintenance",
            "belays",
            "usage",
            "firstAid",
            "rescueTechniques",
            "logs",
            "attitude",
            "grade",
            "leadClimbsSport",
            "leadClimbsTrad",
            "lowTraverse",
            "protection",
            "ascendRope"
        ]
    },
    rockClimbingLeader: {
        links: ["motivation"],
        signoffs: [
            "experience",
            "supervisedInstruction",
            "routeBooks",
            "hoist",
            "jams",
            "abseiling"
        ]
    },
    running: {},
    service: {},
    serviceInstructor: {},
    serviceLeader: {},
    solitaire: {},
    solitaireInstructor: {},
    solitaireLeader: {},
    summit: {
        signoffs: ["hikingPreparedness", "mapReading", "routeFinding"]
    },
    traverse: {
        links: ["hikePlan", "summary"],
        signoffs: ["hikePlan", "summary"]
    },
    venture: {
        signoffs: ["proposalApproved"]
    },
    ventureLeader: {}
}

const LOG_TYPES = {
    endurance: {},
    flatWaterPaddling: {},
    midmarMileTraining: {},
    mountaineering: {},
    riverTrip: {
        signable: true,
        signoffRequestAward: "kayaking"
    },
    rockClimbing: {
        sublogs: true
    },
    rockClimbingClimbs: {
        parent: "rockClimbing"
    },
    rockClimbingInstruction: {
        signable: true,
        signoffRequestAward: "rockClimbingInstructor"
    },
    running: {},
    service: {
        signable: true,
        signoffRequestAward: "service"
    },
    solitaire: {},
    solitaireInstruction: {}
}

const PERMISSIONS = [
    "manageAwards",
    "manageMics",
    "managePermissions",
    "viewAwardHistory"
]

/* Data */

function getLogTypes() {
    return Object.keys(LOG_TYPES)
}

function getLogsTable(logType) {
    return camelToSnake(logType) + "_logs"
}

function getSublogsTable(logType) {
    return camelToSnake(logType) + "_sublogs"
}

function isAward(awardId, firstLevel) {
    if (AWARDS[awardId] == null) return false
    return !firstLevel || (!awardId.includes("Instructor") && !awardId.includes("Leader"))
}

function getAwardName(awardId) {
    return camelToCapitalized(awardId)
}

function isLink(awardId, linkId) {
    return AWARDS[awardId].links?.includes(linkId)
}

function isSignoff(awardId, signoffId) {
    return AWARDS[awardId].signoffs?.includes(signoffId)
}

function isLogType(logType) {
    return Object.keys(LOG_TYPES).includes(logType)
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

function getLogTypeSignoffRequestAward(logType) {
    return LOG_TYPES[logType].signoffRequestAward
}

function hasSublogs(logType) {
    return LOG_TYPES[logType].sublogs === true
}

function isPermission(permissionId) {
    return PERMISSIONS.includes(permissionId)
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

async function getUserInfo(userId) {
    const record = await sqlDatabase.get(`SELECT * FROM users WHERE id = ${userId}`)
    if (record == null) return {}

    const { email } = record
    const { name, surname, title, profilePicture } = userDatabase.getUser(userId).get(userDatabase.DETAILS_PATH)

    return {
        id: userId,
        email,
        grade: getGradeFromEmail(email),
        name,
        surname,
        title,
        profilePicture: profilePicture ?? DEFAULT_PROFILE_PICTURE_PATH,
        fullName: (title ? title + " " : "") + `${name} ${surname}`, // e.g. Mr John Doe
        titleName: (title ? title : name) + " " + surname // e.g. John Doe / Mr Doe
    }
}

function isUserInvisible(userId) {
    return userDatabase.getUser(userId).get(userDatabase.DETAILS_PATH)?.invisible ?? false
}

async function isPasswordValid(req) {
    const userId = cookies.getUserId(req)
    if (userId == null) return false

    const clientSessionToken = cookies.getPassword(req)
    if (clientSessionToken == null) return false

    const sessionToken = userDatabase.getUser(userId).get(userDatabase.DETAILS_PATH + ".sessionToken")
    return (clientSessionToken === sessionToken)
}

async function provideUserInfoToStatus(status) {
    const { decline, signer } = status

    if (signer != null && await sqlDatabase.isUser(signer)) {
        status.signer = await getUserInfo(signer)
    }
    if (decline != null) {
        const { user } = decline

        if (user != null && await sqlDatabase.isUser(user)) {
            decline.user = await getUserInfo(user)
        }
    }
}

async function provideUserInfoToStatuses(statuses) {
    const statusKeys = Object.keys(statuses)

    await forEachAndWait(statusKeys, async status => {
        await provideUserInfoToStatus(statuses[status])
    })
}

function getPermissions(userId, raw) {
    const permissions = userDatabase.getUser(userId).get(userDatabase.PERMISSIONS_PATH) ?? {}

    if (!raw && permissions.managePermissions === true) {
        for (let permission of PERMISSIONS) {
            permissions[permission] = true
        }
    }

    for (let key in permissions) {
        if (permissions[key]) {
            permissions.any = true
            break
        }
    }

    return permissions
}

function createDummyUsers() {
    async function createDummy(userId, sessionToken, name, surname, title) {
        if (!await sqlDatabase.isUser(userId)) {
            sqlDatabase.run(`INSERT INTO users VALUES (${userId}, "dummy${userId}@treverton.co.za")`)
            userDatabase.getUser(userId).set(userDatabase.DETAILS_PATH, { name, surname, title, sessionToken, invisible: true })
        }
    }

    createDummy(1, "Jfijwelafeowifiew", "Astra", "Spero")
    createDummy(2, "LapifweOEOvuOAA", "John", "Doe", "Mr")
    createDummy(3, "pavpewfuHoweNJA", "Test", "Dummy")
}

/* Utility */

function kebabToCamel(s) { // kebab-case camelCase
    return s.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

function camelToSnake(s) { // camelCase snake_case
    return s.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
}

function camelToCapitalized(s) { // camelCase
    return s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())
}

function formatDateForStorage(date) {
    let month = date.getMonth() + 1
    return `${date.getFullYear()}-${month.toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
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
    getLogTypes,
    getLogsTable,
    getSublogsTable,
    isAward,
    getAwardName,
    isLogType,
    getParentLogType,
    getChildrenLogTypes,
    isSignable,
    getLogTypeSignoffRequestAward,
    hasSublogs,
    isPermission,
    isLink,
    isSignoff,
    isPasswordValid,
    forEachAndWait,
    provideUserInfoToStatus,
    provideUserInfoToStatuses,
    getPermissions,
    getUserInfo,
    getGrade,
    getGradeFromEmail,
    kebabToCamel,
    isUserInvisible,
    formatDateForStorage
}