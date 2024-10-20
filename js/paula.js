const step1 = document.getElementById("step1")
const canvas = document.getElementById('pokerCanvas');
const ctx = canvas.getContext('2d');

const CARD_WIDTH = 50;
const CARD_HEIGHT = 70;
const TABLE_CENTER_X = 400;
const TABLE_CENTER_Y = 300;
const TABLE_RADIUS_X = 350;
const TABLE_RADIUS_Y = 250;
const ANIMATION_DURATION = 500; // ms

function calculatePosition(index, total) {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top (- Math.PI / 2)
    return {
        x: TABLE_CENTER_X + Math.cos(angle) * TABLE_RADIUS_X * 0.8,
        y: TABLE_CENTER_Y + Math.sin(angle) * TABLE_RADIUS_Y * 0.8
    };
}

let player = ["player"];
const dealerPosition = calculatePosition(0, 5);
const playerPositions = [
    calculatePosition(1, 5),
    calculatePosition(2, 5),
    calculatePosition(3, 5),
    calculatePosition(4, 5)
].map((pos, index) => ({ ...pos, name: `${player} , ${index + 1}` }));

let players = [[1], [2], [3], [4]];
let deck = [];
let dealingInProgress = false;

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

function drawCard(x, y, faceUp = false) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);

    // Always draw the back of the card
    ctx.fillStyle = 'blue';
    ctx.fillRect(x + 5, y + 5, CARD_WIDTH - 10, CARD_HEIGHT - 10);
    ctx.strokeStyle = 'gold';
    ctx.strokeRect(x + 10, y + 10, CARD_WIDTH - 20, CARD_HEIGHT - 20);
}

function drawStaticTable() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the table
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.ellipse(TABLE_CENTER_X, TABLE_CENTER_Y, TABLE_RADIUS_X, TABLE_RADIUS_Y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw dealer position
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(TABLE_CENTER_X, TABLE_CENTER_Y - TABLE_RADIUS_Y + 40, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('D', TABLE_CENTER_X - 7, TABLE_CENTER_Y - TABLE_RADIUS_Y + 47);

    // Draw player positions
    playerPositions.forEach((pos, index) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pos.name, pos.x, pos.y + 5);
        ctx.textAlign = 'left';
    });
}

function drawPlayerCards() {
    players.forEach((playerCards, pIndex) => {
        playerCards.forEach((card, cIndex) => {
            const pos = playerPositions[pIndex];
            drawCard(pos.x + cIndex * 60 - 30, pos.y + 40);
        });
    });
}

function animateCard(playerIndex, cardIndex) {
    return new Promise(resolve => {
        const startX = TABLE_CENTER_X;
        const startY = TABLE_CENTER_Y - TABLE_RADIUS_Y + 40;
        const endX = playerPositions[playerIndex].x + cardIndex * 60 - 30;
        const endY = playerPositions[playerIndex].y + 40;
        
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
            
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            
            drawStaticTable();
            drawPlayerCards();
            drawCard(currentX, currentY);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                players[playerIndex].push({});  // Push an empty object as we don't need card details
                resolve();
            }
        }
        
        requestAnimationFrame(animate);
    });
}

async function dealPreFlop() {
    if (dealingInProgress) return;
    dealingInProgress = true;

    createDeck();
    players = [[], [], [], []];
    drawStaticTable();

    for (let round = 0; round < 2; round++) {
        for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
            deck.pop();  // Remove a card from the deck but don't use its details
            await animateCard(playerIndex, round);
        }
    }

    dealingInProgress = false;
}

// Deal after every 2secs
const intervalId = setInterval(dealPreFlop, 2000);

dealPreFlop()




