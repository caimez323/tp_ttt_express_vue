<template>
  <div class="create">
    <br />
    <br />
    <br />
    <h1 class="txtBlack">
      Click on the button to create your game and invite a friend !
    </h1>

    <button
      class="buttonBlack"
      v-on:click.once="
        NewRoom();
        afterCreation = true;
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
      <template v-for="(val, key) in $store.getters.getAllRooms">
        <li :key="key" class="txtRoom">
          Room n°{{ $store.getters.getAllRooms[key].roomId }} :
          <a
            :key="key + 0.5"
            v-bind:href="'/play/' + $store.getters.getAllRooms[key].roomId"
            >Join it</a
          >
        </li>
      </template>
    </div>
    <p class="txtRed" v-if="afterCreation && !roomRemain && !displayRoom">
      <strong>There are currently no room available. Please try again !</strong>
    </p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      displayRoom: false,
      MAX_ROOM: 100000,
      afterCreation: false,
    };
  },
  methods: {
    async NewRoom() {
      this.GetRoomList();
      let retry = true;
      let tmp;
      //if there is no room empty, send a server a try to delete one
      if (this.roomRemain) {
        do {
          retry = false;
          tmp = Math.floor(Math.random() * this.MAX_ROOM) + 1;
          retry = this.$store.getters.getAllRooms.some(
            (room) => room.roomId === tmp
          );
        } while (retry);
        this.$store.commit("CHANGE_PASSWORD", tmp);
        this.$store.dispatch("CREATE_EMPTY_ROOM_PASS");
        this.$store.dispatch("CREATE_EMPTY_GAME_PASS");
        this.$router.push(`/play/${this.$store.getters.getPassword}`);
      } else {
        this.$store.dispatch("TRY_DELETE_ROOM");
      }
    },
    async GetRoomList() {
      this.$store.commit(
        "CHANGE_ALL_ROOMS",
        (await axios.get("/api/roomList")).data
      );
      this.$store.dispatch("TRY_DELETE_ROOM");
    },
  },
  computed: {
    roomRemain() {
      return this.$store.getters.getAllRooms.length < this.MAX_ROOM - 10;
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
