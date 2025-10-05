import React from 'react';

const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

const SUIT_COLORS = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black'
};

function Card({ suit, rank }) {
  return (
    <div className={`playing-card ${SUIT_COLORS[suit]}`}>
      <div className="card-rank">{rank}</div>
      <div className="card-suit">{SUIT_SYMBOLS[suit]}</div>
      <div className="card-rank-bottom">{rank}</div>
    </div>
  );
}

export default Card;
