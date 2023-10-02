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
                name: "First Aid",
                description: "Valid wilderness first aid and CPR (level 3)."
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
        description: "TODO",
        signoffs: [
            {
                id: "threadedFigureEight",
                name: "Knots - Threaded Figure Of Eight",
                description: "Threaded figure of eight, tied off."
            },
            {
                id: "figureEightBight",
                name: "Knots - Figure Of Eight on Bight",
                description: "Figure of eight on a bight."
            },
            {
                id: "tapeKnot",
                name: "Knots - Tape Knot",
                description: "You can tie a tape knot."
            },
            {
                id: "doubleFishermansKnot",
                name: "Knots - Double Fisherman's Knot",
                description: "You can tie a double fisherman's knot."
            },
            {
                id: "harnessTypes",
                name: "Harness - Types",
                description: "You know the purpose and use of all harness types."
            },
            {
                id: "straps",
                name: "Harness - Strap Doubling Back",
                description: "Doubling back of straps."
            },
            {
                id: "belayPoints",
                name: "Harness - Tie-in/Belay Points",
                description: "Knowledge of appropriate tie-in/belay points."
            },
            {
                id: "calls",
                name: "Calls",
                description: "You know the relevant calls (belayer, climber, slack/tight rope)."
            },
            {
                id: "ropeUsage",
                name: "Rope Usage",
                description: "Rope usage - 9mm, 11mm; static, dynamic"
            },
            {
                id: "ropeCoiling",
                name: "Rope Coiling"
            },
            {
                id: "ropeCare",
                name: "Rope Care",
                description: "Rope care (sun, sand, abrasion)"
            },
            {
                id: "belayingAtc",
                name: "Belaying - ATC"
            },
            {
                id: "belayingFigureEight",
                name: "Belaying - Figure Of Eight",
                description: "Figure of eight (11mm & 9mm ropes)"
            },
            {
                id: "grigri",
                name: "Belaying - Grigri"
            },
            {
                id: "belayingLeadClimber",
                name: "Belaying Lead Climber"
            },
            {
                id: "fall",
                name: "Falling",
                description: "Arrest and hold a fall correctly."
            },
            {
                id: "safetyChecks",
                name: "Safety Checks",
                description: "Safety checks (knot, harness, karabiner locked, helmet)."
            },
            {
                id: "spottingTechnique",
                name: "Spotting Technique",
                description: "Demonstrate the ability of spotting technique (inside or outside wall)."
            },
            {
                id: "neilSolomonClimbs",
                name: "Neil Solomon Wall Climbs",
                description: "Two climbs on Neil Solomon wall (one on each side)."
            },
            {
                id: "insideWallClimbs",
                name: "Inside Wall Climbs",
                description: "Two different climbs on the inside wall (excluding overhangs)."
            },
            {
                id: "lowTraverse",
                name: "Low Traverse",
                description: "Must be done on the external wall (record your time)."
            },
            {
                id: "chimneying",
                name: "Chimneying",
                description: "Must be done on the external wall."
            },
            {
                id: "chilmneyMantelshelf",
                name: "Chimney Mantelshelf",
                description: "Must be done on the external wall."
            },
            {
                id: "cracks",
                name: "Cracks",
                description: "Must be done on the external wall (use only concrete)."
            },
            {
                id: "layback",
                name: "Layback",
                description: "Can be done on either wall (3 metres only)."
            },
            {
                id: "overhangExternal",
                name: "Overhang - External Wall"
            },
            {
                id: "overhangInternal",
                name: "Overhang - Internal Wall",
                description: "Overhang on the internal wall (set at second notch or steeper, or roof)."
            },
            {
                id: "quickdraws",
                name: "Leading - Placing Quickdraws"
            },
            {
                id: "clipping",
                name: "Leading - Clipping"
            },
            {
                id: "chains",
                name: "Leading - Lowering Off Chains"
            },
            {
                id: "abseilingFigureEight",
                name: "Abseiling - Figure Of Eight"
            },
            {
                id: "abseilingAtc",
                name: "Abseiling - ATC"
            },
            {
                id: "stance",
                name: "Abseiling - Stance",
                description: "Position you should take when abseiling."
            },
            {
                id: "theoryTest",
                name: "Theory Test",
                description: "The test is based on <i>Reach Beyond</i>."
            },
            {
                id: "finalAbseil",
                name: "Final Test - One Abseil",
                description: "This abseil is to be done on real rock."
            },
            {
                id: "finalClimbs",
                name: "Final Test - Two Climbs",
                description: "These climbs are to be done on real rock."
            }
        ]
    },
    rockClimbingInstructor: {
        name: "Rock Climbing Instructor",
        description: "TODO",
        links: [
            {
                id: "bookReviews",
                name: "Book Reviews"
            }
        ],  
        signoffs: [
            {
                id: "bookReviews",
                name: "Book Reviews",
                description: "Two book reviews on technical climbing. Attach the link to your reviews in the info block."
            },
            {
                id: "knots",
                name: "Knots",
                description: "Demonstrate the use and ability of tying the following knots: MR8, clove hitch, Italian hitch, butterfly knot."
            },
            {
                id: "maintenance",
                name: "Maintenance & Care",
                description: "Maintenance and care of equipment."
            },
            {
                id: "belays",
                name: "Belays",
                description: "Set up at least three different belays at different locations, with anchors."
            },
            {
                id: "usage",
                name: "Correct Usage",
                description: "Demonstrate the correct and safe use of the following devices: chocks, nuts, wedges, friends and any other protection device(s)."
            },
            {
                id: "firstAid",
                name: "First Aid",
                description: "Valid wilderness first aid and CPR (level 3)."
            },
            {
                id: "rescueTechniques",
                name: "Rescue Techniques",
                description: "Solve problems by performing a lower and demonstrate the ability to get into and out of a system (using direct and indirect belay systems)."
            },
            {
                id: "logs",
                name: "Logs",
                description: "Maintenance of a clear log of climbs and instruction time."
            },
            {
                id: "attitude",
                name: "Correct Attitude",
                description: "Responsibility, ability, helpfulness."
            },
            {
                id: "grade",
                name: "Climbing Grade",
                description: "Practical climbing grade 16+ with sport climbing (minimum of 10 different climbs at two different locations)."
            },
            {
                id: "leadClimbsSport",
                name: "Lead Climbs (Sport)",
                description: "Protected lead climbs on rock placing protection (Sport) (at least 10 different climbs)"
            },
            {
                id: "leadClimbsTrad",
                name: "Lead Climbs (Trad)",
                description: "Protected lead climbs on rock placing protection (Trad) (at least 3 different climbs)"
            },
            {
                id: "lowTraverse",
                name: "Low Traverse",
                description: "Low traverse on outside wall in less 45 seconds (record time)."
            },
            {
                id: "protection",
                name: "Climbs Protection",
                description: "Practical protection of climbs and setting up of multiple belays (e.g. set up and use top-top rope systems and bottom-top rope systems with anchors)."
            },
            {
                id: "ascendRope",
                name: "Ascend Rope",
                description: "Demonstrate the ability to ascend a rope by using prussic."
            }
        ]
    },
    rockClimbingLeader: {
        name: "Rock Climbing Leader",
        description: "TODO",
        signoffs: [
            {
                id: "experience",
                name: "Experience & Attitude",
                description: "You have considerable experience in instructing and lead climbing, and show an attitude of service towards rock climbing and Outdoor Pursuits in general."
            },
            {
                id: "supervisedInstruction",
                name: "Instruction & Climbs",
                description: "At least 25 hours of <b>supervised</b> instruction and a minimum of 30 climbs must be logged."
            },
            {
                id: "routeBooks",
                name: "Route Book Descriptions",
                description: "Demonstrate the ability to read and interpret route book descriptions."
            },
            {
                id: "hoist",
                name: "Hoists",
                description: "Demonstrate an assisted and unassisted hoist."
            },
            {
                id: "jams",
                name: "Jams, Tangles & Pendulums",
                description: "Demonstrate the ability to handle jams, tangles and pendulums."
            },
            {
                id: "abseiling",
                name: "Abseiling",
                description: "Demonstrate ability to set-up a releasable abseil and supervise a group abseiling."
            }
        ]
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