document.addEventListener('DOMContentLoaded', ()=>{

    GENERATE_GAME();
    ATTACH_LISTENERS();

});

// Defining game state and selectors object

const SELECTORS = {
        boardContainer: document.querySelector('.board-container'),
        board: document.querySelector('.board'),
        moves: document.querySelector('.moves'),
        timer: document.querySelector('.timer'),
        start: document.querySelector('button'),
        win: document.querySelector('.win')
};
    
const STATE = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

// Shuffling the array so it will be random each time the page is refreshed

const SHUFFLE = array => {

    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {

        let randomIndex = Math.floor(Math.random() * (index + 1))
        let original = clonedArray[index]

            clonedArray[index] = clonedArray[randomIndex]
            clonedArray[randomIndex] = original
    }
    return clonedArray
}


// Fisher-Yates shuffling alogorithm implementation to Shuffling function
// Creates an random integer j, greater than 0 but less than index
// Then exchanges the random index with i so array[i] = array[j]
// and array[j] = array[i]

const PICK_RANDOM = (array, items) => {

    let clonedArray =[...array]
    let randomPicks = []

    for (let index = 0; index < items; index++) {

        let randomIndex = Math.floor(Math.random() * clonedArray.length)
        
            randomPicks.push(clonedArray[randomIndex])
            clonedArray.splice(randomIndex, 1) 
    }
      return randomPicks
}


// Main game generation code, the size is based on data-dimension atribute,
// the size of a board has to be an even number,
// DOMParser exchanges the output from string to HTML code

const GENERATE_GAME = () => {

    let dimensions = SELECTORS.board.getAttribute('data-dimension');
    //console.log(dimensions, typeof(dimensions));

    if(dimensions % 2 !== 0) {
        console.error("Wielkość planszy musi być podzielna przez 2! Wielkość planszy musi być podzielna przez 2! Ładuję podstawową planszę 2x2, zmień atrybut Data-dimension na prawidłową liczbę!");
        alert("Wielkość planszy musi być podzielna przez 2! Ładuję podstawową planszę 2x2, zmień atrybut Data-dimension na prawidłową liczbę!");
        dimensions = "2";
    }

// Table of emojis

const emojis = ['😂','😎','😍','🤩','😮','😛',
                '🤑','😞','😡','🤢','😈','🤡',
                '👽','💩','⚽','⚾','🥎','🏀',
                '🏐','💣','🍟','🍔','🥩','🍎',
                '🍊','🍋','🍌','🍍','🍏','💥',
                '🍑','🍒','🍓','🚀','🌈','☢️']
              
let picks = PICK_RANDOM(emojis, (dimensions * dimensions) /2)
let items = SHUFFLE([...picks, ...picks])


const CARDS =
        



        `<div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
            <div class="card">
            <div class="card-front">?</div>
            <div class="card-back">${item}</div>
            </div>`).join('')}
        </div>`


const PARSER = new DOMParser().parseFromString(CARDS, 'text/html')

SELECTORS.board.replaceWith(PARSER.querySelector('.board'))

};



//Start the game and counters

const START_GAME = () => {

    STATE.gameStarted = true;
    SELECTORS.start.classList.add('disabled');

    STATE.loop = setInterval(() => {

        STATE.totalTime++

        SELECTORS.moves.innerText = `Moves: ${STATE.totalFlips}`
        SELECTORS.timer.innerText = `Time: ${STATE.totalTime} seconds`

    }, 1000)

}


// Flip the cards if they don't match;
const FLIP_BACK_CARDS = () => {

    document.querySelectorAll('.card:not(.matched)').forEach(card => {

        card.classList.remove('flipped')

    })

    STATE.flippedCards = 0

}



// Flipp card functionality, the function prevents player from picking more than 2 cards
// and if they match they get matched also if there are no cards left the game shows
// win for the player.

const FLIP_CARD = card => {
    
    STATE.flippedCards++
    STATE.totalFlips++

    if(!STATE.gameStarted) {

        START_GAME()

    }

    if(STATE.flippedCards <= 2) {

        card.classList.add('flipped')

    }

    if(STATE.flippedCards === 2) {
        let flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {

            FLIP_BACK_CARDS()

        }, 1000)
    }

//if there are no cards left then the game is over
    if (!document.querySelectorAll('.card:not(.flipped)').length) {

        setTimeout(() => {
            
            SELECTORS.boardContainer.classList.add('flipped')
            SELECTORS.win.innerHTML = `
                <span class="win-text">
                    Congratulations!<br>
                    You won with <span class="highlight">${STATE.totalFlips}</span> moves<br>
                    under <span class="highlight">${STATE.totalTime}</span> seconds!
                </span>
            `
    
            clearInterval(STATE.loop)
        }, 2500)
    }
}


// Attach click listeners to cards 
const ATTACH_LISTENERS = () => {

    document.addEventListener('click', (e) => {

        const TARGET = e.target
        const PARENT = e.target.parentElement

        if(TARGET.className.includes('card') && !PARENT.className.includes('flipped')) {

            FLIP_CARD(PARENT)

        }

        else if (TARGET.nodeName === 'BUTTON' && !TARGET.className.includes('disabled')) {

            START_GAME()

        }
    })
}




