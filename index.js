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
let GameList = new Map();
let RoomList = new Map();
let toDelete = [];

router.post("/roomList", async (req, res) => {
  try {
    const room = req.body;

    if (room.roomId === null || room.roomId === undefined)
      res.status(400).send();
    if (RoomList.has(room.roomId)) res.status(400).send();
    RoomList.set(room.roomId, {
      roomId: room.roomId,
      playerNumber: room.playerNumber,
      prevPlayer: 0,
      leaver: 0,
    });
    if (room.playerNumber === null || room.leaver === 2)
      toDelete.push(room.roomId);
    //TODO change the for for other thing
    for (let index = 0; index < toDelete.length; index++) {
      RoomList.delete(toDelete[index]);
      GameList.delete(toDelete[index]);
    }
    toDelete = [];
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/roomList", async (req, res) => {
  try {
    res.send(Array.from(RoomList.keys()));
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
    GameList.set(game.id, { id: game.id, grid: game.grid });
    // const newGame = new Game(game.id, game.grid);
    // GameList.push(newGame);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/certainGame", async (req, res) => {
  try {
    const { id } = req.body;
    if (id == undefined) res.status(400).send();

    const game = GameList.get(id);
    if (game == undefined) res.status(404).send();

    res.send(game);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/addPlayer", async (req, res) => {
  try {
    const reqId = req.body;
    const roomFound = RoomList.get(reqId.id);
    if (roomFound === undefined) res.status(404).send();
    if (roomFound.playerNumber < 2) {
      roomFound.playerNumber += 1;
      res.send({ resp: roomFound.playerNumber });
    } else if (roomFound.playerNumber >= 2) {
      res.send({ resp: false });
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/gamePlay", async (req, res) => {
  try {
    const mouv = req.body;
    const gameAt = GameList.get(mouv.id);
    const roomAt = RoomList.get(mouv.id);
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
    let gameAt = GameList.get(id);
    let roomAt = RoomList.get(id);
    if (gameAt === undefined || roomAt === undefined) res.status(404).send();
    toDelete.push(id);
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
    let roomAt = RoomList.get(id);
    if (roomAt === undefined) res.status(404).send();
    roomAt.leaver += 1;
    if (roomAt.leaver == 2) toDelete.push(id);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/roomListMap", async (req, res) => {
  try {
    res.send(RoomList);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
