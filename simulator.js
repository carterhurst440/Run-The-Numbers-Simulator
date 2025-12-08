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

let state = {
  deck: [],
  hand: [],
  bustCard: null,
  status: 'ready',
  bets: [],
  firstCard: null,
  totalPayout: 0,
};

const betBody = document.getElementById('betsBody');
const handGrid = document.getElementById('handGrid');
const resultsGrid = document.getElementById('results');
const deckCount = document.getElementById('deckCount');
const bustCardLabel = document.getElementById('bustCard');
const firstCardLabel = document.getElementById('firstCard');
const stateLabel = document.getElementById('stateLabel');
const totalPayoutLabel = document.getElementById('totalPayout');
const betCount = document.getElementById('betCount');

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
    deck: shuffle(buildDeck()),
    hand: [],
    bustCard: null,
    status: 'ready',
    bets: [],
    firstCard: null,
    totalPayout: 0,
  };
  refreshUI();
}

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `bet-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addBet(bet) {
  state.bets.push({ id: uid(), ...bet });
  refreshUI();
}

function removeBet(id) {
  state.bets = state.bets.filter((bet) => bet.id !== id);
  refreshUI();
}

function validateTiming(type) {
  if (state.status === 'ready') return true;
  // Bets after first card is dealt
  if ([BET_TYPES.EXACT_CARD, BET_TYPES.BUST_RANK, BET_TYPES.BUST_SUIT].includes(type)) return true;
  return false;
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

  refreshUI();
}

function dealToBust() {
  while (state.status !== 'finished' && state.deck.length > 0) {
    dealOne();
  }
}

function settleBets() {
  const outcomes = state.bets.map((bet) => {
    const payout = resolveBet(bet);
    return { ...bet, payout };
  });
  const total = outcomes.reduce((sum, bet) => sum + bet.payout, 0);
  state.totalPayout = total;
  renderResults(outcomes);
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

function renderHand() {
  handGrid.innerHTML = '';
  state.hand.forEach((card, index) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<strong>${formatCard(card)}</strong><div class="meta">Card ${index + 1}${isBust(card) ? ' • Bust' : ''}</div>`;
    handGrid.appendChild(div);
  });
}

function renderBets() {
  betBody.innerHTML = '';
  state.bets.forEach((bet) => {
    const tr = document.createElement('tr');
    const detail = describeBet(bet);
    tr.innerHTML = `
      <td>${describeType(bet.type)}</td>
      <td>${detail.pick}</td>
      <td>${bet.wager}</td>
      <td>${detail.meta} <button class="secondary" data-remove="${bet.id}">Remove</button></td>
    `;
    betBody.appendChild(tr);
  });

  betBody.querySelectorAll('button[data-remove]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-remove');
      removeBet(id);
    });
  });
}

function describeType(type) {
  switch (type) {
    case BET_TYPES.NUMBER:
      return 'Number';
    case BET_TYPES.CARD_COUNT:
      return 'Card count';
    case BET_TYPES.FIRST_SUIT:
      return 'First suit';
    case BET_TYPES.BUST_SUIT:
      return 'Bust suit';
    case BET_TYPES.BUST_RANK:
      return 'Bust rank';
    case BET_TYPES.EXACT_CARD:
      return 'Exact card';
    default:
      return type;
  }
}

function describeBet(bet) {
  switch (bet.type) {
    case BET_TYPES.NUMBER:
      return { pick: bet.rank, meta: `${bet.paytable} paytable` };
    case BET_TYPES.CARD_COUNT:
      return { pick: bet.bucket, meta: `${STATIC_PAYOUTS.cardCount}× payout` };
    case BET_TYPES.FIRST_SUIT:
      return { pick: bet.suit, meta: `${STATIC_PAYOUTS.firstSuit}× payout` };
    case BET_TYPES.BUST_SUIT:
      return { pick: bet.suit, meta: `${STATIC_PAYOUTS.bustSuit}× payout` };
    case BET_TYPES.BUST_RANK:
      return { pick: bet.rank, meta: `${STATIC_PAYOUTS.bustRank}× payout` };
    case BET_TYPES.EXACT_CARD: {
      const cardLabel = bet.rank === 'Joker' ? 'Joker' : `${bet.rank} of ${bet.suit}`;
      return { pick: cardLabel, meta: `${STATIC_PAYOUTS.exactCard}× payout` };
    }
    default:
      return { pick: '', meta: '' };
  }
}

