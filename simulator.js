const SUITS = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const PAYTABLES = {
  Standard: [1, 4, 10, 50],
  Aggressive: [2, 8, 40, 200],
  Reckless: [4, 20, 100, 200],
};

const STATIC_PAYOUTS = {
  bustSuit: 5,
  bustRank: 8,
  cardCount: 6,
  firstSuit: 3,
  exactCard: 25,
};

const BET_TYPES = {
  NUMBER: 'number',
  CARD_COUNT: 'cardCount',
  FIRST_SUIT: 'firstSuit',
  BUST_SUIT: 'bustSuit',
  BUST_RANK: 'bustRank',
  EXACT_CARD: 'exactCard',
};

const SPOTS = [
  // Number bets row (A-10)
  { id: 'num-A', label: 'A', type: BET_TYPES.NUMBER, rank: 'A', pos: { top: '43%', left: '18%' } },
  { id: 'num-2', label: '2', type: BET_TYPES.NUMBER, rank: '2', pos: { top: '43%', left: '26%' } },
  { id: 'num-3', label: '3', type: BET_TYPES.NUMBER, rank: '3', pos: { top: '43%', left: '34.5%' } },
  { id: 'num-4', label: '4', type: BET_TYPES.NUMBER, rank: '4', pos: { top: '43%', left: '43%' } },
  { id: 'num-5', label: '5', type: BET_TYPES.NUMBER, rank: '5', pos: { top: '43%', left: '51.5%' } },
  { id: 'num-6', label: '6', type: BET_TYPES.NUMBER, rank: '6', pos: { top: '43%', left: '60%' } },
  { id: 'num-7', label: '7', type: BET_TYPES.NUMBER, rank: '7', pos: { top: '43%', left: '68.5%' } },
  { id: 'num-8', label: '8', type: BET_TYPES.NUMBER, rank: '8', pos: { top: '43%', left: '77%' } },
  { id: 'num-9', label: '9', type: BET_TYPES.NUMBER, rank: '9', pos: { top: '43%', left: '85.5%' } },
  { id: 'num-10', label: '10', type: BET_TYPES.NUMBER, rank: '10', pos: { top: '43%', left: '94%' } },

  // Bust ranks
  { id: 'bust-J', label: 'J', type: BET_TYPES.BUST_RANK, rank: 'J', pos: { top: '55%', left: '87%' } },
  { id: 'bust-Q', label: 'Q', type: BET_TYPES.BUST_RANK, rank: 'Q', pos: { top: '60%', left: '87%' } },
  { id: 'bust-K', label: 'K', type: BET_TYPES.BUST_RANK, rank: 'K', pos: { top: '65%', left: '87%' } },
  { id: 'bust-Joker', label: 'JK', type: BET_TYPES.BUST_RANK, rank: 'Joker', pos: { top: '70%', left: '87%' } },

  // Bust suits
  { id: 'bust-spade', label: '♠', type: BET_TYPES.BUST_SUIT, suit: 'Spades', pos: { top: '55%', left: '93%' } },
  { id: 'bust-heart', label: '♥', type: BET_TYPES.BUST_SUIT, suit: 'Hearts', pos: { top: '60%', left: '93%' } },
  { id: 'bust-club', label: '♣', type: BET_TYPES.BUST_SUIT, suit: 'Clubs', pos: { top: '65%', left: '93%' } },
  { id: 'bust-diamond', label: '♦', type: BET_TYPES.BUST_SUIT, suit: 'Diamonds', pos: { top: '70%', left: '93%' } },
];

let state = {
  deck: [],
  hand: [],
  bustCard: null,
  status: 'ready',
  bets: [],
  firstCard: null,
  totalPayout: 0,
  currentChip: 5,
  paytable: 'Standard',
  resultNote: '',
};

const betLayer = document.getElementById('betLayer');
const cardTrack = document.getElementById('cardTrack');
const bustSlot = document.getElementById('bustSlot');
const deckCount = document.getElementById('deckCount');
const stateLabel = document.getElementById('stateLabel');
const payoutLabel = document.getElementById('payout');

function buildDeck() {
  const deck = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({ rank, suit });
    });
  });
  deck.push({ rank: 'Joker', suit: null });
  return deck;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isBust(card) {
  return ['J', 'Q', 'K', 'Joker'].includes(card.rank);
}

function formatCard(card) {
  if (card.rank === 'Joker') return 'Joker';
  const symbols = { Spades: '♠', Hearts: '♥', Clubs: '♣', Diamonds: '♦' };
  return `${card.rank}${symbols[card.suit]}`;
}

