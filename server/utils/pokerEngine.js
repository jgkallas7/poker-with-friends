const CardDeck = require('./cardDeck');

/**
 * Texas Hold'em Poker Game Engine
 */

class PokerEngine {
  constructor(gameId, players, buyInAmount, smallBlind = 5, bigBlind = 10) {
    this.gameId = gameId;
    this.players = players.map((p, index) => ({
      id: p.id,
      name: p.name,
      chips: buyInAmount,
      cards: [],
      bet: 0,
      folded: false,
      allIn: false,
      position: index,
      totalBuyIn: buyInAmount,
      totalCashOut: 0
    }));
    this.deck = new CardDeck();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.dealerIndex = 0;
    this.currentPlayerIndex = 0;
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.gameState = 'waiting'; // waiting, preflop, flop, turn, river, showdown
    this.handHistory = [];
  }

  /**
   * Start a new hand
   */
  startHand() {
    // Reset hand state
    this.deck.reset();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;

    this.players.forEach(player => {
      player.cards = [];
      player.bet = 0;
      player.folded = false;
      player.allIn = false;
    });

    // Move dealer button
    this.dealerIndex = (this.dealerIndex + 1) % this.players.length;

    // Post blinds
    this.postBlinds();

    // Deal hole cards
    this.dealHoleCards();

    this.gameState = 'preflop';
    this.currentPlayerIndex = this.getNextPlayerIndex((this.dealerIndex + 3) % this.players.length);

    return this.getGameState();
  }

  /**
   * Post small and big blinds
   */
  postBlinds() {
    const sbIndex = (this.dealerIndex + 1) % this.players.length;
    const bbIndex = (this.dealerIndex + 2) % this.players.length;

    const sbPlayer = this.players[sbIndex];
    const bbPlayer = this.players[bbIndex];

    sbPlayer.bet = Math.min(this.smallBlind, sbPlayer.chips);
    sbPlayer.chips -= sbPlayer.bet;
    this.pot += sbPlayer.bet;

    bbPlayer.bet = Math.min(this.bigBlind, bbPlayer.chips);
    bbPlayer.chips -= bbPlayer.bet;
    this.pot += bbPlayer.bet;

    this.currentBet = this.bigBlind;
  }

  /**
   * Deal hole cards to all players
   */
  dealHoleCards() {
    this.players.forEach(player => {
      if (!player.folded && player.chips > 0) {
        player.cards = this.deck.deal(2);
      }
    });
  }

  /**
   * Player action: fold, call, raise, check
   */
  playerAction(playerId, action, amount = 0) {
    const player = this.players.find(p => p.id === playerId);

    if (!player || player.folded) {
      return { success: false, error: 'Invalid player or already folded' };
    }

    switch (action) {
      case 'fold':
        player.folded = true;
        break;

      case 'check':
        if (player.bet < this.currentBet) {
          return { success: false, error: 'Cannot check, must call or raise' };
        }
        break;

      case 'call':
        const callAmount = Math.min(this.currentBet - player.bet, player.chips);
        player.chips -= callAmount;
        player.bet += callAmount;
        this.pot += callAmount;
        if (player.chips === 0) player.allIn = true;
        break;

      case 'raise':
        const raiseAmount = Math.min(amount, player.chips);
        if (raiseAmount < this.currentBet * 2 - player.bet && player.chips > 0) {
          return { success: false, error: 'Raise must be at least double current bet' };
        }
        player.chips -= raiseAmount;
        player.bet += raiseAmount;
        this.pot += raiseAmount;
        this.currentBet = player.bet;
        if (player.chips === 0) player.allIn = true;
        break;
    }

    // Move to next player or next betting round
    if (this.isBettingRoundComplete()) {
      this.advanceGameState();
    } else {
      this.currentPlayerIndex = this.getNextPlayerIndex(this.currentPlayerIndex);
    }

    return { success: true, gameState: this.getGameState() };
  }

  /**
   * Check if betting round is complete
   */
  isBettingRoundComplete() {
    const activePlayers = this.players.filter(p => !p.folded && !p.allIn);

    if (activePlayers.length <= 1) return true;

    const allBetsEqual = activePlayers.every(p => p.bet === this.currentBet);
    return allBetsEqual;
  }

  /**
   * Advance to next game state (flop, turn, river, showdown)
   */
  advanceGameState() {
    // Reset bets for new round
    this.players.forEach(p => p.bet = 0);
    this.currentBet = 0;

    switch (this.gameState) {
      case 'preflop':
        this.communityCards = this.deck.deal(3);
        this.gameState = 'flop';
        break;
      case 'flop':
        this.communityCards.push(...this.deck.deal(1));
        this.gameState = 'turn';
        break;
      case 'turn':
        this.communityCards.push(...this.deck.deal(1));
        this.gameState = 'river';
        break;
      case 'river':
        this.gameState = 'showdown';
        this.determineWinner();
        break;
    }

    if (this.gameState !== 'showdown') {
      this.currentPlayerIndex = this.getNextPlayerIndex(this.dealerIndex);
    }
  }

  /**
   * Determine hand winner (simplified - you'd want a proper hand evaluator)
   */
  determineWinner() {
    const activePlayers = this.players.filter(p => !p.folded);

    // In a real implementation, you'd evaluate poker hands here
    // For now, we'll use a placeholder
    if (activePlayers.length === 1) {
      activePlayers[0].chips += this.pot;
      this.handHistory.push({
        winner: activePlayers[0].id,
        pot: this.pot,
        communityCards: this.communityCards
      });
    }

    this.pot = 0;
  }

  /**
   * Get next active player index
   */
  getNextPlayerIndex(startIndex) {
    let index = (startIndex + 1) % this.players.length;

    while (this.players[index].folded || this.players[index].allIn) {
      index = (index + 1) % this.players.length;
      if (index === startIndex) break;
    }

    return index;
  }

  /**
   * Player buy-in (add chips)
   */
  buyIn(playerId, amount) {
    const player = this.players.find(p => p.id === playerId);
    if (player) {
      player.chips += amount;
      player.totalBuyIn += amount;
      return { success: true, newChips: player.chips };
    }
    return { success: false };
  }

  /**
   * Player cash-out (remove chips and log)
   */
  cashOut(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (player) {
      const cashOutAmount = player.chips;
      player.totalCashOut = cashOutAmount;
      const netResult = cashOutAmount - player.totalBuyIn;

      return {
        success: true,
        cashOutAmount,
        totalBuyIn: player.totalBuyIn,
        netResult
      };
    }
    return { success: false };
  }

  /**
   * Get current game state (sanitized for clients)
   */
  getGameState(forPlayerId = null) {
    return {
      gameId: this.gameId,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        chips: p.chips,
        bet: p.bet,
        folded: p.folded,
        allIn: p.allIn,
        position: p.position,
        // Only show cards to the specific player or during showdown
        cards: (forPlayerId === p.id || this.gameState === 'showdown') ? p.cards : []
      })),
      communityCards: this.communityCards,
      pot: this.pot,
      currentBet: this.currentBet,
      currentPlayerIndex: this.currentPlayerIndex,
      dealerIndex: this.dealerIndex,
      gameState: this.gameState,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind
    };
  }
}

module.exports = PokerEngine;
