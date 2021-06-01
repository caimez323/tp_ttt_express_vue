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
    <p v-if="gotoCreation">Liste des rooms : {{ roomlist }}</p>
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
      roomlist: null,
    };
  },

  methods: {
    async NewRoom() {
      let RmList;
      RmList = (await axios.get("/api/roomlist")).data;
      let retry = true;
      let tmp;
      do {
        retry = false;
        tmp = Math.floor(Math.random() * 100000) + 1;
        for (let i = 0; i < RmList.length; i++) {
          if (RmList[i].roomid == tmp) {
            retry = true;
          }
        }
      } while (retry);
      this.password = tmp;
      let payload = {
        roomid: tmp,
        playernumber: 0,
      };
      let cell = {
        state: 0,
        display: 0,
      };
      let payload2 = {
        id: this.password,
        grid: [cell, cell, cell, cell, cell, cell, cell, cell, cell],
      };

      await axios.post("/api/roomlistwrite", payload);
      await axios.post("/api/gameslistwrite", payload2);
    },
    async GetRoomList() {
      this.roomlist = (await axios.get(`/api/roomlist`)).data;
    },
  },
};
</script>
