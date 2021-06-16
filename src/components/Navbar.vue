<template>
  <nav class="navMenu">
    <router-link to="/">Home</router-link>
    <router-link to="/create">Play</router-link>
    <router-link to="/about">About</router-link>
    <div class="dot"></div>
  </nav>
</template>

<style scoped lang="scss">
.navMenu {
  position: absolute;
  top: 5%;
  left: 49%;
  transform: translate(-50%, -50%);
}

.navMenu a {
  color: rgb(255, 255, 255);
  text-decoration: none;
  font-size: 1.2em;
  text-transform: uppercase;
  font-weight: 500;
  display: inline-block;
  width: 80px;
  transition: all 0.2s ease-in-out;
}

.navMenu a:hover {
  color: red;
}

.navMenu .dot {
  width: 6px;
  height: 6px;
  background: black;
  border-radius: 50%;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.2s ease-in-out;
}

.navMenu a:nth-child(1):hover ~ .dot {
  transform: translateX(37px);
  transition: all 0.2s ease-in-out;
  opacity: 1;
}

.navMenu a:nth-child(2):hover ~ .dot {
  transform: translateX(118px);
  transition: all 0.2s ease-in-out;
  opacity: 1;
}

.navMenu a:nth-child(3):hover ~ .dot {
  transform: translateX(199px);
  transition: all 0.2s ease-in-out;
  opacity: 1;
}
</style>

<script>
export default {
  name: "Navbar",
};
</script>
