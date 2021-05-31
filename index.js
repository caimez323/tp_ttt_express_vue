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
router.post("/info", async (req, res) => {
  try {
    res.send(200);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Maker listening on port ${port}`);
});



//data for the game
function cell(state, display) {
  this.state = state;
  this.display = display;
}

function grid(c1,c2,c3,c4,c5,c6,c7,c8,c9) {
  this.c1 = c1;
  this.c2 = c2;
  this.c3 = c3;
  this.c4 = c4;
  this.c5 = c5;
  this.c6 = c6;
  this.c7 = c7;
  this.c8 = c8;
  this.c9 = c9;
}

function games(id, grid) {
  this.id = id;
  this.grid = grid;
}

let RoomList=[0];

let randCell = new cell(0,0);
let grid1 = new grid(randCell,randCell,randCell,randCell,randCell,randCell,randCell,randCell,randCell);
let game1 = new games(111111, grid1);
let gamesL =[];
gamesL.push(game1)


router.get("/GL", async (req, res) => {
  try {
    res.send(gamesL);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/RL", async (req, res) => {
  try {
    res.send(RoomList);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/RLW", async (req, res) => {
  try {
    const room = req.body;
    console.log(room);
    RoomList.push(room[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
