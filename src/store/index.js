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
    MAX_ROOM: 100000,
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
  },
  actions: {
    async CREATE_EMPTY_GAME_AND_ROOM() {
      let cell = {
        state: 0,
        display: 0,
      };
      let payload = {
        id: this.getters.getPassword,
        grid: [cell, cell, cell, cell, cell, cell, cell, cell, cell],
      };
      await axios.post("/api/roomList", {
        roomId: this.getters.getPassword,
        playerNumber: 0,
      });
      await axios.post("/api/gameList", payload);
    },
    async TRY_DELETE_ROOM() {
      await axios.post("/api/roomList", { roomId: -1, playerNumber: null });
    },
    async REFRESH_ACT_GAME(state) {
      let newGameAt = await axios.post("/api/certainGame", {
        id: this.getters.getPassword,
      });
      state.commit("CHANGE_GAME_ACT", newGameAt.data);
      //console.log(this.getters.getActGame); Refresh
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
    async AFTER_PLAY() {
      await axios.post("/api/remove", { id: this.getters.getPassword });
    },
    async CREATE_NEW_ROOM(state) {
      let tmp;
      const generateId = () =>
        Math.floor(Math.random() * this.getters.getMAX_ROOM) + 1;
      do {
        tmp = generateId();
      } while (this.getters.getAllRooms.some((room) => room.roomId === tmp));
      state.commit("CHANGE_PASSWORD", tmp);
      await state.dispatch("CREATE_EMPTY_GAME_AND_ROOM");
      await state.dispatch("REFRESH_ROOM_LIST");
      await state.dispatch("REFRESH_ACT_GAME");
    },
    async ADD_LEAVER() {
      await axios.post("/api/addLeaver", { id: this.getters.getPassword });
    },
  },
  modules: {},
  getters: {
    getAllRooms: (state) => state.allRooms,
    getPassword: (state) => state.password,
    getActGame: (state) => state.gameAct,
    getPlayer: (state) => state.player,
    getMAX_ROOM: (state) => state.MAX_ROOM,
  },
});
