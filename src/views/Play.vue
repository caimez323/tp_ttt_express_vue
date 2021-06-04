<template>
  <div class="play">
    <!-- TODO stop if not in game (quit via the navbar) -->

    <br v-if="!isPlaying" />

    <h1 class="txtBlack" v-if="!isPlaying">
      To join a game enter a code here or directly click the link
    </h1>
    <input
      class="txtField"
      v-if="!isPlaying"
      v-model="message"
      placeholder="Enter the password"
    />
    <button
      class="buttonBlack2"
      v-if="!isPlaying"
      v-on:click="
        password = Number(message);
        SeeGameAt(password);
        GivePlayer();
      "
    >
      Join
    </button>

    <p class="txtRed" v-if="!gameExist && isPlaying">
      This game doesn't exist.
    </p>
    <p class="txtBlack" v-if="isPlaying && gameExist">Share this link :</p>
    <p class="txtBlack" v-if="isPlaying && gameExist">
      Room <strong># {{ password }}</strong>
    </p>
    <h1 v-if="win !== 0">{{ winString }}</h1>
    <div v-if="isPlaying && gameExist">
      <template v-for="(val, key) in valButton">
        <button
          v-on:click="
            PlayThisCell(key);
            ActDisplay();
          "
          :class="isCross[key] ? 'cross' : isCircle[key] ? 'circle' : 'inv'"
          :key="key"
        >
          <img
            v-if="gameAt != null && gameAt.grid[key].display == 1"
            class="picture"
            src="../assets/cross.png"
          />
          <img
            v-if="gameAt != null && gameAt.grid[key].display == 2"
            class="picture"
            src="../assets/round.png"
          />
        </button>
        <br :key="key + 0.5" v-if="(key + 1) % 3 == 0" />
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      password: null,
      gameAt: null,
      player: null,
      nIntervId: null,
      message: null,
      win: 0,
      winString: "",
      valButton: [
        { content: 0 },
        { content: 1 },
        { content: 2 },
        { content: 3 },
        { content: 4 },
        { content: 5 },
        { content: 6 },
        { content: 7 },
        { content: 8 },
      ],
    };
  },

  methods: {
    async SeeGameAt(searchId) {
      if (this.isPlaying) {
        let everyGame = (await axios.get("api/gameList")).data;
        this.gameAt = everyGame.find((game) => game.id == searchId);
        this.isWin(this.gameAt);
        if (!this.gameExist) {
          this.StopDisplay();
        }
        console.log(this.gameAt);
      }
    },
    async PlayThisCell(numCell) {
      //Send the action to the server

      let rooms = (await axios.get("/api/roomList")).data;
      const index = rooms.findIndex((room) => room.roomId == this.password);

      //TODO The player can still spam super fast and player more than one time
      if (
        this.win === 0 &&
        rooms[index].prevPlayer !== this.player &&
        this.gameExist &&
        this.gameAt.grid[numCell].state === 0
      ) {
        let payload = {
          id: this.password,
          cell: numCell,
          payloadPlayer: this.player,
        };

        await axios.post("/api/play", payload);
        await axios.post("/api/playerTurn", {
          player: this.player,
          id: this.password,
        });
      }
    },

    async ActDisplay() {
      if (this.win === 0) {
        await this.SeeGameAt(this.password);
      }
    },

    async isWin(game) {
      // called each play
      if (game !== null && game !== undefined) {
        const gameGrid = game.grid;
        let preWin = 0;
        if (gameGrid[0].state === 1) {
          // first two possibilites of winning
          let display = gameGrid[0].display;
          if (
            gameGrid[1].display === display &&
            gameGrid[2].display === display
          ) {
            preWin = 1;
          } else if (
            gameGrid[3].display === display &&
            gameGrid[6].display === display
          ) {
            preWin = 1;
          }
        }

        if (gameGrid[8].state === 1) {
          // last two possiblities of winning
          let display = gameGrid[8].display;
          if (
            gameGrid[2].display === display &&
            gameGrid[5].display === display
          ) {
            preWin = 3;
          } else if (
            gameGrid[6].display === display &&
            gameGrid[7].display === display
          ) {
            preWin = 3;
          }
        }

        if (gameGrid[4].state === 1) {
          // We need to check the mid-vertical and the mid-horizontal then the diagonals
          let display = gameGrid[4].display;
          if (
            gameGrid[1].display === display &&
            gameGrid[7].display === display
          ) {
            //mid vertical
            preWin = 2;
          } else if (
            gameGrid[3].display === display &&
            gameGrid[5].display === display
          ) {
            //mid horizontal
            preWin = 2;
          } else if (
            gameGrid[0].display === display &&
            gameGrid[8].display === display
          ) {
            //diago up left
            preWin = 2;
          } else if (
            gameGrid[2].display === display &&
            gameGrid[6].display === display
          ) {
            //diago up right
            preWin = 2;
          }
        }
        switch (preWin) {
          case 1:
            this.win = gameGrid[0].display;
            break;
          case 2:
            this.win = gameGrid[4].display;
            break;
          case 3:
            this.win = gameGrid[8].display;
            break;
        }

        //Stop then display message if win
        if (this.win !== 0) {
          this.StopDisplay();
          this.winString = "The winner is ";
          if (this.win === 1) {
            this.winString = this.winString + "player 1 (cross)";
          } else if (this.win === 2) {
            this.winString = this.winString + "player 2 (circle)";
          }
        }
      }
    },

    ChangeDisplay() {
      this.nIntervId = setInterval(this.ActDisplay, 1000);
    },

    StopDisplay() {
      clearInterval(this.nIntervId);
    },

    async GivePlayer() {
      if (this.isPlaying) {
        let rls = (await axios.get("/api/roomList")).data;
        let numPlayer = null;

        const found = rls.find((room) => room.roomId == this.password);
        if (found !== undefined) {
          numPlayer = found.playerNumber;

          let payload;
          if (numPlayer == 0) {
            this.player = 1;
            payload = {
              id: this.password,
              payloadPlayer: this.player,
            };
            await axios.post("/api/player", payload);
          } else if (numPlayer == 1) {
            this.player = 2;
            payload = {
              id: this.password,
              payloadplayer: this.player,
            };
            await axios.post("/api/player", payload);
          } else {
            window.alert(
              "This game is full.\nYou can still watch it as a spectator."
            );
          }
        }
      }
    },

    cellToBool(condition) {
      if (this.gameExist) {
        let cellTab = this.gameAt.grid;
        cellTab = cellTab.map((x) => x.display === condition);
        return cellTab;
      }
    },
  },

  mounted() {
    this.ChangeDisplay();
  },
  computed: {
    isPlaying() {
      return this.password !== null;
    },
    isCross() {
      return this.cellToBool(1);
    },
    isCircle() {
      return this.cellToBool(2);
    },
    gameExist() {
      return this.gameAt !== undefined && this.gameAt !== null;
    },
  },
};
</script>

