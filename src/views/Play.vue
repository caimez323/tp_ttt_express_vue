<template>
  <div class="play">
    <h1 v-if="!isPlaying">To join a game enter a code here</h1>
    <input
      v-if="!isPlaying"
      v-model="message"
      placeholder="Enter the password"
    />
    <button
      v-if="!isPlaying"
      v-on:click="
        password = Number(message);
        SeeGameAt();
        GivePlayer();
      "
    >
      Join
    </button>
    <p v-if="isPlaying">Room #{{ password }}</p>
    <h1 v-if="win !== 0">{{ winString }}</h1>
    <div v-if="isPlaying">
      <template v-for="(val, key) in valButton">
        <button
          v-on:click="
            PlayThisCell(key);
            ActDisplay();
          "
          class="inv"
          :key="key"
        >
          {{ key }}
          <img
            v-if="GameAt != null && GameAt.grid[key].display == 1"
            class="picture"
            src="../assets/cross.png"
          />
          <img
            v-if="GameAt != null && GameAt.grid[key].display == 2"
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
      GameAt: null,
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
        this.GameAt = everyGame.find((game) => game.id == searchId);
        this.isWin(this.GameAt);
        console.log(this.GameAt);
      }
    },
    async PlayThisCell(numCell) {
      //Send the action to the server
      if (this.win === 0) {
        let payload = {
          id: this.password,
          cell: numCell,
          payloadPlayer: this.player,
        };

        await axios.post("/api/play", payload);
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
      let rls = (await axios.get("/api/roomList")).data;
      let numPlayer = null;

      const found = rls.find((room) => room.roomId == this.password);
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
    },
  },

  mounted() {
    this.ChangeDisplay();
  },
  computed: {
    isPlaying() {
      return this.password !== null;
    },
  },
};
</script>

<style lang="scss">
.inv {
  border: none;
  padding: 128px 128px;
  font-size: 0rem;
  text-align: center;
  color: #ffffff;
  border-radius: 0px;
  border: 1px solid rgb(0, 0, 0);
  background-color: rgba(1, 0, 0, 0);
  margin-left: auto;
  margin-right: auto;
}

.picture {
  width: 64px;
  position: relative;
}
</style>