function renderResults(outcomes) {
  resultsGrid.innerHTML = '';
  outcomes.forEach((bet) => {
    const div = document.createElement('div');
    div.className = 'card';
    const isWin = bet.payout > 0;
    div.innerHTML = `
      <strong>${describeType(bet.type)}</strong>
      <div class="meta">${describeBet(bet).pick}</div>
      <div class="${isWin ? 'payout' : 'loss'}">${isWin ? '+' : ''}${bet.payout}</div>
    `;
    resultsGrid.appendChild(div);
  });
}

function refreshUI() {
  deckCount.textContent = state.deck.length;
  bustCardLabel.textContent = state.bustCard ? formatCard(state.bustCard) : 'Not yet';
  firstCardLabel.textContent = state.firstCard ? formatCard(state.firstCard) : 'Not yet';
  stateLabel.textContent = state.status === 'finished'
    ? 'Hand complete'
    : state.status === 'dealing'
      ? 'Hand in progress'
      : 'Ready for bets';
  betCount.textContent = state.bets.length;
  totalPayoutLabel.textContent = state.totalPayout;
  renderHand();
  renderBets();
}

function toggleFields() {
  const type = document.getElementById('betType').value;
  const fields = {
    numberSelector: type === BET_TYPES.NUMBER,
    cardCountSelector: type === BET_TYPES.CARD_COUNT,
    firstSuitSelector: type === BET_TYPES.FIRST_SUIT,
    bustSuitSelector: type === BET_TYPES.BUST_SUIT,
    bustRankSelector: type === BET_TYPES.BUST_RANK,
    exactCardSelector: type === BET_TYPES.EXACT_CARD,
    paytableSelector: type === BET_TYPES.NUMBER,
  };

  Object.entries(fields).forEach(([id, visible]) => {
    const el = document.getElementById(id);
    el.style.display = visible ? 'block' : 'none';
  });
}

function handleBetSubmit(event) {
  event.preventDefault();
  const type = document.getElementById('betType').value;
  if (!validateTiming(type)) {
    alert('This bet type is locked after the hand begins.');
    return;
  }

  const wager = Number(document.getElementById('wager').value || 0);
  if (wager <= 0) {
    alert('Enter a wager greater than zero.');
    return;
  }

  const bet = { type, wager };
  if (type === BET_TYPES.NUMBER) {
    bet.rank = document.getElementById('numberRank').value;
    bet.paytable = document.getElementById('paytable').value;
  } else if (type === BET_TYPES.CARD_COUNT) {
    bet.bucket = document.getElementById('cardCountBucket').value;
  } else if (type === BET_TYPES.FIRST_SUIT) {
    bet.suit = document.getElementById('firstSuit').value;
  } else if (type === BET_TYPES.BUST_SUIT) {
    bet.suit = document.getElementById('bustSuit').value;
  } else if (type === BET_TYPES.BUST_RANK) {
    bet.rank = document.getElementById('bustRank').value;
  } else if (type === BET_TYPES.EXACT_CARD) {
    bet.rank = document.getElementById('exactRank').value;
    bet.suit = bet.rank === 'Joker' ? null : document.getElementById('exactSuit').value;
  }

  addBet(bet);
}

function clearBets() {
  state.bets = [];
  state.totalPayout = 0;
  resultsGrid.innerHTML = '';
  refreshUI();
}

function attachHandlers() {
  document.getElementById('betType').addEventListener('change', toggleFields);
  document.getElementById('betForm').addEventListener('submit', handleBetSubmit);
  document.getElementById('dealOne').addEventListener('click', dealOne);
  document.getElementById('dealToBust').addEventListener('click', dealToBust);
  document.getElementById('resetHand').addEventListener('click', () => {
    resetHand();
    resultsGrid.innerHTML = '';
  });
  document.getElementById('resetBets').addEventListener('click', clearBets);

  document.querySelectorAll('[data-chip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-chip');
      document.getElementById('wager').value = val;
      document.querySelectorAll('[data-chip]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

resetHand();
attachHandlers();
toggleFields();
