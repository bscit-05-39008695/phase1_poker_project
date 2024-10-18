const step5 = document.getElementById("step5");
const canvas = document.getElementById('pokerCanvas5');
const ctx = canvas.getContext('2d');

const CARD_WIDTH = 50;
const CARD_HEIGHT = 70;
const TABLE_CENTER_X = 400;
const TABLE_CENTER_Y = 300;
const TABLE_RADIUS_X = 350;
const TABLE_RADIUS_Y = 250;

function drawCard(x, y, card) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);

    ctx.fillStyle = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
    ctx.font = '20px Arial';
    ctx.fillText(card.value, x + 5, y + 20);
    ctx.fillText(card.suit, x + 5, y + 45);
}

function drawTable() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.ellipse(TABLE_CENTER_X, TABLE_CENTER_Y, TABLE_RADIUS_X, TABLE_RADIUS_Y, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 10;
    ctx.stroke();
}

function drawCommunityCards(cards) {
    cards.forEach((card, index) => {
        drawCard(TABLE_CENTER_X - 150 + index * 60, TABLE_CENTER_Y - 35, card);
    });
}

function drawPlayerCards(playerIndex, cards) {
    const angle = (playerIndex / 4) * 2 * Math.PI - Math.PI / 2;
    const x = TABLE_CENTER_X + Math.cos(angle) * TABLE_RADIUS_X * 0.7;
    const y = TABLE_CENTER_Y + Math.sin(angle) * TABLE_RADIUS_Y * 0.7;

    drawCard(x - 30, y, cards[0]);
    drawCard(x + 30, y, cards[1]);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Player ${playerIndex + 1}`, x, y + 100);
}

function animateShowdown() {
    const communityCards = [
        {value: 'A', suit: '♠'},
        {value: 'K', suit: '♥'},
        {value: 'Q', suit: '♦'},
        {value: 'J', suit: '♣'},
        {value: '10', suit: '♠'}
    ];

    const playerCards = [
        [{value: 'A', suit: '♥'}, {value: 'K', suit: '♠'}],
        [{value: 'Q', suit: '♣'}, {value: 'J', suit: '♦'}],
        [{value: '10', suit: '♥'}, {value: '9', suit: '♥'}],
        [{value: '2', suit: '♦'}, {value: '7', suit: '♣'}]
    ];

    let frame = 0;
    const totalFrames = 120; // 2 seconds at 60 fps

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTable();
        drawCommunityCards(communityCards);

        const revealedPlayers = Math.min(4, Math.floor((frame + 1) / 30) + 1);
        for (let i = 0; i < revealedPlayers; i++) {
            drawPlayerCards(i, playerCards[i]);
        }

        frame++;
        if (frame < totalFrames) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// Start the animation
animateShowdown();