<style lang="scss">
.txtRed {
  color: rgb(146, 5, 5);
  font-size: 20px;
}

.inv {
  border: none;
  padding: 128px 128px;
  font-size: 10rem;
  text-align: center;
  color: white;
  border-radius: 0px;
  border: 1px solid rgb(0, 0, 0);
  background-color: rgb(255, 255, 255);
}

.inv:hover {
  background-color: rgb(210, 210, 210);
}

.picture {
  width: 242px;
  border: none;
  position: relative;
  vertical-align: 0px;
  margin-top: 0px;
}

.txtBlack {
  color: black;
}

.buttonBlack2 {
  background-color: white;
  border: 2px solid #555555;
  color: black;
  padding: 3px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s; //Safari
  transition-duration: 0.4s;
  cursor: pointer;
}

.buttonBlack2:hover {
  background-color: #555555;
  color: white;
}

.buttonBlack2:active {
  transform: translateY(4px);
}

.txtField {
  width: 10%;
  height: 23px;
}

.cross {
  vertical-align: -119.5px;
  height: 258px;
  width: 258px;
  background-color: white;
  color: white;
}
.cross:hover {
  cursor: not-allowed;
}

.circle {
  vertical-align: -119.5px;
  height: 258px;
  width: 258px;
  background-color: white;
  color: white;
}
.circle:hover {
  cursor: not-allowed;
}
</style>
