function continuousRiverAnimation() {
    const step4Element = document.getElementById('step4');
    let container, pokerTable, communityCardsElement, burnPile, playerHandElement, statusText, descriptionText;

    function initializeElements() {
        const pokercanvasElement = document.getElementById('pokercanvas');
        pokercanvasElement.innerHTML = ''; // Clear previous content
    
        // Create poker table container
        pokerTable = document.createElement('div');
        pokerTable.className = 'poker-table';
        pokercanvasElement.appendChild(pokerTable);
    
        // Create and add community cards
        communityCardsElement = document.createElement('div');
        communityCardsElement.className = 'community-cards';
        pokerTable.appendChild(communityCardsElement);
    
        // Create and add burn pile
        burnPile = document.createElement('div');
        burnPile.className = 'burn-pile';
        burnPile.textContent = 'Burn';
        pokerTable.appendChild(burnPile);
    
        // Create and add player's hand
        playerHandElement = document.createElement('div');
        playerHandElement.className = 'player-hand';
        pokerTable.appendChild(playerHandElement);
    
        // Create status text
        statusText = document.createElement('p');
        statusText.id = 'status-text';
        pokercanvasElement.appendChild(statusText);
    }
} 
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Function to create a deck
function createDeck() {
    return suits.flatMap(suit => values.map(value => `${value}${suit}`));
}

// Function to shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to deal cards
function dealCards(deck, numCards) {
    return deck.splice(0, numCards);
}

// Function to create a card element
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'card-value';
    valueSpan.textContent = card.slice(0, -1);
    
    const suitSpan = document.createElement('span');
    suitSpan.className = 'card-suit';
    suitSpan.textContent = card.slice(-1);
    
    if (card.slice(-1) === '♥' || card.slice(-1) === '♦') {
        cardElement.classList.add('red');
    }
    
    cardElement.appendChild(valueSpan);
    cardElement.appendChild(suitSpan);
    
    return cardElement;
}

// Initialize the game
let deck = createDeck();
shuffleDeck(deck);

// Function to animate the river card continuously
function continuousRiverAnimation() {
    const step4Element = document.getElementById('step4');
    let pokerTable, communityCardsElement, burnPile, playerHandElement, statusText;

    function initializeElements() {
        step4Element.innerHTML = ''; // Clear previous content

        // Create poker table container
        pokerTable = document.createElement('div');
        pokerTable.className = 'poker-table';
        step4Element.appendChild(pokerTable);

        // Create and add community cards
        communityCardsElement = document.createElement('div');
        communityCardsElement.className = 'community-cards';
        pokerTable.appendChild(communityCardsElement);

        // Create and add burn pile
        burnPile = document.createElement('div');
        burnPile.className = 'burn-pile';
        burnPile.textContent = 'Burn';
        pokerTable.appendChild(burnPile);

        // Create and add player's hand
        playerHandElement = document.createElement('div');
        playerHandElement.className = 'player-hand';
        pokerTable.appendChild(playerHandElement);

        // Create status text
        statusText = document.createElement('p');
        statusText.id = 'status-text';
        step4Element.appendChild(statusText);
    }

    function updateStatus(message) {
        statusText.textContent = message;
    }

    function dealInitialCards() {
        communityCardsElement.innerHTML = '';
        playerHandElement.innerHTML = '';

        const communityCards = dealCards(deck, 4);
        communityCards.forEach(card => {
            communityCardsElement.appendChild(createCardElement(card));
        });

        const playerHand = dealCards(deck, 2);
        playerHand.forEach(card => {
            playerHandElement.appendChild(createCardElement(card));
        });
    }

    function burnAndDealRiver() {
        updateStatus('Burning card in 3 seconds...');
        burnPile.style.backgroundColor = '#ddd';
        burnPile.textContent = 'Burn';

        setTimeout(() => {
            burnPile.style.backgroundColor = '#999';
            burnPile.textContent = 'Burned';
            updateStatus('Card burned. Dealing river card...');

            setTimeout(() => {
                const riverCard = dealCards(deck, 1)[0];
                communityCardsElement.appendChild(createCardElement(riverCard));
                updateStatus('River card dealt. Examine your hand and decide on your play.');

                // Reset after 5 seconds
                setTimeout(() => {
                    if (deck.length < 7) {
                        deck = createDeck();
                        shuffleDeck(deck);
                    }
                    dealInitialCards();
                    burnAndDealRiver();
                }, 5000);
            }, 1000);
        }, 3000);
    }

    initializeElements();
    dealInitialCards();
    burnAndDealRiver();
}

// Start the continuous animation when the page loads
window.addEventListener('load', continuousRiverAnimation);