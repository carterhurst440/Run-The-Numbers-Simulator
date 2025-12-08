# Run The Numbers — Playmat Simulator

This repository hosts a fresh branch of **Run The Numbers** focused on simulating the new playmat layout shown below. The goal is to mirror the original game's mechanics while building a flexible simulator for prototyping rules, payouts, and UI states.

![Run The Numbers playmat](https://res.cloudinary.com/ds1mvnflk/image/upload/v1705936744/oetrqkerubydmvesmdq7.png)

## Game summary
- **Deck**: Standard 52-card deck plus a single joker (53 cards total).
- **Bust card**: The first face card (J, Q, K) or joker encountered. There are **13 stopper cards**.
- **Hand building**: The dealer draws from the top of the deck until the bust card is revealed. All cards before the bust card plus the bust card itself form the hand.

## Betting structure
### Number bets (A and 2–10)
- Pay based on how many times the chosen rank appears before the bust card.
- The base wager stays on the table and **is not returned**; it is collected at the end of the hand even when interim payouts occurred.
- Players select a **paytable** that sets the accelerating payout ladder:
  - **Standard**: 1×, 4×, 10×, 50×
  - **Aggressive**: 2×, 8×, 40×, 200×
  - **Reckless**: 4×, 20×, 100×, 200×

### Bust bets
- Bet on the suit or rank (J/Q/K/Joker) of the bust card revealed at the end of the hand.

### Card-count bets
- Bet on the **total number of cards** in the hand including the bust card (1–8+ buckets as shown on the playmat).

### First-card suit
- Bet on the suit of the very first card dealt.

### Exact card bets
- Bet that a specific card (e.g., `8♠`) appears anywhere in the hand; may be placed until that exact card has appeared.
- This wager type is defined in the engine but not yet exposed on the current on-mat overlay.

### Timing
- All bets except **bust card** and **exact card** must be locked **before the first card is dealt**. Bust and exact-card bets remain open until their outcomes are determined.

## Simulator usage
1. Open `index.html` in a browser (or serve the repo root with `python -m http.server 8000` and visit `http://localhost:8000`).
2. Tap a **chip** in the rack along the bottom to choose a wager size (5, 10, 25, 100).
3. Click any bet spot on the playmat overlay to drop the selected chip value onto that region:
   - **Number bets** (A–10) live on the black circles; the current paytable (left rail) is attached to each chip you place.
   - **Bust ranks and suits** sit on the right-side circles beneath the “Bust Bets” banner.
   - **Card-count buckets** are the colored boxes across the lower rail (1 card through 8+).
   - **First-card suits** are the four suit circles just above the card-count rail.
4. Use **Deal** to burn a single card or **Deal to bust** to resolve the hand automatically. The card slots above A–10 show the stream of cards, while the bust card lands inside the circular bust overlay on the right.
5. Total payout and hand status are shown in the bar beneath the mat. Bets lock after the first card is dealt, except bust bets which can continue to accept chips.

All payouts are for simulation only and can be tuned in `simulator.js` via `STATIC_PAYOUTS` and `PAYTABLES`.

## Simulator goals
- Recreate dealing logic: shuffle, draw until face/joker bust card, track order, and surface the bust card.
- Model all betting markets above, including paytable selection per number bet.
- Provide hooks to test alternative paytables and edge cases (e.g., early bust with one card, deep hands with multiple repeats).
- Visualize the playmat state (bet regions, card order, and resolved outcomes) using the provided layout.

## Next steps
1. Implement core game engine (deck, draw loop, bust detection, hand state).
2. Add payout calculators for each market and wire them to paytable selection.
3. Build a UI layer that overlays the playmat to show active bets, card stream, and resolved payouts.
4. Add quick simulations for probability and volatility studies across the three paytables.
5. Document sample scenarios and regression tests for payouts and bet timing.
