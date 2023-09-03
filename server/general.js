const cookies = require("./cookies")
const sqlDatabase = require("./sql-database")

const RECENT_AWARDS_LIFETIME = 48 // hours
const RECENT_AWARDS_MAX = 10

const APPROVALS = [
    "rockClimbingBelayer",
    "ventureProposal"
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

function camelToSnakeCase(camelCaseString) {
    return camelCaseString.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
}

function getLogsTable(logType) {
    return camelToSnakeCase(logType) + "_logs"
}

function getSublogsTable(logType) {
    return camelToSnakeCase(logType) + "_sublogs"
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

function isSignoff(type, id) {
    switch (type) {
        case "drakensberg":
            return [
                "cooker",
                "backBack",
                "ecologicalAwareness",
                "pitchTent"
            ].includes(id)
        case "enduranceInstructor":
            return [
                'bothAwardsTwice',
                'firstAid',
                'instruct',
                'mentalAttitude',
                'organisingEvents',
                'readBook',
                'who'
            ].includes(id)
        case "kayaking":
            return [
                'circuits',
                'mooiRiver',
                'noviceKayakingTest',
                'riverSafetyTest',
                'safetyChecks',
                'theoryTest',
                'timeTrial'
            ].includes(id)
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
            ].includes(id)
        case "mountaineeringInstructor":
            return [
                "firstAid",
                "handling",
                "history",
                "logs",
                "rescueProcedues",
                "ropeWork"
            ].includes(id)
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
                    if (id === a[0] + i) {
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
            ].includes(id)
        case "rockClimbingLeader":
            return [
                "abseiling",
                "descriptions",
                "experience",
                "hoist",
                "logs",
                "tangles"
            ].includes(id)
        case "summit":
            return [
                "mapReading",
                "preparedness",
                "routeFinding"
            ].includes(id)
        case "traverse":
            return [
                "hikePlan",
                "summary"
            ].includes(id)
    }

    return false
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

    const clientPassword = cookies.getPassword(req)
    if (clientPassword == null) return false

    const password = await sqlDatabase.getPassword(userId)
    return (clientPassword === password)
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

async function provideUserInfoToStatus(status) {
    const { decline, signer } = status

    if (signer != null && await sqlDatabase.isUser(signer)) {
        status.signer = await sqlDatabase.getUserInfo(signer)
    }
    if (decline != null) {
        const { user } = decline

        if (user != null && await sqlDatabase.isUser(user)) {
            decline.user = await sqlDatabase.getUserInfo(user)
        }
    }
}

async function provideUserInfoToStatuses(statuses) {
    const separatedStatuses = Object.getOwnPropertyNames(statuses)

    await forEachAndWait(separatedStatuses, async status => {
        await provideUserInfoToStatus(statuses[status])
    })
}

module.exports = {
    RECENT_AWARDS_LIFETIME,
    RECENT_AWARDS_MAX,
    PERMISSIONS,

    getLogsTable,
    getSublogsTable,

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
    provideUserInfoToStatuses
}