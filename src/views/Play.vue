<template>
  <div class="play">
    <h1 v-if="password == null">To join a game enter a code here</h1>
    <input
      v-if="password == null"
      v-model="message"
      placeholder="Enter the password"
    />
    <button
      v-if="password == null"
      v-on:click="
        password = message;
        SeeGameAt();
        GivePlayer();
      "
    >
      Join
    </button>
    <p v-if="password != null">Room #{{ password }}</p>
    <!--player here-->
    <div v-if="password != null && gameat != null">
      <template v-for="(val, key) in valButton">
        <button
          v-on:click="
            playThisCell(key);
            actDisplay();
          "
          class="inv"
          :key="key"
        >
          {{ key }}
          <img
            v-if="gameat.grid[key].display == 1"
            class="picture"
            src="../assets/cross.png"
          />
          <img
            v-if="gameat.grid[key].display == 2"
            class="picture"
            src="../assets/round.png"
          />
        </button>
        <br :key="key + 0.5" v-if="(key + 1) % 3 == 0" />
      </template>

      <!--
      <button v-on:click="playThisCell(0);actDisplay()" class="inv" >
        <img v-if="chemin1 == 1" class="picture" src="../assets/cross.png" />1
      </button>
      <button class="inv" >2</button>
      <button class="inv" >3</button>
      <br />
      <button class="inv" >4</button>
      <button class="inv" >5</button>
      <button class="inv" >6</button>
      <br />
      <button class="inv" >7</button>
      <button class="inv" >8</button>
      <button class="inv" >9</button>
      <br />
      -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      password: null,
      chemin1: 0,
      gameat: null,
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
    async SeeGameAt(searchid) {
      let everygame = (await axios.get("api/gameslist")).data;
      for (let index = 0; index < everygame.length; index++) {
        if (everygame[index].id == searchid) {
          this.gameat = everygame[index];
        }
      }
    },
    async playThisCell(numcell) {
      //Send the action to the server
      let payload = {
        id: this.password,
        cell: numcell,
        payloadplayer: this.player,
      };

      await axios.post("/api/play", payload);
    },

    async actDisplay() {
      if (this.password != null) {
        await this.SeeGameAt(this.password);
        /*let actgame = this.gameat;
        for (let i = 0; i < actgame.grid.length; i++) {
          if (actgame.grid[i].state == 1) {
            actgame.grid[i].display = 1;
          }
        }*/
      }
    },

    changeDisplay() {
      this.nIntervId = setInterval(this.actDisplay, 1000);
      //TODO arrêter quand le password redeviend null
    },

    stopDisplay() {
      clearInterval(this.nIntervId);
    },

    async GivePlayer() {
      let rls = (await axios.get("/api/roomlist")).data;
      console.log(rls);
      let numplayer = null;
      for (let i = 0; i < rls.length; i++) {
        if (this.password == rls[i].roomid) {
          numplayer = rls[i].playernumber;
        }
      }
      console.log(numplayer);
      let payload;
      if (numplayer == 0) {
        this.player = 1;
        payload = {
          id: this.password,
          payloadplayer: this.player,
        };
        await axios.post("/api/player", payload);
      } else if (numplayer == 1) {
        this.player = 2;
        payload = {
          id: this.password,
          payloadplayer: this.player,
        };
        await axios.post("/api/player", payload);
      } else {
        //ERROR, ROOM FULL
      }
    },
  },

  mounted() {
    this.changeDisplay();
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
