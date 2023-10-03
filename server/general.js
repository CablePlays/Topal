const cookies = require("./cookies")
const jsonDatabase = require("./json-database")
const sqlDatabase = require("./sql-database")

const RECENT_AWARDS_LIFETIME = 48 // hours
const RECENT_AWARDS_MAX = 10

const DEFAULT_PROFILE_PICTURE_PATH = "/assets/other/default-profile-picture.jpg"
const UNKNOWN_TEXT = "N/A"

const AWARDS = {
    drakensberg: {
        signoffs: ["backPack", "cooker", "ecologicalAwareness", "tent"]
    },
    endurance: {},
    enduranceInstructor: {
        name: "Endurance Instructor",
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
    midmarMileInstructor: {},
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
    solitaire: {},
    solitaireInstructor: {}
}

const PERMISSIONS = [
    "manageAwards",
    "managePermissions"
]

/* Data */

function getLogsTable(logType) {
    return pascalToSnake(logType) + "_logs"
}

function getSublogsTable(logType) {
    return pascalToSnake(logType) + "_sublogs"
}

function isAward(awardId) {
    return AWARDS[awardId] != null
}

function isLink(awardId, linkId) {
    return AWARDS[awardId].links?.includes(linkId)
}

function isSignoff(awardId, signoffId) {
    return AWARDS[awardId].signoffs?.includes(signoffId)
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

function kebabToCamel(kebabCaseStr) { // kebab-case camelCase
    return kebabCaseStr.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

function pascalToSnake(camelCaseString) { // PascalCase snake_case
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
    isLogType,
    getParentLogType,
    getChildrenLogTypes,
    isSignable,
    hasSublogs,
    isPermission,
    isLink,
    isSignoff,
    isPasswordValid,
    forEachAndWait,
    provideUserInfoToStatus,
    provideUserInfoToStatuses,
    getUserInfo,
    getGrade,
    getGradeFromEmail,
    kebabToCamel
}