const _AWARDS = {
    drakensberg: {
        name: "Drakensberg",
        description: "TODO"
    },
    endurance: {
        name: "Endurance",
        description: "TODO"
    },
    enduranceInstructor: {
        name: "Endurance Instructor",
        description: "TODO"
    },
    enduranceLeader: {
        name: "Endurance Leader",
        description: "TODO"
    },
    kayaking: {
        name: "Kayaking",
        description: "TODO",
        signoffs: [
            {
                id: "signoffA",
                name: "Signoff A",
                description: "This is a description of signoff A."
            },
            {
                id: "signoffB",
                name: "Signoff B",
                description: "This is a description of signoff B."
            },
            {
                id: "signoffC",
                name: "Signoff C",
                description: "This is a description of signoff C."
            }
        ]
    },
    kayakingInstructor: {
        name: "Kayaking Instructor",
        description: "TODO"
    },
    kayakingLeader: {
        name: "Kayaking Leader",
        description: "TODO"
    },
    midmarMile: {
        name: "Midmar Mile",
        description: "TODO"
    },
    midmarMileInstructor: {
        name: "Midmar Mile Instructor",
        description: "TODO"
    },
    midmarMileLeader: {
        name: "Midmar Mile Leader",
        description: "TODO"
    },
    mountaineeringInstructor: {
        name: "Mountaineering Instructor",
        description: "TODO"
    },
    mountaineeringLeader: {
        name: "Mountaineering Leader",
        description: "TODO"
    },
    polarBear: {
        name: "Polar Bear",
        description: "TODO"
    },
    polarBearInstructor: {
        name: "Polar Bear Instructor",
        description: "TODO"
    },
    polarBearLeader: {
        name: "Polar Bear Leader",
        description: "TODO"
    },
    rockClimbing: {
        name: "Rock Climbing",
        description: "TODO"
    },
    rockClimbingInstructor: {
        name: "Rock Climbing Instructor",
        description: "TODO"
    },
    rockClimbingLeader: {
        name: "Rock Climbing Leader",
        description: "TODO"
    },
    running: {
        name: "Running",
        description: `Spend time on the trails and accumulate 100km of distance to earn this award.
            Every time you go for a run, log it so that your total distance increases.
            Once you've reached 100km, you will receive this award.`
    },
    service: {
        name: "Service",
        description: "TODO"
    },
    serviceInstructor: {
        name: "Service Instructor",
        description: "TODO"
    },
    serviceLeader: {
        name: "Service Leader",
        description: "TODO"
    },
    solitaire: {
        name: "Solitaire",
        description: "TODO"
    },
    solitaireInstructor: {
        name: "Solitaire Instructor",
        description: "TODO"
    },
    solitaireLeader: {
        name: "Solitaire Leader",
        description: "TODO"
    },
    summit: {
        name: "Summit",
        description: "TODO"
    },
    traverse: {
        name: "Traverse",
        description: "TODO"
    },
    venture: {
        name: "Venture",
        description: "TODO"
    },
    ventureLeader: {
        name: "Venture Leader",
        description: "TODO"
    }
}

/*
    Returns a list of award IDs.
*/
function getAwards() {
    const awards = [];

    for (let award in _AWARDS) {
        awards.push(award)
    }

    return awards
}

function getAwardName(awardId) {
    return _AWARDS[awardId].name
}

function getAwardDescription(awardId) {
    return _AWARDS[awardId].description
}

function getAwardSignoffs(awardId) {
    return _AWARDS[awardId].signoffs
}

function awardHasInstructor(awardId) {
    return _AWARDS[awardId + "Instructor"] != null
}

function awardHasLeader(awardId) {
    return _AWARDS[awardId + "Leader"] != null
}