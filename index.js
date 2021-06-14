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
let RoomList = new Map();
let toDelete = [];
const MAX_ROOM = 100000;

router.get("/roomList", async (req, res) => {
  try {
    res.send(Array.from(RoomList.keys()));
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/certainGame", async (req, res) => {
  try {
    const { id } = req.body;
    if (id == undefined) res.status(400).send();

    const room = RoomList.get(id);
    if (room == undefined) res.status(404).send();

    res.send(room);
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
    const roomAt = RoomList.get(mouv.id);
    if (roomAt == undefined) res.status(404).send();
    if (
      (mouv.payloadPlayer !== 1 && mouv.payloadPlayer !== 2) ||
      (mouv.cell < 0 && mouv.cell > 8)
    )
      res.status(401).send();
    if (roomAt.prevPlayer !== mouv.payloadPlayer) {
      roomAt.grid[mouv.cell].state = STATE.FULL;
      roomAt.grid[mouv.cell].display = mouv.payloadPlayer;
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
    let roomAt = RoomList.get(id);
    if (roomAt === undefined) res.status(404).send();
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

router.post("/createRoom", async (req, res) => {
  try {
    const roomListKeys = Array.from(RoomList.keys());
    let tmpId;
    const generateId = () => Math.floor(Math.random() * MAX_ROOM) + 1;
    do {
      tmpId = generateId();
    } while (roomListKeys.some((id) => id === tmpId));
    RoomList.set(tmpId, {
      roomId: tmpId,
      playerNumber: 0,
      prevPlayer: 0,
      leaver: 0,
      grid: [
        { state: 0, display: 0 },
        { state: 0, display: 0 },
        { state: 0, display: 0 },
        { state: 0, display: 0 },
        { state: 0, display: 0 },
        { state: 0, display: 0 },
        { state: 0, display: 0 },
        { state: 0, display: 0 },
        { state: 0, display: 0 },
      ],
    });
    for (let index = 0; index < toDelete.length; index++) {
      RoomList.delete(toDelete[index]);
    }
    toDelete = [];

    res.send({ id: tmpId });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/delete", async (req, res) => {
  try {
    for (let index = 0; index < toDelete.length; index++) {
      RoomList.delete(toDelete[index]);
    }
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
