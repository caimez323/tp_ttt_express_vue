import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    allRooms: [],
    allGames: [],
    password: null,
  },
  mutations: {
    CHANGE_ALL_ROOMS(state, rooms) {
      state.allRooms = rooms;
    },
    CHANGE_PASSWORD(state, newPassword) {
      state.password = newPassword;
    },
  },
  actions: {
    async CREATE_EMPTY_GAME_PASS() {
      let cell = {
        state: 0,
        display: 0,
      };
      let payload = {
        id: this.getters.getPassword,
        grid: [cell, cell, cell, cell, cell, cell, cell, cell, cell],
      };
      await axios.post("/api/gameList", payload);
    },
    async CREATE_EMPTY_ROOM_PASS() {
      let payload = {
        roomId: this.getters.getPassword,
        playerNumber: 0,
      };
      await axios.post("/api/roomList", payload);
    },
    async TRY_DELETE_ROOM() {
      await axios.post("/api/roomList", { roomId: null, playerNumber: null });
    },
  },
  modules: {},
  getters: {
    getAllRooms: (state) => state.allRooms,
    getPassword: (state) => state.password,
  },
});
