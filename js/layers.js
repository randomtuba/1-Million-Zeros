addLayer("z", {
    name: "zeros", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "0", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    tooltip: "The Zeroverse",
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return !player.p.active},
    tabFormat: [
      ["display-text", () => `You have ${format(player.points)} zeros`],
      "blank",
      "buyables",
      "blank",
      "clickables",
    ],
    doReset(layer){
        let keep = [];
      if (layer == "o"){
        if (hasAchievement("g",25)) keep.push("buyables")
      }
      if (layer == "t"){
        if (hasMilestone("t",4)) keep.push("buyables")
      }
    layerDataReset("z",keep);
    },
    buyables: {
      11: {
        title: "Doubler",
        cost(x) { return getBuyableAmount("z",11).gt(8+(hasUpgrade("t",71)?3:0)) ? new Decimal(10).mul(Decimal.pow(5,x.sub(8+(hasUpgrade("t",71)?3:0)).times(x.sub(7+(hasUpgrade("t",71)?3:0))).div(inChallenge("t",12)?0.5:2).add(8+(hasUpgrade("t",71)?3:0)))) : new Decimal(10).mul(Decimal.pow(5,x)) },
        display() {return `Double zero gain per purchase.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} zeros<br>Effect: ${format(this.effect())}x zeros`},
        canAfford() {return player.points.gte(this.cost())},
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          mult = Decimal.pow(2,x.add(hasAchievement("g",17)?1:0))
          if(inChallenge("o",31) || inChallenge("o",41)) mult = new Decimal(1)
          return mult
        },
      },
      12: {
        title: "Tripler",
        cost(x) { return inChallenge("o",12) || inChallenge("o",32) || inChallenge("o",41) ? new Decimal(Infinity) : (getBuyableAmount("z",12).gt(4+(hasUpgrade("t",71)?3:0)) ? new Decimal(1000).mul(Decimal.pow(hasChallenge("o",12)?6:7,x.sub(4+(hasUpgrade("t",71)?3:0)).times(x.sub(3)).div(inChallenge("t",12)?0.5:2).add(4+(hasUpgrade("t",71)?3:0)))) : new Decimal(1000).mul(Decimal.pow(hasChallenge("o",12)?6:7,x))) },
        display() {return `Triple zero gain per purchase.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} zeros<br>Effect: ${format(this.effect())}x zeros`},
        canAfford() {return player.points.gte(this.cost())},
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          mult = Decimal.pow(3,x.add(hasAchievement("g",23)?1:0))
          return mult
        },
      },
      13: {
        title: "Quadrupler",
        cost(x) { return getBuyableAmount("z",13).gt(1+(hasUpgrade("t",71)?3:0)) ? new Decimal(100000).mul(Decimal.pow(hasAchievement("g",47)?9:10,x.sub(1+(hasUpgrade("t",71)?3:0)).times(x).div(inChallenge("t",12)?0.5:2).add(1+(hasUpgrade("t",71)?3:0)))) : new Decimal(100000).mul(Decimal.pow(hasAchievement("g",47)?9:10,x)) },
        display() {return `Quadruple zero gain per purchase.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} zeros<br>Effect: ${format(this.effect())}x zeros`},
        canAfford() {return player.points.gte(this.cost())},
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() {return hasUpgrade("o",22) || hasMilestone("t",1)},
        effect(x) {
          mult = Decimal.pow(4,x.add(hasAchievement("g",47)?3:0))
          if(inChallenge("o",31) || inChallenge("t",21)) mult = new Decimal(1)
          return mult
        },
      },
    },
    clickables: {
      11: {
        display() {return "Reset Multipliers"},
        onClick() {setBuyableAmount("z",11,new Decimal(0)); setBuyableAmount("z",12,new Decimal(0)); setBuyableAmount("z",13,new Decimal(0)); doReset("o",true)},
        canClick() {return true},
        unlocked() {return hasAchievement("g",25)}
      },
    }
})

