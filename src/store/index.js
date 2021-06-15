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
      let newGameAt;
      try {
        newGameAt = await axios.post("/api/certainGame", {
          id: this.getters.getPassword,
        });
      } catch (err) {
        state.dispatch("DISPLAY_ERROR", err.response.status);
      }
      state.commit("CHANGE_GAME_ACT", newGameAt.data);
    },
    async REFRESH_ROOM_LIST(state) {
      state.commit("CHANGE_ALL_ROOMS", (await axios.get("/api/roomList")).data);
    },
    async GIVE_PLAYER(state) {
      let resp;
      try {
        resp = (
          await axios.post("/api/addPlayer", { id: this.getters.getPassword })
        ).data; //401
      } catch (err) {
        state.dispatch("DISPLAY_ERROR", err.response.status);
      }
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
      try {
        await axios.post("/api/gamePlay", payload);
      } catch (err) {
        state.dispatch("DISPLAY_ERROR", err.response.status);
      }
    },
    async AFTER_PLAY(state) {
      try {
        await axios.post("/api/remove", { id: this.getters.getPassword });
      } catch (err) {
        state.dispatch("DISPLAY_ERROR", err.response.status);
      }
    },
    async CREATE_NEW_ROOM(state) {
      const tmp = (await axios.post("/api/createRoom")).data.id;
      state.commit("CHANGE_PASSWORD", tmp);
      await state.dispatch("REFRESH_ROOM_LIST");
      await state.dispatch("REFRESH_ACT_GAME");
    },
    async ADD_LEAVER(state) {
      try {
        await axios.post("/api/addLeaver", { id: this.getters.getPassword });
      } catch (err) {
        state.dispatch("DISPLAY_ERROR", err.response.status);
      }
    },
    DISPLAY_ERROR(state, numError) {
      switch (numError) {
        case 400:
          window.alert("Cannot accept your request");
          break;
        case 401:
          window.alert("This is not your turn !");
          break;
        case 404:
          window.alert("Cannot found your request");
          break;
      }
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
    getWinner(state) {
      const gameGrid = state.gameAct.grid;
      let preWin = 0;
      if (gameGrid[0].state === 1) {
        // first two possibilites of winning
        let display = gameGrid[0].display;
        if (
          gameGrid[1].display === display &&
          gameGrid[2].display === display
        ) {
          preWin = 1;
        } else if (
          gameGrid[3].display === display &&
          gameGrid[6].display === display
        ) {
          preWin = 1;
        }
      }
      if (gameGrid[8].state === 1) {
        // last two possiblities of winning
        let display = gameGrid[8].display;
        if (
          gameGrid[2].display === display &&
          gameGrid[5].display === display
        ) {
          preWin = 3;
        } else if (
          gameGrid[6].display === display &&
          gameGrid[7].display === display
        ) {
          preWin = 3;
        }
      }
      if (gameGrid[4].state === 1) {
        // We need to check the mid-vertical and the mid-horizontal then the diagonals
        let display = gameGrid[4].display;
        if (
          gameGrid[1].display === display &&
          gameGrid[7].display === display
        ) {
          //mid vertical
          preWin = 2;
        } else if (
          gameGrid[3].display === display &&
          gameGrid[5].display === display
        ) {
          //mid horizontal
          preWin = 2;
        } else if (
          gameGrid[0].display === display &&
          gameGrid[8].display === display
        ) {
          //diago up left
          preWin = 2;
        } else if (
          gameGrid[2].display === display &&
          gameGrid[6].display === display
        ) {
          //diago up right
          preWin = 2;
        }
      }

      if (preWin === 0) return preWin;
      return gameGrid[(preWin - 1) * 4].display;
    },
  },
});
