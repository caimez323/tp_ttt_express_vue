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
const STATE = { EMPTY: 0, FULL: 1 };
class Game {
  constructor(id, grid) {
    this.id = id;
    this.grid = grid;
  }
}
class Room {
  constructor(roomId, playerNumber, prevPlayer, leaver) {
    this.roomId = roomId;
    this.playerNumber = playerNumber;
    this.prevPlayer = prevPlayer;
    this.leaver = leaver;
  }
}
let GameList = [];
let RoomList = [];

router.post("/roomList", async (req, res) => {
  try {
    const room = req.body;
    if (room.roomId === null || room.roomId === undefined)
      res.status(400).send();
    if (RoomList.some((anyRoom) => anyRoom.roomId === room.roomId))
      res.status(400).send();
    const newRoom = new Room(room.roomId, room.playerNumber, 0, 0);
    RoomList.push(newRoom);
    RoomList = RoomList.filter(
      (room) => room.playerNumber !== null && room.leaver !== 2
    );
    GameList = GameList.filter((game) =>
      RoomList.some((room) => room.roomId === game.id)
    );
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/roomList", async (req, res) => {
  try {
    res.send(RoomList);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/gameList", async (req, res) => {
  try {
    const game = req.body;
    if (game.grid.length !== 9 || game.id === undefined || game.id === null)
      res.status(400).send();
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
    const found = RoomList.find((room) => room.roomId === modifRoom.id);
    if (
      found === undefined ||
      (modifRoom.payloadPlayer !== 1 && modifRoom.payloadPlayer !== 2)
    )
      res.status(404).send;
    found.playerNumber = modifRoom.payloadPlayer;
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/gamePlay", async (req, res) => {
  try {
    const mouv = req.body;
    const gameAt = GameList.find((game) => game.id === mouv.id);
    const roomAt = RoomList.find((rooms) => rooms.roomId === mouv.id);
    if (gameAt == undefined || roomAt == undefined) res.status(404).send();
    if (
      (mouv.payloadPlayer !== 1 && mouv.payloadPlayer !== 2) ||
      (mouv.cell < 0 && mouv.cell > 8)
    )
      res.status(401).send();
    if (roomAt.prevPlayer !== mouv.payloadPlayer) {
      gameAt.grid[mouv.cell].state = STATE.FULL;
      gameAt.grid[mouv.cell].display = mouv.payloadPlayer;
      roomAt.prevPlayer = mouv.payloadPlayer;
      res.send(200);
    } else {
      res.status(401).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/remove", async (req, res) => {
  try {
    const { id } = req.body;
    if (id === undefined) res.status(400).send();
    let gameAt = GameList.find((game) => game.id === id);
    let roomAt = RoomList.find((room) => room.roomId === id);
    if (gameAt === undefined || roomAt === undefined) res.status(404).send();
    roomAt.playerNumber = null;
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/addLeaver", async (req, res) => {
  try {
    const { id } = req.body;
    if (id === undefined) res.status(400).send();
    let roomAt = RoomList.find((room) => room.roomId === id);
    if (roomAt === undefined) res.status(404).send();
    roomAt.leaver += 1;
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
