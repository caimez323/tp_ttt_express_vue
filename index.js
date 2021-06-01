const express = require("express");
const compression = require("compression");
const cors = require("cors");
const history = require('connect-history-api-fallback');

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

//data for the game

//import Game from 'common/game.js';
const Game = require("./common/game.js");
/*class Game {
  constructor(id, grid) {
    this.id = id;
    this.grid = grid;
  }
  playcell(ncell) {
    this.grid[ncell].state = 1;
  }
}*/
class Cell {
  constructor(state, display) {
    this.state = state;
    this.display = display;
  }
}
class Room {
  constructor(roomid, playernumber) {
    this.roomid = roomid;
    this.playernumber = playernumber;
  }
}

let allGames = [];
const grid0 = [
  new Cell(0, 0),
  new Cell(0, 0),
  new Cell(0, 0),
  new Cell(0, 0),
  new Cell(0, 0),
  new Cell(0, 0),
  new Cell(0, 0),
  new Cell(0, 0),
  new Cell(0, 0),
];
const game0 = new Game(0, grid0);

const room0 = new Room(0, 0);
let RoomList = [];

RoomList.push(room0);
allGames.push(game0);

router.post("/roomlistwrite", async (req, res) => {
  try {
    const room = req.body;
    const newRoom = new Room(room.roomid, room.playernumber);
    RoomList.push(newRoom);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/roomlist", async (req, res) => {
  try {
    res.send(RoomList);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/gameslistwrite", async (req, res) => {
  try {
    const game = req.body;
    const newGame = new Game(game.id, game.grid);
    allGames.push(newGame);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/gameslist", async (req, res) => {
  try {
    res.send(allGames);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/play", async (req, res) => {
  try {
    //const {id,cell,payloadplayer} = req.body;
    const mouv = req.body;

    for (let i = 0; i < allGames.length; i++) {
      if (mouv.id == allGames[i].id) {
        allGames[i].playcell(mouv.cell, mouv.payloadplayer);
      }
    }

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/player", async (req, res) => {
  try {
    //const {id,payloadplayer} = req.body;
    const modifRoom = req.body;

    for (let i = 0; i < RoomList.length; i++) {
      if (modifRoom.id == RoomList[i].roomid) {
        RoomList[i].playernumber = modifRoom.payloadplayer;
      }
    }

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
