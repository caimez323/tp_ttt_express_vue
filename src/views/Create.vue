<template>
  <div id="create">
    <h1>This is the game creation page</h1>
    <button
      v-on:click.once="
        gotoCreation = true;
        NewRoom();
        GetRoomList();
      "
    >
      Create a game
    </button>
    <p v-if="gotoCreation">The password is : {{ password }}</p>
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
