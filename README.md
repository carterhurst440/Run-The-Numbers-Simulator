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

### Timing
- All bets except **bust card** and **exact card** must be locked **before the first card is dealt**. Bust and exact-card bets remain open until their outcomes are determined.

## Simulator usage
1. Open `index.html` in a browser (or serve the repo root with `python -m http.server 8000` and visit `http://localhost:8000`).
2. Use the **Bet slip** to add wagers:
   - Number bets pick a rank (A, 2–10) and a paytable.
   - Card-count, first-suit, bust suit/rank, and exact-card bets all expose their specific selectors.
3. Click **Deal 1 card** to step through the deck or **Deal to bust** to resolve a hand automatically.
4. The **Hand tracker** shows each card in order, the bust card, first card, and total payout. Bets that win list their payouts in green; losing bets are red.

The panel overlays the supplied playmat image so you can line up the simulator with the physical layout. All payouts are for simulation only and can be tuned in `simulator.js` via `STATIC_PAYOUTS` and `PAYTABLES`.

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
