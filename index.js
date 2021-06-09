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

router.post("/roomList", async (req, res) => {
  try {
    const room = req.body;
    const newRoom = new Room(room.roomId, room.playerNumber, 0);
    RoomList.push(newRoom);
    RoomList = RoomList.filter((room) => room.playerNumber !== null);
    GameList = GameList.filter((game) => game.grid[0].state !== 9);

    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/roomList", async (req, res) => {
  try {
    res.send(RoomList);
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

router.post("/certainGame", async (req, res) => {
  try {
    const { id } = req.body;
    if (id == undefined) res.status(400).send();

    const game = GameList.find((game) => game.id === id);
    if (game == undefined) res.status(404).send();

    res.send(game);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/addPlayer", async (req, res) => {
  try {
    const modifRoom = req.body;
    const index = RoomList.findIndex((room) => room.roomId === modifRoom.id);
    RoomList[index].playerNumber = modifRoom.payloadPlayer;
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/gamePlay", async (req, res) => {
  try {
    const mouv = req.body;
    const indexG = GameList.findIndex((game) => game.id === mouv.id);
    const indexR = RoomList.findIndex((rooms) => rooms.roomId === mouv.id);
    if (RoomList[indexR].prevPlayer !== mouv.payloadPlayer) {
      GameList[indexG].grid[mouv.cell].state = 1;
      GameList[indexG].grid[mouv.cell].display = mouv.payloadPlayer;
      RoomList[indexR].prevPlayer = mouv.payloadPlayer;
    } else {
      window.alert("ERROR. This is not your turn !");
    }

    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/remove", async (req, res) => {
  try {
    const { id } = req.body;
    let gameAt = GameList.find((game) => game.id === id);
    let roomAt = RoomList.find((room) => room.roomId === id);
    gameAt.grid[0].state = 9;
    roomAt.playerNumber = null;
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
