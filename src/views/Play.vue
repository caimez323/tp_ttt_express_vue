<template>
  <div class="play">
    <h1 v-if="password == null" >To join a game enter the code here</h1>
    <input v-if="password == null" v-model="message" placeholder="Enter the password">
    <button v-if="password == null" v-on:click="password = message">Join</button>
      <p v-if="password != null">Room #{{ password }}</p>
      <h v-if="password!=null" >

      <button v-on:click="chemin1=true" class="inv" typ="button"><img v-if="chemin1!=0" class="picture" src="../assets/cross.png">1</button>
      <button class="inv" typ="button">2</button>
      <button class="inv" typ="button">3</button>
      <br>
      <button class="inv" typ="button">4</button>
      <button class="inv" typ="button">5</button>
      <button class="inv" typ="button">6</button>
      <br>
      <button class="inv" typ="button">7</button>
      <button class="inv" typ="button">8</button>
      <button class="inv" typ="button">9</button>
      <br>
      </h>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      password:null,
      chemin1:0,
      }
     }
  }
</script>

<style lang="scss">
.inv {
    border:none;
    padding:128px 128px ;
    font-size: 0rem;
    text-align: center;
    color: #FFFFFF;
    border-radius: 0px;
    border:1px solid black;
    background-color: rgba(1, 0, 0, 0);
    margin-left:auto;
    margin-right:auto;
}

.picture{
  width:64px;
  position: relative;
}
</style>
