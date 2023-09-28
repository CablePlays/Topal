/*
    If description is excluded then uses description from first-level award.
*/
const _AWARDS = {
    drakensberg: {
        name: "Drakensberg",
        description: "TODO"
    },
    endurance: {
        name: "Endurance",
        description: "The Endurance Award recognizes achievement in road/trail running, adventure racing, competing in a multisport race, triathlon, mountain bike races, horse riding and canoeing."
    },
    enduranceInstructor: {
        name: "Endurance Instructor",
        signoffs: [
            {
                id: "achievedTwice",
                name: "Achieved Twice",
                description: "Achieved both awards twice in two years."
            }, 
            {
                id: "read",
                name: "Reading",
                description: "Read a book on training and you are knowledgeable in training methods for one category of races."
            }, 
            {
                id: "instruction",
                name: "Instruction",
                description: "Practical ability to instruct a novice in basic training in running, MTB or AR. You have spent time doing so."
            }, 
            {
                id: "whoseWho",
                name: "Whose Who",
                description: "Familiarity with <i>Whose Who</i> in current endurance sport (from reading running magazines, internet, TV)."
            }, 
            {
                id: "firstAid",
                name: "First Aid Training",
                description: "You have first aid training or your familiarity with endurance problems and their treatment satisfies the TIC."
            }, 
            {
                id: "attitude",
                name: "Healthy Mental Attitude",
                description: "Exhibits a healthy mental attitude toward the sport and toward others."
            }, 
            {
                id: "voluntaryService",
                name: "Voluntary Service",
                description: "You have performed voluntary service (either at Treverton or elsewhere) in administration and organizational roles - a minimum of organizing three events."
            }
        ]
    },
    enduranceLeader: {
        name: "Endurance Leader"
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
        description: "Created by Mr Neil Solomon and based on similar awards around the world, the Polar Bear challenge is a daring one which involves jumping into the school dam early morning once a week."
    },
    polarBearInstructor: {
        name: "Polar Bear Instructor"
    },
    polarBearLeader: {
        name: "Polar Bear Leader"
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
    const description = _AWARDS[awardId].description
    if (description) return description

    const baseAward = awardId.replace("Instructor", "").replace("Leader", "")
    return getAwardDescription(baseAward)
}

function getAwardSignoffs(awardId) {
    return _AWARDS[awardId].signoffs
}

function isAward(awardId) {
    return _AWARDS[awardId] != null
}

function awardHasInstructor(awardId) {
    return _AWARDS[awardId + "Instructor"] != null
}

function awardHasLeader(awardId) {
    return _AWARDS[awardId + "Leader"] != null
}