const canvas = document.getElementById('pokerCanvas5');
const ctx = canvas.getContext('2d');

const CARD_WIDTH = 50;
const CARD_HEIGHT = 70;
const TABLE_CENTER_X = 400;
const TABLE_CENTER_Y = 350;
const TABLE_RADIUS_X = 350;
const TABLE_RADIUS_Y = 350;

function drawCard(x, y, card, faceUp = true, revealProgress = 1) {
    ctx.save();
    ctx.translate(x + CARD_WIDTH / 2, y + CARD_HEIGHT / 2);
    ctx.rotate((1 - revealProgress) * Math.PI);
    ctx.translate(-CARD_WIDTH / 2, -CARD_HEIGHT / 2);

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    if (faceUp && revealProgress > 0.5) {
        ctx.fillStyle = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
        ctx.font = '20px Arial';
        ctx.fillText(card.value, 5, 20);
        ctx.fillText(card.suit, 5, 45);
    } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(5, 5, CARD_WIDTH - 10, CARD_HEIGHT - 10);
    }

    ctx.restore();
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

function drawPlayer(playerIndex, cards, angle, revealProgress) {
    const x = TABLE_CENTER_X + Math.cos(angle) * TABLE_RADIUS_X * 0.7;
    const y = TABLE_CENTER_Y + Math.sin(angle) * TABLE_RADIUS_Y * 0.7;

    drawCard(x - 30, y, cards[0], true, revealProgress);
    drawCard(x + 30, y, cards[1], true, revealProgress);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Player ${playerIndex + 1}`, x, y + 100);
}

function drawDealer() {
    const dealerX = TABLE_CENTER_X;
    const dealerY = TABLE_CENTER_Y - TABLE_RADIUS_Y * 0.9;

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(dealerX, dealerY, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('D', dealerX, dealerY + 7);
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
    const totalFrames = 300; // 5 seconds at 60 fps
    const revealFrames = 60; // 1 second for each player's reveal

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTable();
        drawCommunityCards(communityCards);
        drawDealer();

        const playerAngles = [-Math.PI/3, Math.PI/6, Math.PI/2, 5*Math.PI/6];
        for (let i = 0; i < 4; i++) {
            const playerRevealStart = i * revealFrames;
            const playerRevealEnd = (i + 1) * revealFrames;
            let revealProgress = 0;

            if (frame >= playerRevealStart && frame < playerRevealEnd) {
                revealProgress = (frame - playerRevealStart) / revealFrames;
            } else if (frame >= playerRevealEnd) {
                revealProgress = 1;
            }

            drawPlayer(i, playerCards[i], playerAngles[i], revealProgress);
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



