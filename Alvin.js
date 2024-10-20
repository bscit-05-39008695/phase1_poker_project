const canvas = document.getElementById('pokerCanvas');
const ctx = canvas.getContext('2d');
const CARD_WIDTH = 50;
const CARD_HEIGHT = 70;
const TABLE_CENTER_X = 400;
const TABLE_CENTER_Y = 300;
const TABLE_RADIUS_X = 350;
const TABLE_RADIUS_Y = 250;
const ANIMATION_DURATION = 500; 
let deck = [];
let dealingInProgress = false;
const players = [[], [], [], []];
const communityCards = []; // 3 community cards

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard(x, y, card) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.fillStyle = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
    ctx.font = '20px Arial';
    ctx.fillText(card.value, x + 10, y + 25);
    ctx.fillText(card.suit, x + 10, y + 50);
}

function drawStaticTable() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.ellipse(TABLE_CENTER_X, TABLE_CENTER_Y, TABLE_RADIUS_X, TABLE_RADIUS_Y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 10;
    ctx.stroke();
    drawPlayerPositions();
}

function drawPlayerPositions() {
    const playerPositions = [
        { x: TABLE_CENTER_X - 200, y: TABLE_CENTER_Y + 80 }, // Player 1
        { x: TABLE_CENTER_X - 100, y: TABLE_CENTER_Y + 80 }, // Player 2
        { x: TABLE_CENTER_X + 100, y: TABLE_CENTER_Y + 80 }, // Player 3
        { x: TABLE_CENTER_X + 200, y: TABLE_CENTER_Y + 80 }  // Player 4
    ];
    playerPositions.forEach((pos, index) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Player ${index + 1}`, pos.x, pos.y + 5);
        ctx.textAlign = 'left';
    });
}

function drawCommunityCards() {
    const startX = TABLE_CENTER_X - 75; // Adjust for three cards
    const startY = TABLE_CENTER_Y - 40;
    communityCards.forEach((card, index) => {
        drawCard(startX + index * 60, startY, card);
    });
}

function drawPlayerCards() {
    const playerPositions = [
        { x: TABLE_CENTER_X - 200, y: TABLE_CENTER_Y + 80 },
        { x: TABLE_CENTER_X - 100, y: TABLE_CENTER_Y + 80 },
        { x: TABLE_CENTER_X + 100, y: TABLE_CENTER_Y + 80 },
        { x: TABLE_CENTER_X + 200, y: TABLE_CENTER_Y + 80 }
    ];
    players.forEach((playerCards, pIndex) => {
        const startX = playerPositions[pIndex].x;
        const startY = playerPositions[pIndex].y;
        const handType = evaluateHand(playerCards, communityCards);
        const isWinningHand = (handType === "Winning Hand Type"); // Replace with actual winning hand check

        playerCards.forEach((card, cIndex) => {
            ctx.strokeStyle = isWinningHand ? 'gold' : 'black';
            ctx.lineWidth = isWinningHand ? 3 : 1;
            drawCard(startX + cIndex * 60, startY, card);
        });
    });
}

function animateCard(startX, startY, endX, endY) {
    return new Promise(resolve => {
        const startTime = performance.now();
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            drawStaticTable();
            drawCommunityCards();
            drawPlayerCards();
            drawCard(currentX, currentY, { value: '', suit: '' }); // Draw temporary card
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }
        requestAnimationFrame(animate);
    });
}

async function animateTurnStep() {
    // Burn the top card
    const burnedCard = deck.pop(); // Remove the top card without using it
    console.log('Burned card:', burnedCard); // Optional: Log the burned card

    // Animate the burn pile
    const burnPileX = TABLE_CENTER_X + 150; // Position for burn pile
    const burnPileY = TABLE_CENTER_Y - TABLE_RADIUS_Y + 40; // Position for burn pile
    await animateCard(TABLE_CENTER_X, TABLE_CENTER_Y - TABLE_RADIUS_Y + 40, burnPileX, burnPileY);

    // Deal the turn card
    const turnCard = deck.pop();
    communityCards.push(turnCard);
    const startX = TABLE_CENTER_X;
    const startY = TABLE_CENTER_Y - TABLE_RADIUS_Y + 40; // Dealer position
    const endX = TABLE_CENTER_X - 15; // Position for turn card
    const endY = TABLE_CENTER_Y - 40; // Position for community card

    await animateCard(startX, startY, endX, endY);

    // Show possible player actions (bet, call, fold)
    showPlayerActions();
}

// Function to show player actions
function showPlayerActions() {
    const actions = ["Bet", "Call", "Fold"];
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action-container');

    actions.forEach(action => {
        const actionButton = document.createElement('button');
        actionButton.textContent = action;
        actionButton.classList.add('action-button');
        actionButton.onclick = () => handleAction(action); // Handle action based on user click
        actionContainer.appendChild(actionButton);
    });

    document.body.appendChild(actionContainer); // Append action buttons to the body
}

// Handle player action
function handleAction(action) {
    console.log('Player chose to:', action);
    // Implement specific logic based on the action chosen
}

async function dealCards() {
    if (dealingInProgress) return;
    dealingInProgress = true;
    createDeck();

    // Deal 2 cards to each player
    for (let round = 0; round < 2; round++) {
        for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
            const card = deck.pop();
            players[playerIndex].push(card);
            const startX = TABLE_CENTER_X;
            const startY = TABLE_CENTER_Y - TABLE_RADIUS_Y + 40; // Dealer position
            const endX = TABLE_CENTER_X - 200 + playerIndex * 100 + (round * 60); // Adjust for each player's card
            const endY = TABLE_CENTER_Y + 80; // Players' card position
            await animateCard(startX, startY, endX, endY);
        }
    }

    // Deal 3 community cards
    for (let communityIndex = 0; communityIndex < 3; communityIndex++) {
        const card = deck.pop();
        communityCards.push(card);
        const startX = TABLE_CENTER_X;
        const startY = TABLE_CENTER_Y - TABLE_RADIUS_Y + 40; // Dealer position
        const endX = TABLE_CENTER_X - 75 + communityIndex * 60; // Community card position
        const endY = TABLE_CENTER_Y - 40; // Community card position
        await animateCard(startX, startY, endX, endY);
    }

    // Animate the turn step
    await animateTurnStep();

    dealingInProgress = false;
}

function evaluateHand(playerCards, communityCards) {
    // Simple evaluation logic (replace with complete logic)
    const allCards = [...playerCards, ...communityCards];
    const cardValues = allCards.map(card => card.value);
    const uniqueValues = new Set(cardValues);

    if (uniqueValues.size < 5) {
        return "Winning Hand Type"; // Replace with actual evaluation logic
    }

    return "High Card"; // Default case
}

// Start dealing cards after 2 seconds
setTimeout(dealCards, 1000);
