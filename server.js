const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());

db.serialize(() => {
    db.run("CREATE TABLE budget (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, category TEXT, amount REAL)");
});

app.post('/api/budget', (req, res) => {
    const { type, category, amount } = req.body;
    db.run("INSERT INTO budget (type, category, amount) VALUES (?, ?, ?)", [type, category, amount], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

app.get('/api/budget', (req, res) => {
    db.all("SELECT * FROM budget", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});