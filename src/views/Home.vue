<template>
  <div class="home">
    <h1>Tic tac toe</h1>
    <img alt="logo" src="../assets/logo.png" />
    <a class="txtAbout" v-bind:href="url">About</a>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      url: window.location.href + "about",
    };
  },
};
</script>

<style lang="scss" scoped>
img {
  width: 15em;
  height: auto;
}
.txtAbout {
  color: rgb(3, 3, 65);
  position: absolute;
  bottom: 50px;
  left: 50px;
}
</style>
