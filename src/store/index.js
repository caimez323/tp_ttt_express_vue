import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    allRooms: [],
    allGames: [],
    password: null,
    gameAct: null,
    player: null,
  },
  mutations: {
    CHANGE_ALL_ROOMS(state, rooms) {
      state.allRooms = rooms;
    },
    CHANGE_PASSWORD(state, newPassword) {
      state.password = newPassword;
    },
    CHANGE_GAME_ACT(state, gameAct) {
      state.gameAct = gameAct;
    },
    CHANGE_PLAYER(state, newPlayer) {
      state.player = newPlayer;
    },
    CHANGE_WINNER(state, playerWinner) {
      state.winner = playerWinner;
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
    async REFRESH_ACT_GAME(state) {
      let newGameAt = await axios.post("/api/certainGame", {
        id: this.getters.getPassword,
      });
      state.commit("CHANGE_GAME_ACT", newGameAt.data);
      console.log(this.getters.getActGame);
    },
    async REFRESH_ROOM_LIST(state) {
      state.commit("CHANGE_ALL_ROOMS", (await axios.get("/api/roomList")).data);
    },
    async GIVE_PLAYER(state, playerPresent) {
      state.commit("CHANGE_PLAYER", playerPresent + 1);
      let payload = {
        id: this.getters.getPassword,
        payloadPlayer: this.getters.getPlayer,
      };
      axios.post("/api/addPlayer", payload);
    },
    async PLAY_A_CELL(state, numCell) {
      let payload = {
        id: this.getters.getPassword,
        cell: numCell,
        payloadPlayer: this.getters.getPlayer,
      };
      await axios.post("/api/gamePlay", payload);
    },
    async CLEAR_PLAYER() {
      await axios.post("/api/addPlayer", {
        id: this.getters.getPassword,
        payloadPlayer: null,
      });
    },
    async AFTER_PLAY() {
      await axios.post("/api/remove", { id: this.getters.getPassword });
    },
  },
  modules: {},
  getters: {
    getAllRooms: (state) => state.allRooms,
    getPassword: (state) => state.password,
    getActGame: (state) => state.gameAct,
    getPlayer: (state) => state.player,
  },
});
