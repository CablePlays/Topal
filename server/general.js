const cookies = require("./cookies")
const jsonDatabase = require("./json-database")
const sqlDatabase = require("./sql-database")

const RECENT_AWARDS_LIFETIME = 48 // hours
const RECENT_AWARDS_MAX = 10

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
    midmarMile: {},
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
    if (["signoffA", "signoffB", "signoffC"].includes(signoffId)) { // TODO: remove
        return true
    }
    switch (awardId) {
        case "drakensberg":
            return [
                "cooker",
                "backBack",
                "ecologicalAwareness",
                "pitchTent"
            ].includes(signoffId)
        case "enduranceInstructor":
            return [
                'bothAwardsTwice',
                'firstAid',
                'instruct',
                'mentalAttitude',
                'organisingEvents',
                'readBook',
                'who'
            ].includes(signoffId)
        case "kayaking":
            return [
                'circuits',
                'mooiRiver',
                'noviceKayakingTest',
                'riverSafetyTest',
                'safetyChecks',
                'theoryTest',
                'timeTrial'
            ].includes(signoffId)
        case "kayakingInstructor":
            return [
                "attitude",
                "firstAid",
                "instruct",
                "knowledge",
                "monitor",
                "mooiRiver",
                "rescue",
                "skill"
            ].includes(signoffId)
        case "mountaineeringInstructor":
            return [
                "firstAid",
                "handling",
                "history",
                "logs",
                "rescueProcedues",
                "ropeWork"
            ].includes(signoffId)
        case "rockClimbing": {
            const valid = [
                ["knots", 4],
                ["harness", 7],
                ["belaying", 11],
                ["wallLeadClimb", 3],
                ["abseiling", 3],
                ["finalTests", 3]
            ]

            for (let a of valid) {
                for (let i = 1; i <= a[1]; i++) {
                    if (signoffId === a[0] + i) {
                        return true
                    }
                }
            }

            return false
        }
        case "rockClimbingInstructor":
            return [
                "ascendRope",
                "attitude",
                "belays",
                "bookReviews",
                "climbingGrade",
                "devices",
                "equipment",
                "firstAid",
                "knots",
                "leadClimbsSport",
                "leadClimbsTrad",
                "logs",
                "protection",
                "rescueTechniques",
                "traverse"
            ].includes(signoffId)
        case "rockClimbingLeader":
            return [
                "abseiling",
                "descriptions",
                "experience",
                "hoist",
                "logs",
                "tangles"
            ].includes(signoffId)
        case "summit":
            return [
                "mapReading",
                "preparedness",
                "routeFinding"
            ].includes(signoffId)
        case "traverse":
            return [
                "hikePlan",
                "summary"
            ].includes(signoffId)
    }

    return false
}

/* Users */

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
        profilePicture: profilePicture ?? "/assets/icons/default-profile-picture.jpg",
        fullName: (title ? title + " " : "") + `${name} ${surname}`, // Mr John Doe
        titleName: (title ? title : name) + " " + surname // John Doe / Mr Doe
    }
}

function hasAnyPermission(permissions) {
    for (let permission of PERMISSIONS) {
        if (permissions[permission] === true) {
            return true
        }
    }

    return false
}

async function isPasswordValid(req) {
    const userId = cookies.getUserId(req)
    if (userId == null) return false

    const clientSessionToken = cookies.getPassword(req)
    if (clientSessionToken == null) return false

    const sessionToken = jsonDatabase.getUser(userId).get(jsonDatabase.SESSION_TOKEN_PATH)
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
    const separatedStatuses = Object.getOwnPropertyNames(statuses)

    await forEachAndWait(separatedStatuses, async status => {
        await provideUserInfoToStatus(statuses[status])
    })
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
    hasAnyPermission,
    isPasswordValid,
    forEachAndWait,
    provideUserInfoToStatus,
    provideUserInfoToStatuses,
    getUserInfo
}