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

const PAYTABLE_SPOTS = [
  { id: 'Standard', label: 'Standard 1×/4×/10×/50×', pos: { top: '34%', left: '7%', width: '11%', height: '7%' } },
  { id: 'Aggressive', label: 'Aggressive 2×/8×/40×/200×', pos: { top: '42%', left: '7%', width: '11%', height: '7%' } },
  { id: 'Reckless', label: 'Reckless 4×/20×/100×/200×', pos: { top: '50%', left: '7%', width: '11%', height: '7%' } },
];

const NUMBER_SPOTS = RANKS.slice(0, 10).map((rank, index) => ({
  id: `num-${rank}`,
  label: `Number ${rank}`,
  type: BET_TYPES.NUMBER,
  rank,
  pos: { top: '26%', left: `${21 + index * 7.35}%`, width: '6.6%', height: '12%' },
}));

const SPOTS = [
  ...NUMBER_SPOTS,

  // First card suit (bottom left cluster)
  { id: 'first-Spades', label: 'First card Spades', type: BET_TYPES.FIRST_SUIT, suit: 'Spades', pos: { top: '60%', left: '12%', width: '6.3%', height: '10%' }, shape: 'circle' },
  { id: 'first-Hearts', label: 'First card Hearts', type: BET_TYPES.FIRST_SUIT, suit: 'Hearts', pos: { top: '60%', left: '19%', width: '6.3%', height: '10%' }, shape: 'circle' },
  { id: 'first-Clubs', label: 'First card Clubs', type: BET_TYPES.FIRST_SUIT, suit: 'Clubs', pos: { top: '60%', left: '26%', width: '6.3%', height: '10%' }, shape: 'circle' },
  { id: 'first-Diamonds', label: 'First card Diamonds', type: BET_TYPES.FIRST_SUIT, suit: 'Diamonds', pos: { top: '60%', left: '33%', width: '6.3%', height: '10%' }, shape: 'circle' },

  // Card count rail along the bottom
  { id: 'count-1', label: '1 card', type: BET_TYPES.CARD_COUNT, bucket: '1', pos: { top: '73%', left: '26%', width: '7.5%', height: '13%' } },
  { id: 'count-2', label: '2 cards', type: BET_TYPES.CARD_COUNT, bucket: '2', pos: { top: '73%', left: '33.7%', width: '7.5%', height: '13%' } },
  { id: 'count-3', label: '3 cards', type: BET_TYPES.CARD_COUNT, bucket: '3', pos: { top: '73%', left: '41.4%', width: '7.5%', height: '13%' } },
  { id: 'count-4', label: '4 cards', type: BET_TYPES.CARD_COUNT, bucket: '4', pos: { top: '73%', left: '49.1%', width: '7.5%', height: '13%' } },
  { id: 'count-5', label: '5 cards', type: BET_TYPES.CARD_COUNT, bucket: '5', pos: { top: '73%', left: '56.8%', width: '7.5%', height: '13%' } },
  { id: 'count-6', label: '6 cards', type: BET_TYPES.CARD_COUNT, bucket: '6', pos: { top: '73%', left: '64.5%', width: '7.5%', height: '13%' } },
  { id: 'count-7', label: '7 cards', type: BET_TYPES.CARD_COUNT, bucket: '7', pos: { top: '73%', left: '72.2%', width: '7.5%', height: '13%' } },
  { id: 'count-8+', label: '8+ cards', type: BET_TYPES.CARD_COUNT, bucket: '8+', pos: { top: '73%', left: '79.9%', width: '7.5%', height: '13%' } },

  // Bust ranks (right column)
  { id: 'bust-J', label: 'Bust Jack', type: BET_TYPES.BUST_RANK, rank: 'J', pos: { top: '45%', left: '82.3%', width: '7.5%', height: '7%' }, shape: 'circle' },
  { id: 'bust-Q', label: 'Bust Queen', type: BET_TYPES.BUST_RANK, rank: 'Q', pos: { top: '53%', left: '82.3%', width: '7.5%', height: '7%' }, shape: 'circle' },
  { id: 'bust-K', label: 'Bust King', type: BET_TYPES.BUST_RANK, rank: 'K', pos: { top: '61%', left: '82.3%', width: '7.5%', height: '7%' }, shape: 'circle' },
  { id: 'bust-Joker', label: 'Bust Joker', type: BET_TYPES.BUST_RANK, rank: 'Joker', pos: { top: '69%', left: '82.3%', width: '7.5%', height: '7%' }, shape: 'circle' },

  // Bust suits (to the right of bust ranks)
  { id: 'bust-Spades', label: 'Bust Spades', type: BET_TYPES.BUST_SUIT, suit: 'Spades', pos: { top: '45%', left: '90.4%', width: '6%', height: '7%' }, shape: 'circle' },
  { id: 'bust-Hearts', label: 'Bust Hearts', type: BET_TYPES.BUST_SUIT, suit: 'Hearts', pos: { top: '53%', left: '90.4%', width: '6%', height: '7%' }, shape: 'circle' },
  { id: 'bust-Clubs', label: 'Bust Clubs', type: BET_TYPES.BUST_SUIT, suit: 'Clubs', pos: { top: '61%', left: '90.4%', width: '6%', height: '7%' }, shape: 'circle' },
  { id: 'bust-Diamonds', label: 'Bust Diamonds', type: BET_TYPES.BUST_SUIT, suit: 'Diamonds', pos: { top: '69%', left: '90.4%', width: '6%', height: '7%' }, shape: 'circle' },
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
const paytableLayer = document.getElementById('paytableLayer');
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
  const totalSlots = 10;
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
    btn.className = `hotspot ${spot.shape === 'circle' ? 'circle' : ''}`;
    btn.style.top = spot.pos.top;
    btn.style.left = spot.pos.left;
    if (spot.pos.width) btn.style.width = spot.pos.width;
    if (spot.pos.height) btn.style.height = spot.pos.height;
    btn.setAttribute('aria-label', spot.label);
    btn.setAttribute('data-label', spot.label);
    btn.title = spot.label;
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
      btn.classList.add('active');
      const badge = document.createElement('span');
      badge.className = 'amount';
      badge.textContent = wager;
      btn.appendChild(badge);
    }

    btn.addEventListener('click', () => addChipToSpot(spot));
    betLayer.appendChild(btn);
  });
}