addLayer("o", {
    name: "ones", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        prestiges: new Decimal(0),
		points: new Decimal(0),
    }},
    tabFormat: [
      "main-display",
      () => player.p.active ? "" : "prestige-button",
      ["display-text", () => `You have ${format(player.points)} zeros`],
      ["display-text", () => `You have ${formatWhole(player.o.prestiges)} One Resets`],
      "blank",
      "buyables",
      "clickables",
      "upgrades",
      "challenges",
    ],
    passiveGeneration() {
      return player.p.active
    },
    color: "#FF0000",
    requires: () => hasAchievement("g",45) ? new Decimal(100000) : new Decimal(1000000), // Can be a function that takes requirement increases into account
    resource: "ones", // Name of prestige currency
    baseResource: "zeros", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {return hasUpgrade("o",21) ? (hasUpgrade("o",24) ? 0.3 : 0.25) : 0}, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasChallenge("o",31)) mult = mult.mul(2)
        if(!inChallenge("t",22)) mult = mult.mul(buyableEffect("o",11))
        if(!inChallenge("t",22)) mult = mult.mul(buyableEffect("o",12))
        if(hasMilestone("t",0)) mult = mult.mul(2)
        if(hasUpgrade("t",42)) mult = mult.mul(3)
        if(hasUpgrade("t",12) && !inChallenge("t",21) && !player.p.active) mult = mult.mul(player.t.prodPower.cbrt().add(1).floor())
        if(!inChallenge("t",22)) mult = mult.mul(buyableEffect("o",13))
        mult = mult.mul(Decimal.pow(5,challengeCompletions("t",21)))
        if(hasUpgrade("t",72)) mult.mul(upgradeEffect("t",72))
        if(hasUpgrade("p",13)) mult = mult.mul(upgradeEffect("p",13))
        if(hasUpgrade("p",14)) mult = mult.mul(upgradeEffect("p",14))
        if(hasUpgrade("p",22)) mult = mult.mul(upgradeEffect("o",12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if(inChallenge("t",31)) exp = exp.div(3)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "o", description: "O: Reset for ones", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gte(1e6) || player.o.total.gte(1) || player.t.total.gte(1)},
    onPrestige(){
      player.o.prestiges = player.o.prestiges.add(1)
    },
    branches: ["z"],
    update(diff) {
      if(!hasUpgrade("o",21)) player.points = player.points.min(inChallenge("o",11)?2e6:1e6)
      player.points = player.points.min(1e66)
      if(player.p.active) player.points = new Decimal(1e66)
    },
    doReset(layer){
      if (layer == "o")return
        let keep = [];
      if (layer == "t"){
        if (hasMilestone("t",1)) keep.push("challenges")
        if (hasMilestone("t",2)) keep.push("upgrades")
        if (hasMilestone("t",3)) keep.push("buyables")
      }
      if (layer == "p"){
        if (hasMilestone("t",1)) keep.push("challenges")
        if (hasMilestone("t",2)) keep.push("upgrades")
        if (hasMilestone("t",3)) keep.push("buyables")
      }
    layerDataReset("o",keep);
    },
    upgrades: {
      11: {
        title: "One Upgrade 1",
        description: "Gain 3x more zeros.",
        cost: new Decimal(1),
      },
      12: {
        title: "One Upgrade 2",
        description: "Gain more zeros based on achievements completed.",
        cost: new Decimal(1),
        effect() {return player.p.active && !hasUpgrade("p",22) ? new Decimal(1) : new Decimal(player.g.achievements.length).div(5).add(1).floor()},
        effectDisplay() {return format(this.effect()) + "x"},
      },
      13: {
        title: "One Upgrade 3",
        description: "Gain 2x more zeros.",
        cost: new Decimal(2),
      },
      14: {
        title: "One Upgrade 4",
        description: "Unlock Challenges.",
        cost: new Decimal(3),
      },
      15: {
        title: "One Upgrade 5",
        description: "Gain more zeros based on ones. [hardcaps at 10x]",
        cost: new Decimal(4),
        effect() { 
          if(hasUpgrade("t",21) && !player.p.active) {
            return new Decimal(player.o.points).sqrt().add(1).div(10).pow(0.5).mul(10).floor()
          } else {
            return new Decimal(player.o.points).sqrt().add(1).floor().min(10)
          }
        },
        effectDisplay() {return format(this.effect()) + "x"},
      },
      21: {
        title: "One Upgrade 6",
        description: "Break the limit (you can go beyond 1,000,000 zeros).",
        cost: new Decimal(10),
        unlocked(){return hasChallenge("o",22)},
      },
      22: {
        title: "One Upgrade 7",
        description: "Unlock Quadruplers.",
        cost: new Decimal(50),
        unlocked(){return hasChallenge("o",22)},
      },
      23: {
        title: "One Upgrade 8",
        description: "Divide One Multiplier costs by 1,000.",
        cost: new Decimal(1e37),
        unlocked(){return hasUpgrade("p",15)},
      },
      24: {
        title: "One Upgrade 9",
        description: "Change the ones gain exponent from ^0.25 to ^0.275.",
        cost: new Decimal(1e48),
        unlocked(){return hasUpgrade("p",15)},
      },
    },
    buyables: {
      11: {
        title: "One Doubler",
        cost(x) { return getBuyableAmount("o",11).gt(2) ? new Decimal(1000).mul(Decimal.pow(10,x.sub(2).times(x.sub(1)).div(2).add(2))).div(hasUpgrade("o",23)?1000:1) : new Decimal(1000).mul(Decimal.pow(10,x)).div(hasUpgrade("o",23)?1000:1) },
        display() {return `Double one gain per purchase.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} ones<br>Effect: ${format(this.effect())}x ones`},
        canAfford() {return player.o.points.gte(this.cost())},
        buy() {
            player.o.points = player.o.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasChallenge("o",41)},
        effect(x) {
          mult = Decimal.pow(Decimal.add(2,hasUpgrade("t",61)?0.5:0),x)
          return mult
        },
      },
      12: {
        title: "One Tripler",
        cost(x) { return getBuyableAmount("o",12).gt(1) ? new Decimal(10000).mul(Decimal.pow(100,x.sub(1).times(x).div(2).add(1))).div(hasUpgrade("o",23)?1000:1) : new Decimal(10000).mul(Decimal.pow(100,x)).div(hasUpgrade("o",23)?1000:1) },
        display() {return `Triple one gain per purchase.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} ones<br>Effect: ${format(this.effect())}x ones`},
        canAfford() {return player.o.points.gte(this.cost())},
        buy() {
            player.o.points = player.o.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasChallenge("o",41)},
        effect(x) {
          mult = Decimal.pow(3,x)
          return mult
        },
      },
      13: {
        title: "One Quadrupler",
        cost(x) { return getBuyableAmount("o",13).gt(1) ? new Decimal(100000).mul(Decimal.pow(1000,x.sub(1).times(x).div(2).add(1))).div(hasUpgrade("o",23)?1000:1) : new Decimal(100000).mul(Decimal.pow(1000,x)).div(hasUpgrade("o",23)?1000:1) },
        display() {return `Triple one gain per purchase.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} ones<br>Effect: ${format(this.effect())}x ones`},
        canAfford() {return player.o.points.gte(this.cost())},
        buy() {
            player.o.points = player.o.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasUpgrade("t",14)},
        effect(x) {
          mult = Decimal.pow(4,x)
          return mult
        },
      },
    },
    clickables: {
      11: {
        display() {return "Reset Multipliers"},
        onClick() {setBuyableAmount("o",11,new Decimal(0)); setBuyableAmount("o",12,new Decimal(0)); setBuyableAmount("o",13,new Decimal(0)); doReset("t",true)},
        canClick() {return true},
        unlocked() {return hasChallenge("o",41)}
      },
    },
    challenges: {
      11: {
        name: "Goal++",
        challengeDescription: "The goal is 2,000,000 zeros.",
        goalDescription: "Reach 2,000,000 zeros.",
        rewardDescription: () => `Gain +1x more zeros for every challenge completed.<br>Currently: ${format(new Decimal(player.o.challenges[11]+player.o.challenges[12]+player.o.challenges[21]+player.o.challenges[22]+player.o.challenges[31]+player.o.challenges[32]+player.o.challenges[41]+1))}x`,
        canComplete: function() {return player.points.gte("2e6")},
        unlocked(){return hasUpgrade("o",14) || hasMilestone("t",1)}
      },
      12: {
        name: "No more inflation",
        challengeDescription: "Triplers cannot be bought.",
        goalDescription: "Reach 1,000,000 zeros.",
        rewardDescription: () => `Tripler scaling is 6x.`,
        canComplete: function() {return player.points.gte("1e6")},
        unlocked(){return hasUpgrade("o",14) || hasMilestone("t",1)},
        onEnter(){return setBuyableAmount("z", 12, new Decimal(0))}
      },
      21: {
        name: "Reverse Multiplier",
        challengeDescription: "Zeros gain is divided by 100.",
        goalDescription: "Reach 1,000,000 zeros.",
        rewardDescription: () => `Gain 4x more zeros.`,
        canComplete: function() {return player.points.gte("1e6")},
        unlocked(){return hasUpgrade("o",14) || hasMilestone("t",1)},
      },
      22: {
        name: "Time Dilation",
        challengeDescription: "Zeros gain is divided by 10.",
        goalDescription: "Reach 1,000,000 zeros.",
        rewardDescription: () => `Unlock 2 new One Upgrades.`,
        canComplete: function() {return player.points.gte("1e6")},
        unlocked(){return hasUpgrade("o",14) || hasMilestone("t",1)},
      },
      31: {
        name: "0/10 no upgrades",
        challengeDescription: "One Upgrades 1-3, doublers, and quadruplers are disabled.",
        goalDescription: "Reach 1,000,000 zeros.",
        rewardDescription: () => `Gain 2x more ones.`,
        canComplete: function() {return player.points.gte("1e6")},
        unlocked(){return hasUpgrade("o",14) || hasMilestone("t",1)},
      },
      32: {
        name: "Double Trouble",
        challengeDescription: "C2 and C3 are combined.",
        goalDescription: "Reach 1e9 zeros.",
        rewardDescription: () => `Gain 1.5x more zeros.`,
        canComplete: function() {return player.points.gte("1e9")},
        unlocked(){return hasUpgrade("o",14) || hasMilestone("t",1)},
        onEnter(){return setBuyableAmount("z", 12, new Decimal(0))}
      },
      41: {
        name: "The Final Stockade",
        challengeDescription: "Challenges 4, 5, and 6 are combined. Quadruplers are enabled.",
        goalDescription: "Reach 1,000,000 zeros.",
        rewardDescription: () => `Unlock One Multipliers.`,
        canComplete: function() {return player.points.gte("1e6")},
        unlocked(){return hasChallenge("o",32) || hasMilestone("t",1)},
        onEnter(){return setBuyableAmount("z", 12, new Decimal(0))}
      },
    }
})

