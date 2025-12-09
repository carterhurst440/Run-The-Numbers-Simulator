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
- Bet that a specific card (A–10 by suit, e.g., `8♠`) appears anywhere in the hand; may be placed until that exact card has appeared.
- Each suit/rank ladder sits in the same column as its number bet with suit icons descending down the column.
- Pays **13 to 1**.

### Timing
- All bets except **bust card** and **exact card** must be locked **before the first card is dealt**. Bust and exact-card bets remain open until their outcomes are determined.

## Simulator usage
1. Open `index.html` in a browser (or serve the repo root with `python -m http.server 8000` and visit `http://localhost:8000`).
2. The board renders at a fixed native size to mirror the reference art; on smaller screens, use the horizontal and vertical scroll bars to pan without the regions overlapping or resizing awkwardly.
3. The chip rack and controls are **pinned to the bottom** of the viewport; tap a chip to choose a wager size (5, 10, 25, 100).
4. Click any **hotspot** on the playmat art (faint dashed outlines with labels) to drop the selected chip value onto that printed region. The overlays are sized and positioned to match the artwork and to avoid overlap:
   - **Number bets** (A–10) cover each printed column; the card track sits directly above these columns so every rank falls into its matching lane.
   - **Exact card bets** sit inside each column as four suit icons (♠, ♥, ♣, ♦) cascading downward beneath the main number bet.
   - **Card-count buckets** form the first row beneath the numbers.
   - **First-card suits** live on the lower-left circles under the count rail.
   - **Bust suits** sit on the upper-right circles under the count rail, with **bust ranks** aligned directly below them.
   - **Paytable selection** lives on the printed “SELECT PAYTABLE” rail on the left.
5. Use **Deal** to burn a single card or **Deal to bust** to resolve the hand automatically. Each drawn number card stacks (slightly offset) in its dedicated column above the matching number bet; the bust card lands inside the circular bust overlay on the right.
6. Total payout and hand status are shown in the pinned bar. Bets lock after the first card is dealt (except bust bets and exact-card bets, which can continue until decided).
7. At the end of a hand, the deck automatically reshuffles and open bets clear. You can **Rebet** to restore the wagers you had at the start of the previous hand or start placing fresh bets immediately; the old cards remain visible until the next deal clears the track.

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
