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
      let everyGame = (await axios.get("api/gameList")).data;
      this.GameAt = everyGame.find((game) => game.id == searchId);
      console.log(this.GameAt);
    },
    async PlayThisCell(numCell) {
      //Send the action to the server
      let payload = {
        id: this.password,
        cell: numCell,
        payloadPlayer: this.player,
      };

      await axios.post("/api/play", payload);
    },

    async ActDisplay() {
      await this.SeeGameAt(this.password);
    },

    ChangeDisplay() {
      this.nIntervId = setInterval(this.ActDisplay, 1000);
    },

    StopDisplay() {
      //TODO stop display if win
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
