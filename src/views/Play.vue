<template>
  <div class="play">
    <br v-if="!isWin" />
    <h1 class="txtBlack" v-if="isWin && isPlaying">
      <font size="5" color="33E03A">{{ winString }}</font>
    </h1>
    <h1 class="txtBlack" v-if="gridFull">
      <font size="5" color="C40000">Draw !</font>
    </h1>
    <p class="txtRed" v-if="!gameExist && isPlaying">
      This game doesn't exist.
    </p>
    <p class="txtBlack" v-if="isPlaying && gameExist">
      <strong>Share this link : </strong>
      <a v-bind:href="url">Copy me !</a>
    </p>
    <p class="txtBlack" v-if="isPlaying && gameExist">
      Room <strong># {{ password }}</strong>
    </p>
    <template v-if="this.gameExist">
      <template v-for="(val, key) in this.$store.getters.getActGame.grid">
        <button
          v-on:click="
            playThisCell(key);
            actDisplay();
          "
          :class="isCross[key] ? 'cross' : isCircle[key] ? 'circle' : 'inv'"
          :key="key"
        >
          <img
            v-if="
              $store.getters.getActGame != null &&
              $store.getters.getActGame.grid[key].display == 1
            "
            class="picture"
            src="../assets/cross.png"
          />
          <img
            v-if="
              $store.getters.getActGame != null &&
              $store.getters.getActGame.grid[key].display == 2
            "
            class="picture"
            src="../assets/round.png"
          />
        </button>
        <br :key="key + 0.5" v-if="(key + 1) % 3 == 0" />
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: { password: Number },
  data: function () {
    return {
      nIntervId: null,
    };
  },
  methods: {
    async playThisCell(numCell) {
      //Send the action to the server
      await this.$store.dispatch("REFRESH_ROOM_LIST");
      if (
        !this.isWinwin &&
        this.gameExist &&
        this.$store.getters.getActGame.grid[numCell].state === 0 &&
        this.$store.getters.getPlayer !== null
      ) {
        await this.$store.dispatch("PLAY_A_CELL", numCell);
      }
    },
    async actDisplay() {
      if (!this.isWin) {
        await this.$store.dispatch("REFRESH_ACT_GAME");
        if (this.gridFull) {
          this.stopDisplay();
        }
      }
      if (!this.gameExist) {
        this.stopDisplay();
      }
      if (this.isWin || this.gridFull) {
        this.stopDisplay();
        this.$store.dispatch("AFTER_PLAY");
      }
    },
    changeDisplay() {
      this.nIntervId = setInterval(this.actDisplay, 1000);
    },
    stopDisplay() {
      clearInterval(this.nIntervId);
    },
    async givePlayer() {
      if (this.isPlaying) {
        await this.$store.dispatch("GIVE_PLAYER");
      }
    },
    cellToBool(condition) {
      if (this.gameExist) {
        let cellTab = this.$store.getters.getActGame.grid;
        cellTab = cellTab.map((x) => x.display === condition);
        return cellTab;
      }
    },
  },
  mounted() {
    this.$store.commit("CHANGE_PASSWORD", this.password);
    this.$store.dispatch("REFRESH_ACT_GAME");
    this.changeDisplay();
    this.givePlayer();
  },
  computed: {
    isPlaying() {
      return this.$store.getters.getPassword !== null;
    },
    isCross() {
      return this.cellToBool(1);
    },
    isCircle() {
      return this.cellToBool(2);
    },
    gameExist() {
      return (
        this.$store.getters.getActGame !== undefined &&
        this.$store.getters.getActGame !== null
      );
    },
    url() {
      return window.location.href;
    },
    gridFull() {
      return (
        this.gameExist &&
        this.$store.getters.getActGame.grid.every((cell) => cell.state == 1)
      );
    },
    isWin() {
      if (this.gameExist) {
        if (this.$store.getters.getWinner !== 0) {
          return true;
        }
      }
      return false;
    },
    winString() {
      if (this.$store.getters.getWinner === 1) {
        return "The winner is player 1 (cross)";
      } else {
        return "The winner is player 2 (circle)";
      }
    },
  },
  beforeDestroy() {
    this.stopDisplay();
    if (this.$store.getters.getPlayer != null)
      this.$store.dispatch("ADD_LEAVER");
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
.play {
  margin-top: 4%;
}
</style>
