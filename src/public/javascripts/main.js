document.addEventListener('DOMContentLoaded', () => {
    const startForm = document.querySelector('.start form');
    const gameContainer = document.querySelector('.game');
    // Create divs for player total, computer total, and result
    const playerTotalDiv = document.createElement('div');
    playerTotalDiv.className = 'text-div';  

    const computerTotalDiv = document.createElement('div');
    computerTotalDiv.className = 'text-div'; 

    const resultDiv = document.createElement('div');
    resultDiv.className = 'text-div';
    resultDiv.style.display = 'none';  
    let deck = [];
    let playerHand = [];
    let computerHand = [];

    // Add total divs to the game container
    gameContainer.appendChild(computerTotalDiv);
    gameContainer.appendChild(playerTotalDiv);
    gameContainer.appendChild(resultDiv);

    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', '1'];
        let newDeck = [];

        suits.forEach(suit => {
            ranks.forEach(rank => {
                newDeck.push(`${rank}_of_${suit}`);
            });
        });

        return newDeck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealCard(hand) {
        hand.push(deck.pop());
        return hand;
    }

    function displayHands(revealComputerHand = false) {
    // Clear previous hands
    const handsDivs = document.querySelectorAll('.hand');
    handsDivs.forEach(div => div.remove());

    // Create and display computer's hand
    const computerHandDiv = document.createElement('div');
    computerHandDiv.className = 'hand';
    computerHand.forEach((card, index) => {
        computerHandDiv.appendChild(createCardElement(card, revealComputerHand ? false : index !== 0));
    });

    // Create and display player's hand
    const playerHandDiv = document.createElement('div');
    playerHandDiv.className = 'hand';
    playerHand.forEach(card => {
        playerHandDiv.appendChild(createCardElement(card));
    });

    // Update the game container
    gameContainer.insertBefore(computerHandDiv, playerTotalDiv);
    gameContainer.insertBefore(playerHandDiv, resultDiv);

    updateTotals();
}


    function createCardElement(cardImage, hidden = false) {
        const cardElement = document.createElement('img');
        cardElement.className = 'card';
       cardElement.src = hidden ? 'png/back.png' : `png/${cardImage}.png`;
        cardElement.alt = 'Card image';
        return cardElement;
    }
    

    function calculateHandValue(hand) {
        let value = 0;
        let aces = 0;
        hand.forEach(card => {
            let cardValue = card.split('_')[0];
            if (cardValue === '1') {
                aces++;
                value += 11;
            } else if (['jack', 'queen', 'king'].includes(cardValue)) {
                value += 10;
            } else {
                value += parseInt(cardValue, 10);
            }
        });
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    }

    function updateTotals() {
        playerTotalDiv.textContent = `Player Hand - Total: ${calculateHandValue(playerHand)}`;
        computerTotalDiv.textContent = `Computer Hand - Total: ?`;
    }

    function endGame() {
        displayHands(true); 
        let playerValue = calculateHandValue(playerHand);
        let computerValue = calculateHandValue(computerHand);

        computerTotalDiv.textContent = `Computer Hand - Total: ${computerValue}`;
        let resultText = '';

        if (playerValue > 21) {
            resultText = 'Player busts! Computer wins!';
        } else if (computerValue > 21 || playerValue === 21 || (playerValue > computerValue && playerValue <= 21)) {
            resultText = 'Player wins!';
        } else if (playerValue < computerValue && computerValue <= 21) {
            resultText = 'Computer wins!';
        } else if (playerValue === computerValue) {
            resultText = 'Push! It\'s a tie!';
        }

        if (resultText) {
            resultDiv.textContent = resultText;
            resultDiv.style.display = 'block';
        }
        // Disable buttons
        document.querySelector('#hitButton').disabled = true;
        document.querySelector('#standButton').disabled = true;
    }

    function hit() {
        playerHand = dealCard(playerHand);
        displayHands();
        let playerValue = calculateHandValue(playerHand);
        if (playerValue > 21) {
            endGame();
        }
    }

    function stand() {
        // Reveal computer's first card
        let computerFirstCard = computerHand[0];
        document.querySelector('.hand img.card').src = `png/${computerFirstCard}.png`;

        // Computer's turn
        while (calculateHandValue(computerHand) < 17) {
            computerHand = dealCard(computerHand);
            displayHands();
        }
        displayHands(true);
        endGame();
    }

    startForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Hide the resultDiv at the start of a new game
        resultDiv.style.display = 'none';
        const customValues = document.getElementById('startValues').value.split(',').map(value => value.trim().toLowerCase());
        let customCards = customValues.map(card => {
            return card.includes('_of_') ? card : `${card}_of_hearts`;
        });

        deck = createDeck();
        shuffleDeck(deck);
        customCards.reverse().forEach(card => deck.unshift(card));
        playerHand = [deck.shift(), deck.shift()];
        computerHand = [deck.shift(), deck.shift()];
        displayHands();

        // Add Hit and Stand buttons
        let hitButton = document.createElement('button');
        hitButton.textContent = 'Hit';
        hitButton.id = 'hitButton';
        hitButton.addEventListener('click', hit);
        gameContainer.appendChild(hitButton);

        let standButton = document.createElement('button');
        standButton.textContent = 'Stand';
        standButton.id = 'standButton';
        standButton.addEventListener('click', stand);
        gameContainer.appendChild(standButton);

        startForm.style.display = 'none';
        gameContainer.style.display = 'block';
    });
});