function resetHand() {
  state = {
    ...state,
    deck: shuffle(buildDeck()),
    hand: [],
    bustCard: null,
    status: 'ready',
    bets: [],
    firstCard: null,
    totalPayout: 0,
    resultNote: '',
  };
  renderAll();
}

function findBet(match) {
  return state.bets.find((bet) =>
    Object.entries(match).every(([key, val]) => bet[key] === val)
  );
}

function addChipToSpot(spot) {
  const locked = state.status !== 'ready' && ![BET_TYPES.BUST_RANK, BET_TYPES.BUST_SUIT].includes(spot.type);
  if (locked) return;

  const payload = { type: spot.type, wager: state.currentChip };
  if (spot.rank) payload.rank = spot.rank;
  if (spot.suit) payload.suit = spot.suit;
  if (spot.bucket) payload.bucket = spot.bucket;
  if (spot.type === BET_TYPES.NUMBER) payload.paytable = state.paytable;

  const existing = findBet(payload);
  if (existing) {
    existing.wager += state.currentChip;
  } else {
    state.bets.push(payload);
  }
  renderSpots();
}

function addBetFromButton(id) {
  if (id.startsWith('count-')) {
    const bucket = id.replace('count-', '');
    addChipToSpot({ type: BET_TYPES.CARD_COUNT, bucket, pos: {} });
  } else if (id.startsWith('first-')) {
    const suit = id.replace('first-', '');
    addChipToSpot({ type: BET_TYPES.FIRST_SUIT, suit, pos: {} });
  }
}

function dealOne() {
  if (state.deck.length === 0 || state.status === 'finished') return;
  const card = state.deck.shift();
  if (!state.firstCard) state.firstCard = card;
  state.hand.push(card);

  if (isBust(card)) {
    state.bustCard = card;
    state.status = 'finished';
    settleBets();
  } else {
    state.status = 'dealing';
  }

  renderAll();
}

function dealToBust() {
  while (state.status !== 'finished' && state.deck.length > 0) {
    dealOne();
  }
}

function settleBets() {
  const outcomes = state.bets.map((bet) => ({ ...bet, payout: resolveBet(bet) }));
  state.totalPayout = outcomes.reduce((sum, bet) => sum + bet.payout, 0);
  renderPayout(outcomes);
}

function resolveBet(bet) {
  switch (bet.type) {
    case BET_TYPES.NUMBER:
      return resolveNumberBet(bet);
    case BET_TYPES.CARD_COUNT:
      return resolveCardCountBet(bet);
    case BET_TYPES.FIRST_SUIT:
      return resolveFirstSuitBet(bet);
    case BET_TYPES.BUST_SUIT:
      return resolveBustSuitBet(bet);
    case BET_TYPES.BUST_RANK:
      return resolveBustRankBet(bet);
    case BET_TYPES.EXACT_CARD:
      return resolveExactCardBet(bet);
    default:
      return 0;
  }
}

function resolveNumberBet(bet) {
  const paytable = PAYTABLES[bet.paytable] || PAYTABLES.Standard;
  const count = state.hand.filter((card) => card.rank === bet.rank && !isBust(card)).length;
  if (count === 0) return 0;
  const index = Math.min(count, paytable.length) - 1;
  return paytable[index] * bet.wager;
}

function resolveCardCountBet(bet) {
  const bucket = bet.bucket === '8+' ? '8+' : Number(bet.bucket);
  const handCount = state.hand.length;
  const matches = bucket === '8+' ? handCount >= 8 : handCount === bucket;
  return matches ? STATIC_PAYOUTS.cardCount * bet.wager : 0;
}

function resolveFirstSuitBet(bet) {
  if (!state.firstCard || state.firstCard.rank === 'Joker') return 0;
  return state.firstCard.suit === bet.suit ? STATIC_PAYOUTS.firstSuit * bet.wager : 0;
}

function resolveBustSuitBet(bet) {
  if (!state.bustCard || state.bustCard.rank === 'Joker') return 0;
  return state.bustCard.suit === bet.suit ? STATIC_PAYOUTS.bustSuit * bet.wager : 0;
}

function resolveBustRankBet(bet) {
  if (!state.bustCard) return 0;
  return state.bustCard.rank === bet.rank ? STATIC_PAYOUTS.bustRank * bet.wager : 0;
}

