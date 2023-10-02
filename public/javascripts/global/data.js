/*
    If description is excluded then uses description from first-level award.
*/

const MOUNTAINEERING_DESCRIPTION = "Spend time hiking in mountainous areas and natural places. There are five hiking awards that you learner can achieve."
const MOUNTAINEERING_AUTHORISED_STAFF = ["Mr Brown", "Mr Townsend"]

const _AWARDS = {
    drakensberg: {
        name: "Drakensberg",
        description: MOUNTAINEERING_DESCRIPTION,
        authorisedStaff: MOUNTAINEERING_AUTHORISED_STAFF,
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
                description: "You have first aid training or your familiarity with endurance problems and their treatment satisfies the MIC."
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
        description: "Travel down rivers on kayaks and other boats and develop skills which let you face technical waters.",
        authorisedStaff: ["Mr Brown"],
        signoffs: [
            {
                id: "timeTrials",
                name: "Time Trials",
                description: "See requirements."
            },
            {
                id: "slalomCircuits",
                name: "Slalom Circuits",
                description: "Five sessions of six (30) figure of 8 slalom circuits (kayak). Log these in the Flat Water Paddling Logs."
            },
            {
                id: "noviceKayakingTest",
                name: "Novice Kayaking Test",
                description: "Pass the practical Novice Kayaking Test (see requirements)."
            },
            {
                id: "checks",
                name: "Safety & Equipment Checks",
                description: "Perform safety and equipment checks."
            },
            {
                id: "riverStretch",
                name: "River Stretch",
                description: "Do one stretch of a river in a kayak over at least 10km. This section is to be determined by the MIC."
            },
            {
                id: "theoryTest",
                name: "Theory Test",
                description: "Pass the oral or written theory test based on the <i>Kayaking Canoeing</i> chapter in <i>Reach Beyond</i> (e.g. parts of the boat and paddle as well as other terms, river trip preparation and safety)."
            },
            {
                id: "safetyTest",
                name: "River Safety Test",
                description: "Pass the basic river safety test which includes water proficiency (swim a minimum of 50m with floatation device) and using a throw line."
            }
        ]
    },
    kayakingInstructor: {
        name: "Kayaking Instructor",
        signoffs: [
            {
                id: "riverStretches",
                name: "River Stretches",
                description: "Completed a minimum of six stretches of rivers of 3km or more (medium to high water levels)."
            },
            {
                id: "instructing",
                name: "Instructing",
                description: "Have shown practical ability to instruct under supervision."
            },
            {
                id: "attitude",
                name: "Correct Attitude",
                description: "Have shown correct attitude."
            },
            {
                id: "skill",
                name: "Skill",
                description: "Have developed a high degree of skill."
            },
            {
                id: "book",
                name: "Kayaking Book",
                description: "Have read at least one book on kayaking/canoeing and be able to show a breadth of knowledge to the MIC in conversation as well as in your instruction of others."
            },
            {
                id: "equipmentMonitor",
                name: "Equipment Monitor",
                description: "Spend time acting as a duty equipment monitor in and around the boat shed."
            },
            {
                id: "rescue",
                name: "Rescue Ability",
                description: "Have demonstrated practical ability to rescue someone in the river - X-rescue, H-rescue & self-rescue."
            },
            {
                id: "firstAid",
                name: "First Aid",
                description: "Valid wilderness first aid and CPR training (level 3)."
            }
        ]
    },
    kayakingLeader: {
        name: "Kayaking Leader"
    },
    midmarMile: {
        name: "Midmar Mile",
        description: "Take part in the Midmar Mile after training to make your times faster and faster.",
        authorisedStaff: ["Mr Ndhlovu"]
    },
    midmarMileInstructor: {
        name: "Midmar Mile Instructor"
    },
    midmarMileLeader: {
        name: "Midmar Mile Leader"
    },
    mountaineeringInstructor: {
        name: "Mountaineering Instructor",
        description: MOUNTAINEERING_DESCRIPTION,
        authorisedStaff: MOUNTAINEERING_AUTHORISED_STAFF,
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
                description: "Valid wilderness first aid and CPR training (level 3)."
            },
            {
                id: "leading",
                name: "Leading Ability",
                description: "Proven practical ability to lead a Berg trip with understanding of planning, route finding, advanced map reading as well as the ability to handle poeple."
            },
            {
                id: "rescues",
                name: "Rescue Procedures",
                description: "You are knowledgeable of rescue procedures (add links to summaries of previous rescues in the info block)."
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
        description: MOUNTAINEERING_DESCRIPTION,
        authorisedStaff: MOUNTAINEERING_AUTHORISED_STAFF,
    },
    polarBear: {
        name: "Polar Bear",
        description: "Created by Mr Neil Solomon and based on similar awards around the world, the Polar Bear challenge is a daring one which involves jumping into the school dam in the early morning once a week.",
        authorisedStaff: ["Mr Townsend"]
    },
    polarBearInstructor: {
        name: "Polar Bear Instructor"
    },
    polarBearLeader: {
        name: "Polar Bear Leader"
    },
    rockClimbing: {
        name: "Rock Climbing",
        description: "Learn to use various devices and techniques to climb rock faces.",
        authorisedStaff: ["Mr Brown"],
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
                description: "Two book reviews on technical climbing. Add the link to your reviews in the info block."
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
                description: "Valid wilderness first aid and CPR training (level 3)."
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
        links: [
            {
                id: "motivation",
                name: "Motivation"
            }
        ],
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
        description: "Spend time on the trails and accumulate 100km of distance to earn this award. Log your runs to increase your total distance."
    },
    service: {
        name: "Service",
        description: "Give time and energy through serving others and build an awareness of others' needs.",
        authorisedStaff: ["Mr Nowlan"],
    },
    serviceInstructor: {
        name: "Service Instructor"
    },
    serviceLeader: {
        name: "Service Leader"
    },
    solitaire: {
        name: "Solitaire",
        description: "Learn to be alone in God's beautiful creation while making construcive use of your time.",
        authorisedStaff: ["Ms Oosthuizen"]
    },
    solitaireInstructor: {
        name: "Solitaire Instructor"
    },
    solitaireLeader: {
        name: "Solitaire Leader"
    },
    summit: {
        name: "Summit",
        description: MOUNTAINEERING_DESCRIPTION,
        authorisedStaff: MOUNTAINEERING_AUTHORISED_STAFF,
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
        description: MOUNTAINEERING_DESCRIPTION,
        authorisedStaff: MOUNTAINEERING_AUTHORISED_STAFF,
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
        description: "Develop the skills needed to think up, plan and lead a trip of adventure.",
        signoffs: [
            {
                id: "proposalApproved",
                name: "Venture Award Proposal Approved"
            }
        ]
    },
    ventureLeader: {
        name: "Venture Leader"
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
    const { description } = _AWARDS[awardId]
    if (description) return description

    const baseAward = getFirstLevelAward(awardId)
    return getAwardDescription(baseAward)
}

function getAwardAuthorisedStaff(awardId) {
    const { authorisedStaff } = _AWARDS[awardId]
    if (authorisedStaff) return authorisedStaff

    const baseAward = getFirstLevelAward(awardId)
    return (baseAward === awardId) ? null : getAwardAuthorisedStaff(baseAward)
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

function getFirstLevelAward(awardId) {
    return awardId.replace("Instructor", "").replace("Leader", "")
}

function awardHasInstructor(awardId) {
    return _AWARDS[awardId + "Instructor"] != null
}

function awardHasLeader(awardId) {
    return _AWARDS[awardId + "Leader"] != null
}