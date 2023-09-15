const express = require('express'),
    app = express()

// Static files from public directory
app.use(express.static('public'))
app.use(express.json()) // for parsing application/json

// serverPlayerLog is the test data that is stored on server
let serverPlayerLog = [
    { name: 'example-player', color: 'red', score: 0, rank: 0 }
]


// Routes

// GET
app.get('/', (req, res) => res.send('Handled GET request'))

// POST 
app.post('/submit', express.json(), (req, res) => {
    serverPlayerLog.push(req.body) // Add new player to serverPlayerLog 
    rankPlayers(serverPlayerLog);
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(serverPlayerLog))
})

// DELETE
app.delete('/delete', express.json(), (req, res) => {
    // Delete player from serverPlayerLog
    serverPlayerLog = serverPlayerLog.filter(player => player.name !== req.body.name)
    rankPlayers(serverPlayerLog);
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(serverPlayerLog))
})

// PUT
app.put('/edit', express.json(), (req, res) => {
    // Update player names in serverPlayerLog
    serverPlayerLog.forEach(player => {
        if (player.name === req.body.name) {
            player.name = req.body.newName; // Update player name
        }
    })
    rankPlayers(serverPlayerLog);
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(serverPlayerLog))
})

// Start server
app.listen(process.env.PORT || 3000)

// Rank Players sort serverPlayerLog and gives each player a rank
function rankPlayers(serverPlayerLog) {
    serverPlayerLog.sort((a, b) => (a.score < b.score) ? 1 : -1)
    serverPlayerLog.forEach((player, index) => {
        player.rank = index + 1;
    })
    return serverPlayerLog;
}