addLayer("t", {
    name: "twos", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        prestiges: new Decimal(0),
        prodPower: new Decimal(0),
        branchers: new Decimal(0),
        totalb: new Decimal(0),
        paraPower: new Decimal(0),
        pshifts: new Decimal(0),
		points: new Decimal(0),
    }},
    passiveGeneration() {
      return hasUpgrade("p",25)
    },
    tabFormat: {
      "Main": {
        content: [
        "main-display", 
        () => hasUpgrade("p",25) ? "" : "prestige-button",
        ["display-text", () => `You have ${format(player.o.points)} ones<br>You have ${formatWhole(player.t.prestiges)} Two Resets`],
        "blank",
        "milestones",
        () => hasMilestone("t",5) ? ["upgrades",[1,2]] : "blank",
        ],
      },
      "Producers": {
        content: [
        ["display-text", () => `You have <h2 style="color: #9803FC; text-shadow: 0px 0px 10px #9803FC">${format(player.t.prodPower)}</h2> producer power, multiplying zero gain by ${format(player.t.prodPower.div(4).add(1))}x${hasUpgrade("t",12) ? " and multiplying one gain by " + format(player.t.prodPower.cbrt().add(1).floor()) + "x" : ""}${hasUpgrade("t",63) ? " and multiplying PP gain by " + format(player.t.prodPower.root(4).div(3).add(1).floor()) + "x" : ""}.<br>By default, producers produce every time you Two Reset.<br><br>`],
        ["buyables",[1]],
        ],
        unlocked() {return !player.p.active}
      },
      "Upgrade Tree": {
        content: [
        ["display-text", () => `You have <h2 style="color: #00FF00; text-shadow: 0px 0px 10px #00FF00">${formatWhole(player.t.branchers)}</h2> tree branchers<br>(${formatWhole(player.t.totalb)} total)`],
        ["buyables",[2]],
        "blank",
        ["upgrade-tree",[[31],[41,42,43,44],[51,52],[61,62,63],[71,72],[81]]],
        ],
      },
      "Super Challenges": {
        content: [
        ["display-text", () => `You have completed ${challengeCompletions("t",11)+challengeCompletions("t",12)+challengeCompletions("t",21)+challengeCompletions("t",22)+challengeCompletions("t",31)}/15 Super Challenge tiers.<br>Super Challenges can be unlocked on the Upgrade Tree and can be completed up to 3 times.<br>For every completion, the challenge's goal and reward amplify.`],
        "blank",
        "challenges",
        ],
        unlocked() {return hasUpgrade("t",41) || hasUpgrade("t",44) || hasUpgrade("t",52) || hasChallenge("t",11)}
      },
    },
    color: "#0000FF",
    requires: new Decimal(1000000), // Can be a function that takes requirement increases into account
    resource: "twos", // Name of prestige currency
    baseResource: "ones", // Name of resource prestige is based on
    baseAmount() {return player.o.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("t",43)) mult = mult.mul(2)
        if(hasAchievement("g",43) && player.t.resetTime < 25) mult = mult.mul(2)
        if(hasUpgrade("t",11)) mult = mult.mul(2)
        if(hasUpgrade("t",62)) mult = mult.mul(upgradeEffect("t",62))
        if(hasUpgrade("p",12)) mult = mult.mul(upgradeEffect("p",12))
        mult = mult.mul(Decimal.pow(3,challengeCompletions("t",31)))
        if(hasUpgrade("p",24)) mult = mult.mul(3)
        if(hasUpgrade("p",25)) mult = mult.mul(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for twos", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasChallenge("o",41) || player.t.total.gte(1)},
    onPrestige(){
      player.t.prestiges = player.t.prestiges.add(1)
      player.t.prodPower = player.t.prodPower.add(buyableEffect("t",11))
      player.t.prodPower = player.t.prodPower.add(buyableEffect("t",12))
      player.t.prodPower = player.t.prodPower.add(buyableEffect("t",13))
    },
    branches: ["o"],
    upgrades: {
      11: {
        title: "Two Upgrade 1",
        description: "Double two gain.",
        cost: new Decimal(10),
      },
      12: {
        title: "Two Upgrade 2",
        description: "Producer Power boosts ones.",
        cost: new Decimal(22),
      },
      13: {
        title: "Two Upgrade 3",
        description: "Gain more Producer Power based on total tree branchers.",
        cost: new Decimal(100),
        effect() {return player.t.totalb.div(3).add(1).floor()},
        effectDisplay() {return format(this.effect()) + "x"},
      },
      14: {
        title: "Two Upgrade 4",
        description: "Unlock One Quadruplers.",
        cost: new Decimal(2000),
      },
      21: {
        title: "Two Upgrade 5",
        description: "One Upgrade 5's effect is uncapped.",
        cost: new Decimal(4444),
      },
      22: {
        title: "Two Upgrade 6",
        description: "Producers passively generate PP alongside producing every Two Reset.",
        cost: new Decimal(16000),
      },
      23: {
        title: "Two Upgrade 7",
        description: "Gain 1.33x more zeros.",
        cost: new Decimal(22222),
      },
      24: {
        title: "Two Upgrade 8",
        description: "Super Challenges cost no tree branchers to unlock.",
        cost: new Decimal(888888),
      },
      31: {
        title: "11",
        description: "Producer 1 produces 2x more PP.",
        cost: new Decimal(1),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
      },
      41: {
        description: "Unlock Super Challenge 1.",
        cost(){return hasUpgrade("t",24) ? new Decimal(0) : new Decimal(5)},
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [42],
        canAfford() {return hasUpgrade("t",42)},
      },
      42: {
        title: "21",
        description: "Gain 3x more ones.",
        cost: new Decimal(3),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [31],
        canAfford() {return hasUpgrade("t",31)},
      },
      43: {
        title: "22",
        description: "Gain 2x more twos.",
        cost: new Decimal(3),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [31],
        canAfford() {return hasUpgrade("t",31)},
      },
      44: {
        description: "Unlock Super Challenge 2.",
        cost(){return hasUpgrade("t",24) ? new Decimal(0) : new Decimal(5)},
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [43],
        canAfford() {return hasUpgrade("t",43)},
      },
      51: {
        title: "31",
        description: "Gain more zeros based on unspent twos.",
        cost: new Decimal(5),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [42,43],
        canAfford() {return hasUpgrade("t",42) || hasUpgrade("t",43)},
        effect() {return player.t.points.sqrt().add(1).floor()},
        effectDisplay() {return format(this.effect()) + "x"},
      },
      52: {
        description: "Unlock Super Challenge 3.",
        cost(){return hasUpgrade("t",24) ? new Decimal(0) : new Decimal(5)},
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [51],
        canAfford() {return hasUpgrade("t",51)},
      },
      61: {
        title: "41",
        description: "Increase One Doubler multiplier.<br>(2x -> 2.5x)",
        cost: new Decimal(7),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [51],
        canAfford() {return hasUpgrade("t",51)},
      },
      62: {
        title: "42",
        description: "Gain more twos based on your total tree branchers.",
        cost: new Decimal(8),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [51],
        canAfford() {return hasUpgrade("t",51)},
        effect() {return player.t.totalb.sqrt().add(1).floor()},
        effectDisplay() {return format(this.effect()) + "x"},
      },
      63: {
        title: "43",
        description: "Unlock a new Producer Power boost.",
        cost: new Decimal(7),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [51],
        canAfford() {return hasUpgrade("t",51)},
      },
      71: {
        title: "51",
        description: "Multiplier cost superscaling starts 2 purchases later.",
        cost: new Decimal(6),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [61,62],
        canAfford() {return hasUpgrade("t",61) || hasUpgrade("t",62)},
      },
      72: {
        title: "52",
        description: "Gain more ones based on ones.",
        cost: new Decimal(6),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [62,63],
        canAfford() {return hasUpgrade("t",62) || hasUpgrade("t",63)},
        effect() {return player.o.points.add(1).log10().add(1).floor()},
        effectDisplay() {return format(this.effect()) + "x"},
      },
      81: {
        title: "61",
        description: "Unlock the Paradigm Machine. (9 completed SC tiers required)",
        cost: new Decimal(3),
        currencyDisplayName: "tree branchers",
        currencyInternalName: "branchers",
        currencyLayer: "t",
        branches: [71,72],
        canAfford() {return (hasUpgrade("t",71) || hasUpgrade("t",72)) && challengeCompletions("t",11) >= 3 && challengeCompletions("t",12) >= 3 && challengeCompletions("t",21) >= 3},
      },
    },
    buyables: {
      11: {
        title: "Producer 1",
        cost(x) { return Decimal.pow(1.5,x).floor() },
        display() {return `By default, each Producer 1 produces 1 PP every Two Reset.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} twos<br>Effect: +${format(this.effect())} PP/reset`},
        canAfford() {return player.t.points.gte(this.cost())},
        buy() {
            player.t.points = player.t.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          mult = x
          if(hasUpgrade("t",31)) mult = mult.mul(2)
          if(hasUpgrade("t",13)) mult = mult.mul(upgradeEffect("t",13))
          if(hasUpgrade("t",63) && !inChallenge("t",21)) mult = mult.mul(player.t.prodPower.root(4).div(3).add(1).floor())
          return mult
        },
      },
      12: {
        title: "Producer 2",
        cost(x) { return Decimal.pow(2.25,x).mul(20).floor() },
        display() {return `By default, each Producer 2 produces 20 PP every Two Reset.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} twos<br>Effect: +${format(this.effect())} PP/reset`},
        canAfford() {return player.t.points.gte(this.cost())},
        buy() {
            player.t.points = player.t.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          mult = x.mul(10)
          if(hasUpgrade("t",13)) mult = mult.mul(upgradeEffect("t",13))
          if(hasUpgrade("t",63) && !inChallenge("t",21)) mult = mult.mul(player.t.prodPower.root(4).div(3).add(1).floor())
          return mult
        },
      },
      13: {
        title: "Producer 3",
        cost(x) { return Decimal.pow(3.375,x).mul(4000).floor() },
        display() {return `By default, each Producer 3 produces 500 PP every Two Reset.<br>Amount: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} twos<br>Effect: +${format(this.effect())} PP/reset`},
        canAfford() {return player.t.points.gte(this.cost())},
        buy() {
            player.t.points = player.t.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          mult = x.mul(500)
          if(hasUpgrade("t",13)) mult = mult.mul(upgradeEffect("t",13))
          if(hasUpgrade("t",63) && !inChallenge("t",21)) mult = mult.mul(player.t.prodPower.root(4).div(3).add(1).floor())
          return mult
        },
      },
      21: {
        cost(x) { return Decimal.pow(100,x).mul(1e6).floor() },
        display() {return `Gain +1 tree brancher<br>Cost: ${format(this.cost())} ones`},
        canAfford() {return player.o.points.gte(this.cost())},
        buy() {
            player.o.points = player.o.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            player.t.branchers = player.t.branchers.add(1)
            player.t.totalb = player.t.totalb.add(1)
        },
        style() {
          const style = {"width": "100px", "height": "100px"}
          if (this.canAfford()) style["background-color"] = "#00FF00"
          return style
        }
      },
      22: {
        cost(x) { return Decimal.pow(3,x).mul(3).floor() },
        display() {return `Gain +1 tree brancher<br>Cost: ${format(this.cost())} twos`},
        canAfford() {return player.t.points.gte(this.cost())},
        buy() {
            player.t.points = player.t.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            player.t.branchers = player.t.branchers.add(1)
            player.t.totalb = player.t.totalb.add(1)
        },
        style() {
          const style = {"width": "100px", "height": "100px"}
          if (this.canAfford()) style["background-color"] = "#00FF00"
          return style
        }
      },
      23: {
        cost(x) { return new Decimal(0) },
        display() {return `Respec and Two Reset`},
        canAfford() {return true},
        buy() {
            if(confirm("Are you sure you want to respec? This will cause a Two Reset!")){
              doReset("t",true)
              player.t.branchers = player.t.totalb
              let result = player.t.upgrades.filter(id => id < 31)
              player.t.upgrades = result
            }
        },
        style() {
          const style = {"width": "100px", "height": "100px"}
          if (this.canAfford()) style["background-color"] = "#00FF00"
          return style
        },
      },
    },
    challenges: {
      11: {
        name: "I forgot to nerf that",
        challengeDescription: "Zeros per second is square rooted.",
        goalDescription: function() {return `Reach ${format(tmp.t.challenges[this.id].goal)} ones.`},
        rewardDescription: function() {return `Exponentiate zeros based on completions.<br>Currently: ^${format(1+(challengeCompletions(this.layer,this.id)/20))}<br>Completions: ${challengeCompletions(this.layer,this.id)}/3`},
        completionLimit: 3,
        canComplete: function() {return player.o.points.gte(tmp.t.challenges[this.id].goal)},
        unlocked(){return hasUpgrade("t",41) || challengeCompletions(this.layer,this.id) >= 1},
        goal() {
          return [
            new Decimal(5e8),
            new Decimal(6e14),
            new Decimal(7e20),
            new Decimal(Infinity)
          ][challengeCompletions(this.layer, this.id)]
        },
      },
      12: {
        name: "Atomic Scaled",
        challengeDescription: "Multiplier cost superscaling is significantly faster.",
        goalDescription: function() {return `Reach ${format(tmp.t.challenges[this.id].goal)} ones.`},
        rewardDescription: function() {return `Gain 200x more zeros per completion.<br>Currently: ${format(Decimal.pow(200,challengeCompletions(this.layer,this.id)))}x<br>Completions: ${challengeCompletions(this.layer,this.id)}/3`},
        completionLimit: 3,
        canComplete: function() {return player.o.points.gte(tmp.t.challenges[this.id].goal)},
        unlocked(){return hasUpgrade("t",44) || challengeCompletions(this.layer,this.id) >= 1},
        onEnter(){setBuyableAmount("z", 11, new Decimal(0)); setBuyableAmount("z", 12, new Decimal(0)); setBuyableAmount("z", 13, new Decimal(0));},
        goal() {
          return [
            new Decimal(4e15),
            new Decimal(3e21),
            new Decimal(2e28),
            new Decimal(Infinity)
          ][challengeCompletions(this.layer, this.id)]
        },
      },
      21: {
        name: "Production Destruction",
        challengeDescription: "Producer Power and Quadruplers do nothing.",
        goalDescription: function() {return `Reach ${format(tmp.t.challenges[this.id].goal)} ones.`},
        rewardDescription: function() {return `Gain 5x more ones per completion.<br>Currently: ${format(Decimal.pow(5,challengeCompletions(this.layer,this.id)))}x<br>Completions: ${challengeCompletions(this.layer,this.id)}/3`},
        completionLimit: 3,
        canComplete: function() {return player.o.points.gte(tmp.t.challenges[this.id].goal)},
        unlocked(){return hasUpgrade("t",52) || challengeCompletions(this.layer,this.id) >= 1},
        goal() {
          return [
            new Decimal(2e13),
            new Decimal(4e18),
            new Decimal(8e21),
            new Decimal(Infinity)
          ][challengeCompletions(this.layer, this.id)]
        },
      },
      22: {
        name: "No Multipliers?",
        challengeDescription: "One Multipliers do nothing.",
        goalDescription: function() {return `Reach ${format(tmp.t.challenges[this.id].goal)} ones.`},
        rewardDescription: function() {return `Gain 2x more paradigm power per completion.<br>Currently: ${format(Decimal.pow(2,challengeCompletions(this.layer,this.id)))}x<br>Completions: ${challengeCompletions("t",this.id)}/3`},
        completionLimit: 3,
        canComplete: function() {return player.o.points.gte(tmp.t.challenges[this.id].goal)},
        unlocked(){return hasUpgrade("p",21)},
        goal() {
          return [
            new Decimal(5e29),
            new Decimal(2e34),
            new Decimal(1e41),
            new Decimal(Infinity)
          ][challengeCompletions(this.layer, this.id)]
        },
      },
      31: {
        name: "The Truly Final Stockade",
        challengeDescription: "OPM is cube rooted.",
        goalDescription: function() {return `Reach ${format(tmp.t.challenges[this.id].goal)} ones.`},
        rewardDescription: function() {return `Gain 3x more twos per completion.<br>Currently: ${format(Decimal.pow(3,challengeCompletions(this.layer,this.id)))}x<br>Completions: ${challengeCompletions("t",this.id)}/3`},
        completionLimit: 3,
        canComplete: function() {return player.o.points.gte(tmp.t.challenges[this.id].goal)},
        unlocked(){return hasUpgrade("p",23)},
        goal() {
          return [
            new Decimal(1e16),
            new Decimal(2e18),
            new Decimal(1e20),
            new Decimal(Infinity)
          ][challengeCompletions(this.layer, this.id)]
        },
      },
    },
    milestones: {
      0: {
        requirementDescription: "1 Two Reset",
        effectDescription: "Gain 2x more ones.",
        done() { return player.t.prestiges.gte(1) }
      },
      1: {
        requirementDescription: "2 Two Resets",
        effectDescription: "Start with Quadruplers unlocked and all Challenges completed.",
        done() { return player.t.prestiges.gte(2) }
      },
      2: {
        requirementDescription: "3 Two Resets",
        effectDescription: "Keep One Upgrades on reset.",
        done() { return player.t.prestiges.gte(3) }
      },
      3: {
        requirementDescription: "4 Two Resets",
        effectDescription: "Keep One Multipliers on reset.",
        done() { return player.t.prestiges.gte(4) }
      },
      4: {
        requirementDescription: "5 Two Resets",
        effectDescription: "Keep Multipliers on reset.",
        done() { return player.t.prestiges.gte(5) }
      },
      5: {
        requirementDescription: "10 Two Resets",
        effectDescription: "Unlock Two Upgrades.",
        done() { return player.t.prestiges.gte(10) }
      },
    },
    update(diff) {
      if (inChallenge("t",11) && !hasUpgrade("t",41)) doReset("t",true)
      if (inChallenge("t",12) && !hasUpgrade("t",44)) doReset("t",true)
      if (inChallenge("t",21) && !hasUpgrade("t",52)) doReset("t",true)
      if (hasUpgrade("t",22)) {
        player.t.prodPower = player.t.prodPower.add(buyableEffect("t",11).mul(diff))
        player.t.prodPower = player.t.prodPower.add(buyableEffect("t",12).mul(diff))
        player.t.prodPower = player.t.prodPower.add(buyableEffect("t",13).mul(diff))
      }
    },
})

