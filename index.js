const express = require("express");
const compression = require("compression");
const cors = require("cors");

// initialize express app
const app = express();
const port = process.env.PORT || 3333;

app.use(cors());

// configure middlewares
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
