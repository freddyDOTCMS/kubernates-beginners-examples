const React = require('react');

function LuckyPage({ number }) {
  return (
    <div>
      <h1>Your Lucky Number</h1>
      <div className="number">{number}</div>
    </div>
  );
}

module.exports = { default: LuckyPage };