function resolveExactCardBet(bet) {
  const found = state.hand.some((card) => card.rank === bet.rank && card.suit === bet.suit);
  return found ? STATIC_PAYOUTS.exactCard * bet.wager : 0;
}

function renderCardTrack() {
  cardTrack.innerHTML = '';
  const totalSlots = 12;
  for (let i = 0; i < totalSlots; i += 1) {
    const slot = document.createElement('div');
    slot.className = 'card-slot';
    if (state.hand[i]) {
      const card = state.hand[i];
      slot.textContent = formatCard(card);
      if (isBust(card)) slot.style.borderColor = '#ff6b6b';
    }
    cardTrack.appendChild(slot);
  }
}

function renderBust() {
  bustSlot.textContent = state.bustCard ? formatCard(state.bustCard) : 'Bust';
}

function renderSpots() {
  betLayer.innerHTML = '';
  SPOTS.forEach((spot) => {
    const btn = document.createElement('button');
    btn.className = 'bet-spot';
    btn.style.top = spot.pos.top;
    btn.style.left = spot.pos.left;
    btn.textContent = spot.label;
    btn.dataset.id = spot.id;

    const wager = state.bets
      .filter((bet) =>
        bet.type === spot.type
        && bet.rank === spot.rank
        && bet.suit === spot.suit
        && bet.bucket === spot.bucket
      )
      .reduce((sum, bet) => sum + bet.wager, 0);

    if (wager > 0) {
      const badge = document.createElement('span');
      badge.className = 'amount';
      badge.textContent = wager;
      btn.appendChild(badge);
    }

    btn.addEventListener('click', () => addChipToSpot(spot));
    betLayer.appendChild(btn);
  });
}

function renderPayout(outcomes = []) {
  payoutLabel.textContent = state.totalPayout;
  if (outcomes.length === 0) {
    state.resultNote = '';
    return;
  }
  const winning = outcomes.filter((o) => o.payout > 0);
  state.resultNote = winning.length === 0 ? '' : winning.map((w) => `${describe(w)} +${w.payout}`).join(' / ');
}

function describe(bet) {
  switch (bet.type) {
    case BET_TYPES.NUMBER:
      return `${bet.rank} (${bet.paytable})`;
    case BET_TYPES.CARD_COUNT:
      return `${bet.bucket} cards`;
    case BET_TYPES.FIRST_SUIT:
      return `First ${bet.suit}`;
    case BET_TYPES.BUST_RANK:
      return `Bust ${bet.rank}`;
    case BET_TYPES.BUST_SUIT:
      return `Bust ${bet.suit}`;
    default:
      return 'Bet';
  }
}

function renderState() {
  deckCount.textContent = state.deck.length;
  if (state.status === 'finished') {
    stateLabel.textContent = state.resultNote ? `Hand complete • ${state.resultNote}` : 'Hand complete';
  } else if (state.status === 'dealing') {
    stateLabel.textContent = 'Hand in progress';
  } else {
    stateLabel.textContent = 'Ready for bets';
  }
}

function renderAll() {
  renderCardTrack();
  renderBust();
  renderSpots();
  renderState();
  payoutLabel.textContent = state.totalPayout;
}

function handleChipClick(event) {
  const btn = event.currentTarget;
  state.currentChip = Number(btn.dataset.chip);
  document.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('active'));
  btn.classList.add('active');
}

function handlePaytableChange(event) {
  state.paytable = event.target.value;
}

function clearBets() {
  state.bets = [];
  state.totalPayout = 0;
  renderAll();
}

function attachHandlers() {
  document.querySelectorAll('.chip').forEach((chip) => chip.addEventListener('click', handleChipClick));
  document.querySelectorAll('input[name="paytable"]').forEach((input) => input.addEventListener('change', handlePaytableChange));
  document.getElementById('dealOne').addEventListener('click', dealOne);
  document.getElementById('dealToBust').addEventListener('click', dealToBust);
  document.getElementById('resetHand').addEventListener('click', resetHand);
  document.getElementById('clearBets').addEventListener('click', clearBets);
  document.querySelectorAll('.rail button').forEach((btn) => btn.addEventListener('click', (e) => addBetFromButton(e.currentTarget.dataset.spot || e.currentTarget.getAttribute('data-spot'))));
  document.querySelectorAll('.suit-row button').forEach((btn) => btn.addEventListener('click', (e) => addBetFromButton(e.currentTarget.dataset.spot)));
}

resetHand();
renderCardTrack();
renderSpots();
attachHandlers();
