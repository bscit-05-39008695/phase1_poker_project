// Create deck of cards
function createDeck() {
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return shuffleDeck(deck);
}

// Shuffle deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Create card element
function createCard(value, suit, hidden = false) {
    const card = document.createElement('div');
    card.className = `card${hidden ? ' hidden' : ''}`;
    
    if (!hidden) {
        const valueDiv = document.createElement('div');
        valueDiv.className = 'card-value';
        valueDiv.textContent = value;

        const suitDiv = document.createElement('div');
        suitDiv.className = `card-suit${['♥', '♦'].includes(suit) ? ' red' : ''}`;
        suitDiv.textContent = suit;

        card.appendChild(valueDiv);
        card.appendChild(suitDiv);
    }

    return card;
}

// Sleep function for animations
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Deal cards function
async function dealCards() {
    const deck = createDeck();
    const dealingSpeed = 500; // milliseconds between each card

    // Deal 2 cards to each player
    for (let round = 0; round < 2; round++) {
        for (let player = 1; player <= 4; player++) {
            const card = deck.pop();
            const playerCards = document.querySelector(`.player${player} .player-cards`);
            const cardElement = createCard(card.value, card.suit);
            cardElement.classList.add('dealing');
            playerCards.appendChild(cardElement);
            await sleep(dealingSpeed);
        }
    }

    // Deal 3 community cards (flop)
    await sleep(dealingSpeed);
    const communityCards = document.querySelector('.community-cards');
    
    // First deal them face down
    for (let i = 0; i < 3; i++) {
        const card = deck.pop();
        const cardElement = createCard(null, null, true);
        cardElement.classList.add('dealing');
        communityCards.appendChild(cardElement);
        await sleep(dealingSpeed);
    }

    // After 2 seconds, reveal the flop
    await sleep(2000);
    const hiddenCards = communityCards.querySelectorAll('.card.hidden');
    for (let i = 0; i < 3; i++) {
        const card = deck.pop();
        const newCard = createCard(card.value, card.suit);
        newCard.classList.add('dealing');
        hiddenCards[i].replaceWith(newCard);
        await sleep(dealingSpeed);
    }
}

// Start dealing when page loads
window.onload = function() {
    const step2 = document.getElementById('step2');
    if (step2) {
        // Start dealing after a 2-second delay
        setTimeout(() => dealCards(), 2000);
    }
};