addLayer("g", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    color: "#FFAA00",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    tooltip:"Achievements",
    resource: "goals", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
tabFormat: [
    ["display-text", () => `You have ${player.g.achievements.length}/35 achievements (${format(new Decimal(player.g.achievements.length).div(35).mul(100))}%)<br>`],
    "achievements"
],
    layerShown(){return true},
  achievements: {
    11: {
        name: "Starting out",
      done(){return getBuyableAmount("z",11).gte(1)},
      tooltip:"Buy a doubler."
    }, 
    12: {
        name: "Triple trouble",
      done(){return getBuyableAmount("z",12).gte(1)},
      tooltip:"Buy a tripler."
    }, 
    13: {
        name: "Coming in pairs",
      done(){return getBuyableAmount("z",11).gte(5)},
      tooltip:"Own 5 doublers."
    }, 
    14: {
        name: "Powers of three",
      done(){return getBuyableAmount("z",12).gte(4)},
      tooltip:"Own 4 triplers."
    }, 
    15: {
        name: "Zeroverload",
      done(){return player.o.points.gte(1)},
      tooltip:"One Reset."
    }, 
    16: {
        name: "Careful!",
      done(){return player.points.gte(5e5)},
      tooltip:"Reach 500,000 zeros."
    }, 
    17: {
        name: "Alive chat",
      done(){return player.timePlayed >= 1000},
      tooltip:"Play for 1,000 seconds. (Reward: Free doubler)"
    }, 
    21: {
        name: "Suboptimal",
      done(){return getBuyableAmount("z",11).gte(8)},
      tooltip:"Buy the 8th doubler."
    }, 
    22: {
        name: "Can't hold all these resets",
      done(){return player.o.prestiges.gte(10)},
      tooltip:"One Reset 10 times."
    }, 
    23: {
        name: "I prefer division",
      done(){return player.points.gte(1e6) && getBuyableAmount("z",11).eq(0)},
      tooltip:"Reach 1,000,000 zeros with no doublers. (Reward: Free tripler)"
    }, 
    24: {
        name: "Dead chat",
      done(){return player.o.resetTime >= 120 && getBuyableAmount("z",11).eq(0) && getBuyableAmount("z",12).eq(0)},
      tooltip:"Be 2 minutes into a run without buying anything."
    }, 
    25: {
        name: "Sweaty Speedrunner",
      done(){return player.points.gte(1e6) && player.o.resetTime <= 30},
      tooltip:"Reach 1,000,000 zeros in 30 seconds or less. (Reward: Keep Multipliers on One Reset)"
    }, 
    26: {
        name: "Scientist",
      done(){return player.o.upgrades.length >= 5},
      tooltip:"Purchase 5 One Upgrades."
    }, 
    27: {
        name: "The completionist",
      done(){return hasChallenge("o",11) && hasChallenge("o",12)},
      tooltip:"Complete 2 challenges."
    }, 
    31: {
        name: "Antichallenged",
      done(){return hasChallenge("o",41)},
      tooltip:"Complete all 7 challenges. (Reward: Gain 6x more zeros)"
    }, 
    32: {
        name: "2-in-1 doubler special",
      done(){return getBuyableAmount("z",13).gte(1)},
      tooltip:"Buy a quadrupler."
    }, 
    33: {
        name: "Break infinity",
      done(){return hasUpgrade("o",21)},
      tooltip:"Break the limit of 1,000,000 zeros."
    }, 
    34: {
        name: "Speed of light",
      done(){return player.points.gte(1e6) && player.o.resetTime < 1},
      tooltip:"Reach 1,000,000 zeros in under a second."
    }, 
    35: {
        name: "My name is Multiplier",
      done(){return getBuyableAmount("o",11).gte(1) && getBuyableAmount("o",12).gte(1)},
      tooltip:"Own one of each One Multiplier."
    }, 
    36: {
        name: "One for each Multiplier",
      done(){return player.timePlayed >= 10800},
      tooltip:"Play for 3 hours."
    }, 
    37: {
        name: "Two the new prestige layer!",
      done(){return player.t.points.gte(1)},
      tooltip:"Two Reset."
    }, 
    41: {
        name: "Meeting ToS",
      done(){return player.t.prestiges.gte(10)},
      tooltip:"Have all of the milestones."
    }, 
    42: {
        name: "This achievement doesn't exist",
      done(){return player.points.gte(2.98e17)},
      tooltip:"Reach 2.98e17 zeros."
    }, 
    43: {
        name: "Is this a reset?",
      done(){return player.o.points.gte(1e6) && player.t.resetTime <= 5},
      tooltip:"Reach 1,000,000 ones in 5 seconds or less. (Reward: Double two gain if the current run is less than 25 seconds long)"
    }, 
    44: {
        name: "Mass producer",
      done(){return player.t.prodPower.gte(10000)},
      tooltip:"Produce 10,000 Producer Power."
    }, 
    45: {
        name: "Sluggish milestone",
      done(){return player.o.points.gte(1e6) && player.o.prestiges.lte(5)},
      tooltip:"Reach 1,000,000 ones in 5 One Resets or less. (Reward: Lower the One Reset requirement to 100,000 zeros)"
    }, 
    46: {
        name: "Hyper Challenged",
      done(){return hasChallenge("t",11)},
      tooltip:"Complete a Super Challenge tier."
    }, 
    47: {
        name: "Agoraphobia",
      done(){return player.o.points.gte(2e9) && getBuyableAmount("z",11).eq(0) && getBuyableAmount("z",12).eq(0) && getBuyableAmount("z",13).eq(0) && getBuyableAmount("o",11).eq(0) && getBuyableAmount("o",12).eq(0) && getBuyableAmount("o",13).eq(0)},
      tooltip:"Reach 2e9 ones with no Multipliers and One Multipliers. (Reward: 3 free quadruplers and quadrupler scaling is 9x)"
    }, 
    51: {
        name: "Two is the new One",
      done(){return player.o.points.gte(1e6) && player.t.resetTime < 1},
      tooltip:"Reach 1,000,000 ones in under a second."
    }, 
    52: {
        name: "Absolute Onefinity",
      done(){return player.o.points.gte(1.11e18)},
      tooltip:"Reach 1.11e18 ones."
    }, 
    53: {
        name: "Anti-antichallenged",
      done(){return challengeCompletions("t",11)+challengeCompletions("t",12)+challengeCompletions("t",21)+challengeCompletions("t",22)+challengeCompletions("t",31) >= 15},
      tooltip:"Complete all of the Super Challenges."
    }, 
    54: {
        name: "Three Resets when?",
      done(){return player.t.points.gte(1e6)},
      tooltip:"Reach 1,000,000 twos."
    }, 
    55: {
        name: "I already got rid of you",
      done(){return player.o.points.gte(1e40) && !hasUpgrade("t",31)},
      tooltip:"Reach 1e40 ones with no tree upgrades. (Reward: Multiply PaP gain based on total tree branchers)"
    }, 
    56: {
        name: "Game changer",
      done(){return player.p.active},
      tooltip:"Activate the Paradigm Machine."
    }, 
    57: {
        name: "The end",
      done(){return player.t.points.gte(1e18)},
      tooltip:"Reach 1e18 twos."
    }, 
},
})