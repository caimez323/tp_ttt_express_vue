<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
axios;
export default {
  name: "Home",
  components: {
    Navbar,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  a {
    font-weight: bold;
    color: #112233;

    &.router-link-exact-active {
      color: #66cc99;
    }
  }
}
</style>
