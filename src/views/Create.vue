<template>
  <div id="create">
    <h1>This is the game creation page</h1>
    <button v-on:click="gotoCreation=true;NewRoom();GetRoomList()" >Create a game</button>
      <p v-if="gotoCreation">The password is : {{password}}</p>
      <p v-if="gotoCreation">Liste des rooms : {{roomlist}}</p>
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
      roomlist:[],
      }
    },

  methods:{
    async NewRoom() {
      let RmList =[];
      RmList = (await axios.get('/api/roomlist')).data;
      
      let retry = true;
      let tmp;
        do {
          retry = false;
          tmp =Math.floor(Math.random() * 100000) + 1;
          for (let i = 0; i < RmList.length; i++) {
            if (RmList[i]== tmp) {
              retry = true;
            }
          }
        } while (retry); 
        let payload = { room: tmp};
        this.password = tmp;
        (await axios.post('/api/roomlistwrite', payload));
      },
    async GetRoomList(){
      this.roomlist= (await axios.get(`/api/roomlist`)).data;
      }
  }
}
</script>
