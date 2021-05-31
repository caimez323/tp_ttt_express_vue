<template>
  <div id="create">
    <h1>This is the game creation page</h1>
    <button v-on:click="gotoCreation=true;NewRoom()" >Create a game</button>
      <p v-if="gotoCreation">The password is : {{password}}</p>
      <p v-if="gotoCreation">Liste des rooms {{GetRoomList()}}</p>
    <br>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function() {
    return {
      gotoCreation: false,
      info:null,
      password:null,
      }
    },

  methods:{
    async NewRoom() {
      let RmList =[];
      RmList = (await axios.get('/api/RL')).data;
      console.log(RmList);
      let retry;
      let tmp;
        do {
          retry = false;
          tmp =Math.floor(Math.random() * 10) + 1;
          for (let i = 0; i < RmList.length; i++) {
            if (RmList[i]== tmp) {
              retry = true;
            }
          }
        } while (retry); 
        RmList.push(tmp);
        (await axios.post('/api/RLW', tmp));
        this.password = tmp;
      },
    async GetRoomList(){
      return (await axios.get(`/api/RL`)).data;
      }
  }
}
</script>
