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
        GetRoomList();
      "
    >
      Create a game
      <!-- TODO Auto redirection -->
    </button>
    <p class="txtBlack" v-if="gotoCreation">
      The password is : <strong>{{ password }}</strong>
    </p>
    <p v-if="gotoCreation">Liste des rooms : {{ roomList }}</p>
    <br />
  </div>
</template>

<script>
import axios from "axios";
//import Pickaxe from '../common/game.js';
export default {
  data: function () {
    return {
      gotoCreation: false,
      info: null,
      password: null,
      roomList: null,
    };
  },

  methods: {
    async NewRoom() {
      let RmList;
      RmList = (await axios.get("/api/roomList")).data;
      let retry = true;
      let tmp;
      do {
        retry = false;
        tmp = Math.floor(Math.random() * 100000) + 1;
        //if there is no room empty, will just be stuck forever TODO
        retry = RmList.some((room) => room.roomId === tmp);
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
    },
    async GetRoomList() {
      this.roomList = (await axios.get(`/api/roomList`)).data;
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
</style>
