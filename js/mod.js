let modInfo = {
	name: "1 Million Zeros",
	id: "1mzatest",
	author: "randomtuba",
	pointsName: "zeros",
	modFiles: ["layers.js", "tree.js", "achievements.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "1MZ TMT Test",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
  gain = gain.mul(buyableEffect("z",11))
  gain = gain.mul(buyableEffect("z",12))
  gain = gain.mul(buyableEffect("z",13))
  if(hasUpgrade("o",11) && !inChallenge("o",31) && !inChallenge("o",41)) gain = gain.mul(3)
  if(hasUpgrade("o",12) && !inChallenge("o",31) && !inChallenge("o",41)) gain = gain.mul(upgradeEffect("o",12))
  if(hasUpgrade("o",13) && !inChallenge("o",31) && !inChallenge("o",41)) gain = gain.mul(2)
  if(hasUpgrade("o",15)) gain = gain.mul(upgradeEffect("o",15))
  if(hasChallenge("o",11)) gain = gain.mul(player.o.challenges[11]+player.o.challenges[12]+player.o.challenges[21]+player.o.challenges[22]+player.o.challenges[31]+player.o.challenges[32]+player.o.challenges[41]+1)
  if(inChallenge("o",21) || inChallenge("o",32)) gain = gain.div(100)
  if(inChallenge("o",22) || inChallenge("o",41)) gain = gain.div(10)
  if(hasAchievement("g",31)) gain = gain.mul(6)
  if(hasChallenge("o",32)) gain = gain.mul(1.5)
  if(!inChallenge("t",21)) gain = gain.mul(player.t.prodPower.div(4).add(1))
  if(hasUpgrade("t",51)) gain = gain.mul(upgradeEffect("t",51))
  gain = gain.mul(Decimal.pow(200,challengeCompletions("t",12)))
  if(hasUpgrade("t",23)) gain = gain.mul(1.33)
  if(inChallenge("t",11)) gain = gain.pow(0.5)
  if(hasChallenge("t",11)) gain = gain.pow(1+(challengeCompletions("t",11)/20))
  if(player.points.gte(inChallenge("o",11)?2e6:1e6) && !hasUpgrade("o",21)) gain = new Decimal(0)
  if(player.points.gte(1e66)) gain = new Decimal(0)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
  () => player.points.gte(inChallenge("o",11)?2e6:1e6) && !hasUpgrade("o",21) ? '<span style="color:red">The Zeroverse has collapsed due to excess zeros.</span>' : '',
  () => player.points.gte(1e66) ? '<span style="color:red">The Zero Multiverse has collapsed due to excess zeros.</span>' : '',
  () => hasUpgrade("p",25) ? '<span style="color:blue">Is this even counting anymore?</span>' : '',
]

// Determines when the game "ends"
function isEndgame() {
	return player.t.points.gte(1e18)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}