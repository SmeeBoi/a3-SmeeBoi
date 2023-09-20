'use strict';
const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 3000;

require('dotenv').config()

// app.use(express.static('public')) // Static files from public directory
app.use(express.static('public', { index: false })) // don't give index.html by default
app.use(express.json()) // For parsing application/json


const uri = `mongodb+srv://${process.env.TESTER}:${process.env.PASS}@${process.env.HOST}`

const client = new MongoClient(uri);
let collection = undefined;

// Set collection global value with database
async function run() {
  await client.connect()
  collection = client.db("testA3").collection("testList")
}
run();


app.get('/',  (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});


// Database connection check middleware
// app.use((req, res, next) => {
//   if (collection !== null) {
//     next()
//   } else {
//     res.status(503).send()
//   }
// })



// // POST 
// app.post('/submit', express.json(), async (req, res) => {
//   await collection.insertOne(req.body); // Add new player to the database
//   await updatePlayersAndRespond(res);
// });

// // DELETE
// app.delete('/delete', express.json(), async (req, res) => {
//   const playerName = req.body.name;
//   // Use MongoDB's deleteOne method to remove the player by name
//   await collection.deleteOne({ name: playerName });
//   await updatePlayersAndRespond(res);
// });

// // PUT
// app.put('/edit', express.json(), async (req, res) => {
//   const playerName = req.body.name;
//   const newName = req.body.newName
//   // Update the player's name in the MongoDB collection
//   await collection.updateOne({ name: playerName }, { $set: { name: newName } });
//   updatePlayersAndRespond(res)
// });

// // Helper function to update players and respond to client
// async function updatePlayersAndRespond(res) {
//   try {
//     // Sort players by score (highest score first)
//     const players = await collection.find({}).sort({ score: -1 }).toArray();

//     // Assign ranks to players based on their position in the sorted list
//     players.forEach((player, index) => {
//       player.rank = index + 1;
//     });

//     // Update the rank for each player in the database (optional)
//     const updatePromises = players.map(async (player) => {
//       await collection.updateOne({ _id: player._id }, { $set: { rank: player.rank } });
//     });

//     await Promise.all(updatePromises);

//     // Respond to the client with a JSON string of players
//     res.status(200).json(players);
//   } catch (error) {
//     // Handle error
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
