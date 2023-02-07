document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
});

class Game {

  constructor() {

      this.SELECTORS = {
          boardContainer: document.querySelector('.board-container'),
          board: document.querySelector('.board'),
          moves: document.querySelector('.moves'),
          timer: document.querySelector('.timer'),
          start: document.querySelector('button'),
          win: document.querySelector('.win')
      };

      this.STATE = {
          gameStarted: false,
          loop: undefined,
          flippedCards: 0,
          totalFlips: 0,
          totalTime: 0,
          totalPoints: 0
      };

      this.start();
  }

  shuffle(array) {
      const newArray = [...array]

      for (let index = newArray.length - 1; index > 0; index--) {
          let newIndex = Math.floor(Math.random() * (index + 1))
          let original = newArray[index]

          newArray[index] = newArray[newIndex]
          newArray[newIndex] = original
      }
      return newArray;
  }

  pickRandom(array, items) {
      let newArray = [...array]
      let randomPicks = []

      for (let index = 0; index < items; index++) {
          let newIndex = Math.floor(Math.random() * newArray.length)

          randomPicks.push(newArray[newIndex])
          newArray.splice(newIndex, 1)
      }
      return randomPicks
  }
  generateGame(dimensions) {

      dimensions = "4";

      const emojis = ['😂', '😎', '😍', '🤩', '😮', '😛',
          '🤑', '😞', '😡', '🤢', '😈', '🤡',
          '👽', '💩', '⚽', '⚾', '🥎', '🏀',
          '🏐', '💣', '🍟', '🍔', '🥩', '🍎',
          '🍊', '🍋', '🍌', '🍍', '🍏', '💥',
          '🍑', '🍒', '🍓', '🚀', '🌈', '☢️'
        ];

      let picks = this.pickRandom(emojis, (dimensions * dimensions) / 2);
      let items = this.shuffle([...picks, ...picks]);

      const CARDS = `<div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
      ${items.map(item => `
      <div class="card">
      <div class="card-front">?</div>
      <div class="card-back">${item}</div>
      </div>`).join('')}
  </div>`

      const PARSER = new DOMParser().parseFromString(CARDS, 'text/html');

      this.SELECTORS.board.replaceWith(PARSER.querySelector('.board'));
  }

  startGame() {
      this.STATE.gameStarted = true;
      this.SELECTORS.start.classList.add('disabled');

      this.STATE.loop = setInterval(() => {
          this.STATE.totalTime++;

          this.SELECTORS.moves.innerText = `Moves: ${this.STATE.totalFlips}`;
          this.SELECTORS.timer.innerText = `Time: ${this.STATE.totalTime} seconds`;

      }, 1000)
  }

  flipBackCards() {
      document.querySelectorAll('.card:not(.matched)').forEach(card => {
          card.classList.remove('flipped');
      })

      this.STATE.flippedCards = 0;
  }

  flipCard(card) {
      this.STATE.flippedCards++;
      this.STATE.totalFlips++;

      if (!this.STATE.gameStarted) {
          this.startGame();
      }

      if (this.STATE.flippedCards <= 2) {
          card.classList.add('flipped');
      }

      if (this.STATE.flippedCards === 2) {
          let flippedCards = document.querySelectorAll('.flipped:not(.matched)')

          if (flippedCards[0].innerText === flippedCards[1].innerText) {
              flippedCards[0].classList.add('matched');
              flippedCards[1].classList.add('matched');
          }
          setTimeout(() => {
              this.flipBackCards()
          }, 1000)
      }

      if (!document.querySelectorAll('.card:not(.flipped)').length) {

          setTimeout(() => {

              this.SELECTORS.boardContainer.classList.add('flipped')
              this.SELECTORS.win.innerHTML = `
          <span class="win-text">
              Congratulations!<br>
              You won with <span class="highlight">${this.STATE.totalFlips}</span> moves<br>
              under <span class="highlight">${this.STATE.totalTime}</span> seconds!
          </span>
      `;

              clearInterval(this.STATE.loop)
          }, 2500)
      }
  }

  attachListeners = () => {

      document.addEventListener('click', (e) => {

          const TARGET = e.target;
          const PARENT = e.target.parentElement;

          if (TARGET.className.includes('card') && !PARENT.className.includes('flipped')) {
              this.flipCard(PARENT);
          } else if (TARGET.nodeName === 'BUTTON' && !TARGET.className.includes('disabled')) {
              this.startGame();
          }
      })
  }

  start() {
      this.generateGame();
      this.attachListeners();
  };
}