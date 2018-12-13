
let cardData = {
	"Ammonia Clouds": {
		"house": "mars",
		"removal": 1.5
	},
	"Phosphorus Stars": {
		"house": "mars",
		"removal": 0.5
	},
	"Sample Collection": {
		"house": "mars",
		"removal": 1
	},
	"Soft Landing": {
		"house": "mars",
		"amber": 1
	},
	"Squawker": {
		"house": "mars",
		"amber": 1.5,
		"removal": 0.25
	},
	"Invasion Portal": {
		"house": "mars",
		"artifact": 1
	},
	"Incubation Chamber": {
		"house": "mars",
		"artifact": 1
	},
	"Mindwarper": {
		"house": "mars",
		"removal": 0.25
	},
	"Ulyq Megamouth": {
		"house": "mars",
		"removal": 0.25
	},
	"Yxili Marauder": {
		"house": "mars",
		"removal": 0.25
	},
	"Yxilo Bolter": {
		"house": "mars",
		"removal": 0.25
	},
	"Yxilx Dominator": {
		"house": "mars",
		"removal": 1
	},
	"Bait and Switch": {
		"house": "shadows",
		"house": "shadows",
		"amber": 2
	},
	"Ghostly Hand": {
		"house": "shadows",
		"amber": 2
	},
	"Miasma": {
		"house": "shadows",
		"amber": 1
	},
	"Pawn Sacrifice": {
		"house": "shadows",
		"amber": 1
	},
	"Relentless Whispers": {
		"house": "shadows",
		"amber": 1
	},
	"Seeker Needle": {
		"house": "shadows",
		"artifact": 1
	},
	"Bulleteye": {
		"house": "shadows",
		"removal": 0.5,
		"amber": 0.25
	},
	"Noddy the Thief": {
		"house": "shadows",
		"removal": 0.25
	},
	"Silvertooth": {
		"house": "shadows",
		"amber": 1,
		"removal": 0.25
	},
	"Cooperative Hunting": {
		"house": "untamed"

	},
	"Grasping Vines": {
		"house": "untamed",
		"amber": 1,
		"removal": 0.1
	},
	"Key Charge": {
		"house": "untamed",
		"key cheat": 1
	},
	"Lifeweb": {
		"house": "untamed",
		"amber": 1
	},
	"Nature's Call": {
		"house": "untamed",
		"removal": 1,
		"amber": 1
	},
	"Nocturnal Maneuver": {
		"house": "untamed",
		"amber": 1,
		"removal": 1
	},
	"Vigor": {
		"house": "untamed",
		"amber": 1
	},
	"Word of Returning": {
		"house": "untamed",
		"amber": 1
	},
	"Chota Hazri": {
		"house": "untamed",
		"key cheat": 1,
		"removal": 0.25
	},
	"Dew Faerie": {
		"house": "untamed",
		"removal": 0.25
	}
};

let getCarladonnaDeckList = () =>
[
	"Ammonia Clouds",
	"Phosphorus Stars",
	"Sample Collection",
	"Soft Landing",
	"Squawker",
	"Invasion Portal",
	"Incubation Chamber",
	"Mindwarper",
	"Ulyq Megamouth",
	"Yxili Marauder",
	"Yxilo Bolter",
	"Yxilx Dominator",

	"Bait and Switch",
	"Ghostly Hand",
	"Miasma",
	"Pawn Sacrifice",
	"Relentless Whispers",
	"Seeker Needle",
	"Seeker Needle",
	"Seeker Needle",
	"Bulleteye",
	"Noddy the Thief",
	"Silvertooth",
	"Silvertooth",

	"Cooperative Hunting",
	"Cooperative Hunting",
	"Grasping Vines",
	"Grasping Vines",
	"Key Charge",
	"Lifeweb",
	"Nature's Call",
	"Nocturnal Maneuver",
	"Vigor",
	"Word of Returning",
	"Chota Hazri",
	"Dew Faerie"
];



let invalidCardsInDeckList = (deckList) =>
	deckList.map(name=>[name, cardData[name] != undefined]).filter(pair=>!pair[1]);

let beginGameState = (deckList) => ({
	"deck": shuffle([...deckList]),
	"hand": [],
	"discard": [],
	"score": {
		"shuffles": 0,
		"turns": 0,
	}
});

let simulateGame = (state) =>
	state.score.shuffles >= 3 ? state
	: simulateGame( nextTurn(draw(useHouse(state, pickHouse(state)))) );

let beginSimulateGame = (state) =>
	invalidCardsInDeckList(state.deck).length > 0 ? ({"error": "Deck list contains invalid cards","invalidCards":invalidCardsInDeckList(state.deck)})
	: simulateGame(state);

let shuffleDiscardIntoDeck = (state) =>
	({
		...state,
		"deck": state.deck.concat(shuffle(state.discard)),
		"discard": [],
		"score": {...state.score, shuffles: state.score.shuffles+1}
	});

let drawX = (state, toDraw) => 
	state.deck.length < toDraw ? drawX(shuffleDiscardIntoDeck(state), toDraw)
	: {
		...state,
		"deck": state.deck.slice(toDraw),
		"hand": [...state.hand, ...state.deck.slice(0, toDraw)]
	};

let draw = (state) => 
	drawX(state, Math.max(0, 6 - state.hand.length));

let nextTurn = (state) =>
	({
		...state,
		"score": {...state.score, turns: state.score.turns+1}
	});

let pickHouse = (state) => 
	Object.entries(state.hand
	.map(name=>cardData[name].house)
	.reduce((acc, house) => ({...acc, [house]: acc[house] == undefined ? 1 : acc[house] + 1 }), {})
	)
	.reduce((best, house) => house[1] > best[1] ? house : best, ["none", 0])[0];

let isCardInHouse = (house) => (card) => 
	cardData[card].house == house;

let isCardNotInHouse = (house) => (card) => 
	cardData[card].house != house;

let isCardNonArtifact = (card) =>
	cardData[card].artifact != true;

let addModifierToScoreB = (score, key, value) =>
	({
		...score,
		[key]: score[key] == undefined ? value : score[key] + value
	});

let addModifierToScore = (score, mod) =>
	addModifierToScoreB(score, mod[0], mod[1]);

let getCardModifiers = (card) =>
	Object.entries(cardData[card]).filter(v => v[0] != "house" && v[0] != "artifact");

let useHouse = (state, house) =>
	({
		...state,
		"hand": state.hand.filter(isCardNotInHouse(house)),
		"discard": [...state.discard, ...shuffle(state.hand.filter(isCardInHouse(house)).filter(isCardNonArtifact))],
		"score": state.hand
					.filter(isCardInHouse(house))
					.map(getCardModifiers)
					.reduce((a,i)=>a.concat(i), [])
					.reduce(addModifierToScore, state.score)
	});



//snipped from SO
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

beginSimulateGame(beginGameState(getCarladonnaDeckList()));