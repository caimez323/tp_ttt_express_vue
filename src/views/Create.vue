<template>
  <div id="create">
    <br />
    <br />
    <br />
    <h1 class="txtBlack">
      Click on the button to create your game and invite your friends !
    </h1>
    <button
      class="buttonBlack"
      v-on:click.once="
        gotoCreation = true;
        NewRoom();
      "
    >
      Create a game
    </button>
    <br />
    <h3 class="txtBlack">Or</h3>
    <button
      class="buttonBlack"
      v-on:click="
        GetRoomList();
        displayRoom = true;
      "
    >
      See all rooms
    </button>

    <div v-if="displayRoom">
      <p class="txtBlack">List of rooms :</p>
      <template v-for="(val, key) in roomList.length">
        <li :key="key" class="txtRoom">
          Room n°{{ roomList[key].roomId }} :
          <a
            :key="key + 0.5"
            v-bind:href="
              'http://mega-ttt.herokuapp.com/play/' + roomList[key].roomId
            "
            >Join it</a
          >
        </li>
      </template>
    </div>

    <p class="txtRed" v-if="gotoCreation && !roomRemain">
      <strong>There are currently no room available. Please try again !</strong>
    </p>
    <br />
  </div>
</template>

<script>
import axios from "axios";
//import Pickaxe from '../common/game.js';
export default {
  data: function () {
    return {
      displayRoom: false,
      gotoCreation: false,
      info: null,
      password: null,
      roomList: [],
      MAX_ROOM: 100000,
    };
  },

  methods: {
    async NewRoom() {
      this.roomList = (await axios.get("/api/roomList")).data;
      let retry = true;
      let tmp;
      //if there is no room empty, send a server a try to delete one
      if (this.roomRemain) {
        do {
          retry = false;
          tmp = Math.floor(Math.random() * this.MAX_ROOM) + 1;
          retry = this.roomList.some((room) => room.roomId === tmp);
        } while (retry);
        this.password = tmp;
        let payload = {
          roomId: tmp,
          playerNumber: 0,
        };
        let cell = {
          state: 0,
          display: 0,
        };
        let payload2 = {
          id: this.password,
          grid: [cell, cell, cell, cell, cell, cell, cell, cell, cell],
        };

        await axios.post("/api/roomList", payload);
        await axios.post("/api/gameList", payload2);
      } else {
        await axios.post("/api/roomList", { roomId: null, playerNumber: null });
      }
      this.$router.push(`/play/${this.password}`);
    },
    async GetRoomList() {
      this.roomList = (await axios.get("/api/roomList")).data;
      await axios.post("/api/roomList", { roomId: null, playerNumber: null });
    },
  },

  computed: {
    roomRemain() {
      return this.roomList.length < this.MAX_ROOM - 10;
    },
  },
};
</script>

<style lang="scss">
.buttonBlack {
  background-color: white;
  border: 2px solid #555555;
  color: black;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s; //Safari
  transition-duration: 0.4s;
  cursor: pointer;
}

.buttonBlack:hover {
  background-color: #555555;
  color: white;
}

.buttonBlack:active {
  transform: translateY(4px);
}

.txtBlack {
  color: black;
}

.txtRoom {
  color: black;
  font-size: 18px;
  text-align: center;
}

.txtRed {
  color: rgb(146, 5, 5);
  font-size: 20px;
}
</style>
