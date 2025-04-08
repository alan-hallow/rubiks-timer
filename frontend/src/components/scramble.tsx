import React from 'react';

function Scramble() {
  const scrambles = ["R", "R'", "L", "L'", "U", "U'", "D", "D'", "F", "F'", "B", "B'"]
  function randomScramble(characters, size) {
    let result = [];
    for (let i = 0; i < size; i++) {
      result.push(characters[Math.floor(Math.random() * characters.length)]);
    }
    return result.join(' ');
  }

  const scrambleText = randomScramble(scrambles, 20);
  return(
    <div className="scrambleWhole">
     <p className="scrambleText">{scrambleText}</p>
    </div>
  )
}

export default Scramble;