function renderPaytables() {
  paytableLayer.innerHTML = '';
  PAYTABLE_SPOTS.forEach((spot) => {
    const wrapper = document.createElement('button');
    wrapper.className = 'hotspot paytable-hotspot';
    wrapper.style.top = spot.pos.top;
    wrapper.style.left = spot.pos.left;
    wrapper.style.width = spot.pos.width;
    wrapper.style.height = spot.pos.height;
    wrapper.setAttribute('aria-label', spot.label);
    wrapper.setAttribute('data-label', spot.label);
    wrapper.title = spot.label;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'paytable';
    input.value = spot.id;
    input.checked = state.paytable === spot.id;
    input.addEventListener('click', (e) => e.stopPropagation());

    const text = document.createElement('span');
    text.textContent = spot.label;

    wrapper.appendChild(input);
    wrapper.appendChild(text);
    if (state.paytable === spot.id) wrapper.classList.add('active');
    wrapper.addEventListener('click', () => setPaytable(spot.id));
    paytableLayer.appendChild(wrapper);
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
  renderPaytables();
  renderState();
  payoutLabel.textContent = state.totalPayout;
}

function handleChipClick(event) {
  const btn = event.currentTarget;
  state.currentChip = Number(btn.dataset.chip);
  document.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('active'));
  btn.classList.add('active');
}

function setPaytable(value) {
  state.paytable = value;
  renderPaytables();
}

function clearBets() {
  state.bets = [];
  state.totalPayout = 0;
  renderAll();
}

function attachHandlers() {
  document.querySelectorAll('.chip').forEach((chip) => chip.addEventListener('click', handleChipClick));
  document.getElementById('dealOne').addEventListener('click', dealOne);
  document.getElementById('dealToBust').addEventListener('click', dealToBust);
  document.getElementById('resetHand').addEventListener('click', resetHand);
  document.getElementById('clearBets').addEventListener('click', clearBets);
}

resetHand();
attachHandlers();
