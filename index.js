const express = require("express");
const compression = require("compression");
const cors = require("cors");
const history = require("connect-history-api-fallback");

// initialize express app
const app = express();
const port = process.env.PORT || 3333;

app.use(cors());

// configure middlewares
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(history());

// serve vue app
const publicAdminRoot = "dist";
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: publicAdminRoot });
});
app.use(express.static(publicAdminRoot));

const router = express.Router();

app.use("/api", router);

app.listen(port, () => {
  console.log(`Maker listening on port ${port}`);
});

//data
class Game {
  constructor(id, grid) {
    this.id = id;
    this.grid = grid;
  }
}
class Room {
  constructor(roomId, playerNumber, prevPlayer) {
    this.roomId = roomId;
    this.playerNumber = playerNumber;
    this.prevPlayer = prevPlayer;
  }
}
let GameList = [];
let RoomList = [];

router.get("/roomList", async (req, res) => {
  try {
    res.send(RoomList);
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/roomList", async (req, res) => {
  try {
    const room = req.body;
    const newRoom = new Room(room.roomId, room.playerNumber);
    RoomList.push(newRoom);
    RoomList = RoomList.filter((room) => room.playerNumber != null);

    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/gameList", async (req, res) => {
  try {
    res.send(GameList);
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/gameList", async (req, res) => {
  try {
    const game = req.body;
    const newGame = new Game(game.id, game.grid);
    GameList.push(newGame);
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
