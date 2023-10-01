/*
    If description is excluded then uses description from first-level award.
*/

const _MOUNTAINEERING_DESCRIPTION = "Spend time hiking in mountainous areas or natural places. There are five hiking awards that you learner can achieve."

const _AWARDS = {
    drakensberg: {
        name: "Drakensberg",
        description: _MOUNTAINEERING_DESCRIPTION,
        signoffs: [
            {
                id: "tent",
                name: "Tent Pitching",
                description: "You are competent to pitch a tent."
            },
            {
                id: "cooker",
                name: "Hiking Cooker",
                description: "You know how to use a hiking cooker."
            },
            {
                id: "ecologicalAwareness",
                name: "Ecological Awareness"
            },
            {
                id: "backPack",
                name: "Back Pack",
                description: "You are able to pack a back pack."
            }
        ]
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
        name: "Midmar Mile Instructor"
    },
    midmarMileLeader: {
        name: "Midmar Mile Leader"
    },
    mountaineeringInstructor: {
        name: "Mountaineering Instructor",
        description: _MOUNTAINEERING_DESCRIPTION,
        links: [
            {
                id: "previousRescues",
                name: "Previous Rescues"
            }
        ],
        signoffs: [
            {
                id: "firstAid",
                name: "Wilderness First Aid",
                description: "You have a valid wilderness first aid and CPR certification."
            },
            {
                id: "leading",
                name: "Leading Ability",
                description: "Proven practical ability to lead a Berg trip with understanding of planning, route finding, advanced map reading as well as the ability to handle poeple."
            },
            {
                id: "rescues",
                name: "Rescue Procedures",
                description: "You are knowledgeable of rescue procedures (attach summaries of previous rescues)."
            },
            {
                id: "history",
                name: "Drakensberg History",
                description: "Able to give a two minute report on the history of the Berg (useful resource: Barrier of Spears)."
            },
            {
                id: "rockClimbing",
                name: "Rock Climbing Award",
                description: "Achieved the Rock Climbing Award, is competent and able to demonstrate and explain rope work."
            },
            {
                id: "logs",
                name: "Accurate Logs",
                description: "Kept accurate logs of hikes and has shown ability in planning hikes as an assistant leader."
            }
        ]
    },
    mountaineeringLeader: {
        name: "Mountaineering Leader",
        description: _MOUNTAINEERING_DESCRIPTION
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
        description: "Spend time on the trails and accumulate 100km of distance to earn this award. Every time you go for a run, log it so that your total distance increases. Once you've reached 100km, you will receive this award."
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
        description: _MOUNTAINEERING_DESCRIPTION,
        signoffs: [
            {
                id: "hikingPreparedness",
                name: "Hiking Preparedness Test",
                description: "You have passed the hiking preparedness test."
            },
            {
                id: "mapReading",
                name: "Map Reading Test",
                description: "You have passed the map reading test."
            },
            {
                id: "routeFinding",
                name: "Route Finding Test",
                description: "You have passed the route finding test."
            }
        ]
    },
    traverse: {
        name: "Traverse",
        description: _MOUNTAINEERING_DESCRIPTION,
        links: [
            {
                id: "summary",
                name: "Summary"
            },
            {
                id: "hikePlan",
                name: "Hike Plan"
            }
        ],
        signoffs: [
            {
                id: "summary",
                name: "Facts Summary",
                description: "Summarised facts about at least three mountain accidents, their causes, the rescue action taken and possible preventative measures which could have been taken."
            },
            {
                id: "hikePlan",
                name: "Hike Plan",
                description: "Prepared a detailed hike plan proven by presentation of one such plans."
            }
        ]
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
    return Object.getOwnPropertyNames(_AWARDS)
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

function getAwardLinks(awardId) {
    return _AWARDS[awardId].links
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