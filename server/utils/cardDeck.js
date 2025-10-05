const crypto = require('crypto');

/**
 * Cryptographically secure card deck implementation
 * Uses crypto.randomBytes for true randomness
 */

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

class CardDeck {
  constructor() {
    this.cards = [];
    this.initializeDeck();
  }

  /**
   * Initialize a standard 52-card deck
   */
  initializeDeck() {
    this.cards = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        this.cards.push({ suit, rank });
      }
    }
  }

  /**
   * Cryptographically secure shuffle using Fisher-Yates algorithm
   * with crypto.randomBytes for true randomness
   */
  shuffle() {
    const deck = [...this.cards];

    for (let i = deck.length - 1; i > 0; i--) {
      // Generate cryptographically secure random index
      const randomBytes = crypto.randomBytes(4);
      const randomNum = randomBytes.readUInt32BE(0);
      const j = randomNum % (i + 1);

      // Swap elements
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    this.cards = deck;
    return this;
  }

  /**
   * Deal a specified number of cards from the deck
   */
  deal(count = 1) {
    if (count > this.cards.length) {
      throw new Error('Not enough cards in deck');
    }
    return this.cards.splice(0, count);
  }

  /**
   * Get remaining card count
   */
  remainingCards() {
    return this.cards.length;
  }

  /**
   * Reset and shuffle the deck
   */
  reset() {
    this.initializeDeck();
    this.shuffle();
    return this;
  }
}

module.exports = CardDeck;