addLayer("p", {
    name: "paradigm machine", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        active: false,
        prestiges: new Decimal(0),
		points: new Decimal(0),
    }},
    passiveGeneration() {
      return hasUpgrade("p",25)
    },
    tabFormat: [
      () => player.p.active ? "main-display" : "",
      () => player.p.active && !hasUpgrade("p",25) ? "prestige-button" : "",
      () => player.p.active ? ["display-text", `You have ${format(player.o.points)} ones<br>You have ${formatWhole(player.p.prestiges)} Paradigm Resets`] : "",
      () => !player.p.active ? ["display-text", `You now must decide if you want to activate the Paradigm Machine.<br><br>
      <span style="color:lime;"><h1>
        PROS:</h1><br>
        - Unlock a new mechanic!<br>
        - Unlock a new currency<br>
        - You now passively generate ones (you are simulated to have 1e66 zeros)
      </span><br><br>
      <span style="color:red;"><h1>
        CONS:</h1><br>
        - Remove Producers and Producer Power<br>
        - Remove zeros and multipliers<br>
        - Remove the achievement bonus<br>
        - Hardcap One Upgrade 5 (again)<br>
        - Remove Herobrine<br>
        - Remove gwa<br>
        - Remove Breaking Bad<br>
        - Postpone Geometry Dash 2.2 indefinitely<br>
        <span style="font-size:30px;">oh, and you die lol</span>
      </span>`] : "",
      "blank",
      () => !player.p.active ? ["display-text", "<button onclick='player.p.active = true'>Activate</button>"] : "",
      () => player.p.active ? "blank" : "",
      () => player.p.active ? "buyables" : "",
      () => player.p.active ? "upgrades" : "",
    ],
    color: "#097000",
    requires: new Decimal(1e27), // Can be a function that takes requirement increases into account
    resource: "paradigm power", // Name of prestige currency
    baseResource: "ones", // Name of resource prestige is based on
    baseAmount() {return player.o.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {return 0.33}, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("p",11)) mult = mult.mul(2)
        mult = mult.mul(Decimal.pow(2,challengeCompletions("t",22)))
        if(hasAchievement("g",55)) mult = mult.mul(player.t.totalb.sqrt())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for paradigm power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("t",81) || player.p.total.gte(1)},
    onPrestige() {
        player.p.prestiges = player.p.prestiges.add(1)
    },
    branches: ["o","t"],
    upgrades: {
      11: {
        title: "Paradigm Upgrade 1",
        description: "Double paradigm power gain.",
        cost: new Decimal(20),
      },
      12: {
        title: "Paradigm Upgrade 2",
        description: "Paradigm power boosts two gain.",
        cost: new Decimal(50),
        effect() {return player.p.points.add(1).log2().add(1).floor()},
        effectDisplay() {return format(this.effect()) + "x"},
      },
      13: {
        title: "Paradigm Upgrade 3",
        description: "Gain more ones based on twos.",
        cost: new Decimal(100),
        effect() {return player.t.points.pow(0.3).add(1).floor()},
        effectDisplay() {return format(this.effect()) + "x"},
      },
      14: {
        title: "Paradigm Upgrade 4",
        description: "Paradigm power boosts one gain.",
        cost: new Decimal(300),
        unlocked() {return getBuyableAmount("p",11).gte(1)},
        effect() {return player.p.points.pow(1.25).add(1)},
        effectDisplay() {return format(this.effect()) + "x"},
      },
      15: {
        title: "Paradigm Upgrade 5",
        description: "Unlock 2 new One Upgrades.",
        cost: new Decimal(2000),
        unlocked() {return getBuyableAmount("p",11).gte(1)},
      },
      21: {
        title: "Paradigm Upgrade 6",
        description: "Unlock Super Challenge 4.",
        cost: new Decimal(100000),
        unlocked() {return getBuyableAmount("p",11).gte(2)},
      },
      22: {
        title: "Paradigm Upgrade 7",
        description: "Bring back the achievement bonus (it boosts ones gain now).",
        cost: new Decimal(5e7),
        unlocked() {return getBuyableAmount("p",11).gte(2)},
      },
      23: {
        title: "Paradigm Upgrade 8",
        description: "Unlock Super Challenge 5.",
        cost: new Decimal(5e8),
        unlocked() {return getBuyableAmount("p",11).gte(3)},
      },
      24: {
        title: "Paradigm Upgrade 9",
        description: "Gain 5x more twos.",
        cost: new Decimal(3e11),
        unlocked() {return getBuyableAmount("p",11).gte(4)},
      },
      25: {
        title: "Paradigm Upgrade 10",
        description: "Good luck lmao",
        cost: new Decimal(2e13),
        unlocked() {return getBuyableAmount("p",11).gte(4)},
      },
    },
    buyables: {
      11: {
        title: "Paradigm Shift",
        cost(x) {let arr = [new Decimal(250),new Decimal(200000),new Decimal(3e8),new Decimal(6e11),new Decimal(Infinity)]; return arr[x]},
        display() {return `Unlock new Paradigm Upgrades.<br>Paradigm Shifts: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} paradigm power`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
          player.p.points = player.p.points.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
      },
    },
})