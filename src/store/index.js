import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    allRooms: [],
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
    async DELETE_ROOM() {
      await axios.post("/api/delete");
    },
    async REFRESH_ACT_GAME(state) {
      let newGameAt = await axios.post("/api/certainGame", {
        id: this.getters.getPassword,
      });
      state.commit("CHANGE_GAME_ACT", newGameAt.data);
    },
    async REFRESH_ROOM_LIST(state) {
      state.commit("CHANGE_ALL_ROOMS", (await axios.get("/api/roomList")).data);
    },
    async GIVE_PLAYER(state) {
      const resp = (
        await axios.post("/api/addPlayer", { id: this.getters.getPassword })
      ).data;
      if (resp.resp === false) {
        window.alert(
          "This game is full.\nYou can still watch it as a spectator."
        );
      } else {
        state.commit("CHANGE_PLAYER", resp.resp);
      }
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
      const tmp = (await axios.post("/api/createRoom")).data.id;
      state.commit("CHANGE_PASSWORD", tmp);
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
    getRoomListMap: (state) => state.roomListMap,
  },
});
