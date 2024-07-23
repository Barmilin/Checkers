const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        boardState TEXT,
        currentPlayer TEXT,
        player1Score INTEGER,
        player2Score INTEGER,
        player1Id INTEGER,
        player2Id INTEGER
    )`, (err) => {
        if (err) {
            console.error('Error creating games table:', err.message);
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS moves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameId INTEGER,
        fromX INTEGER,
        fromY INTEGER,
        toX INTEGER,
        toY INTEGER,
        player TEXT,
        isCapture BOOLEAN,
        FOREIGN KEY (gameId) REFERENCES games(id)
    )`, (err) => {
        if (err) {
            console.error('Error creating moves table:', err.message);
        }
    });
});


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/start-single-game', (req, res) => {
    console.log('Request to start a single game');
    
    
    db.run(`INSERT INTO games (boardState, currentPlayer, player1Score, player2Score, player1Id, player2Id)
            VALUES (?, ?, ?, ?, ?, ?)`, ['initialBoardState', 'player1', 0, 0, 1, 2], function(err) {
        if (err) {
            console.error('Error starting game:', err.message);
            return res.status(500).json({ error: 'Failed to start game' });
        }
        
        res.json({ redirectUrl: '/game', gameId: this.lastID });
    });
});

app.get('/game', (req, res) => {
    console.log('Sending game.html');
    res.sendFile(path.join(__dirname, 'public', 'game.html'), (err) => {
        if (err) {
            console.error('Error sending game.html:', err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            console.error('Error sending index.html:', err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
