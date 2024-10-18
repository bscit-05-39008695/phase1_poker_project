class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    toString() {
        return `${this.rank}${this.suit}`;
    }
}

class Player {
    constructor(name, position) {
        this.name = name;
        this.hand = [];
        this.folded = false;
        this.position = position;
        this.revealed = false;
    }
}

class PokerGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.players = [
            new Player("Player 1", {x: 350, y: 500}),
            new Player("Player 2", {x: 100, y: 300}),
            new Player("Player 3", {x: 350, y: 100}),
            new Player("Player 4", {x: 600, y: 300})
        ];
        this.communityCards = [];
        this.deck = this.createDeck();
        this.dealCards();
        this.currentPlayerIndex = 0;
        this.winner = null;
    }

    createDeck() {
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const suits = ['♠', '♣', '♥', '♦'];
        let deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push(new Card(rank, suit));
            }
        }
        return this.shuffle(deck);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    dealCards() {
        for (let i = 0; i < 2; i++) {
            for (let player of this.players) {
                player.hand.push(this.deck.pop());
            }
        }
        for (let i = 0; i < 5; i++) {
            this.communityCards.push(this.deck.pop());
        }
    }

    drawCard(card, x, y, faceDown = false) {
        this.ctx.fillStyle = faceDown ? 'blue' : 'white';
        this.ctx.fillRect(x, y, 50, 70);
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x, y, 50, 70);
        if (!faceDown) {
            this.ctx.fillStyle = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(card.toString(), x + 5, y + 30);
        }
    }

    drawPlayer(player) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(player.name, player.position.x - 30, player.position.y - 40);
        if (player.folded) {
            this.ctx.fillStyle = 'gray';
            this.ctx.fillRect(player.position.x - 25, player.position.y - 35, 50, 70);
        } else {
            this.drawCard(player.hand[0], player.position.x - 55, player.position.y - 35, !player.revealed);
            this.drawCard(player.hand[1], player.position.x + 5, player.position.y - 35, !player.revealed);
        }
    }

    drawCommunityCards() {
        for (let i = 0; i < this.communityCards.length; i++) {
            this.drawCard(this.communityCards[i], 250 + i * 60, 250);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCommunityCards();
        for (let player of this.players) {
            this.drawPlayer(player);
        }
        if (this.winner) {
            this.ctx.fillStyle = 'green';
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Winner: ${this.winner.name}`, 300, 50);
        }
    }

    revealNextHand() {
        while (this.currentPlayerIndex < this.players.length) {
            let player = this.players[this.currentPlayerIndex];
            this.currentPlayerIndex++;
            if (!player.folded) {
                player.revealed = true;
                return true;
            }
        }
        return false;
    }

    determineWinner() {
        const activePlayers = this.players.filter(player => !player.folded);
        this.winner = activePlayers[Math.floor(Math.random() * activePlayers.length)];
    }

    animateShowdown() {
        if (this.revealNextHand()) {
            this.draw();
            setTimeout(() => this.animateShowdown(), 1000);
        } else if (!this.winner) {
            this.determineWinner();
            this.draw();
        }
    }
}

window.onload = () => {
    const canvas = document.getElementById('pokerCanvas');
    const game = new PokerGame(canvas);
    
    // Simulate some players folding
    game.players[1].folded = true;

    // Start the animated showdown
    game.draw();
    setTimeout(() => game.animateShowdown(), 1000);
};