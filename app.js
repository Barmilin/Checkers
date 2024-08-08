const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const db = new sqlite3.Database('./checkers.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        initializeDatabase();
    }
});

function initializeDatabase() {
    const tableCreationQueries = [
        `CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT
        )`,
        `CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameId INTEGER,
            score INTEGER,
            FOREIGN KEY (gameId) REFERENCES games(id)
        )`,
        `CREATE TABLE IF NOT EXISTS names (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS moves (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameId INTEGER,
            move TEXT,
            FOREIGN KEY (gameId) REFERENCES games(id)
        )`
    ];

    db.serialize(() => {
        tableCreationQueries.forEach(query => {
            db.run(query, handleError);
        });
    });
}

function handleError(err) {
    if (err) {
        console.error('Database error:', err.message);
    }
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/start-single-game', (req, res) => {
    console.log('Request to start a single game');

    db.run(`INSERT INTO games DEFAULT VALUES`, function (err) {
        if (err) {
            console.error('Error starting game:', err.message);
            return res.status(500).json({ error: 'Failed to start game' });
        }

        res.json({ redirectUrl: '/game', gameId: this.lastID });
    });
});

app.get('/game', (req, res) => {
    console.log('Sending game.html');
    res.sendFile(path.join(__dirname, 'public', 'game.html'), handleError);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), handleError);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
