<template>
  <div class="home">
    <h1>
      <u><font size="7" face="cambia" color="black">Tic tac toe</font></u>
    </h1>
    <img alt="logo" src="../assets/logo.png" />
    <p class="bottomTxt">
      <font size="5" face="cambia" color="black"
        >Start playing <router-link to="/create">now</router-link> !
      </font>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.home {
  position: relative;
  top: 10%;
  left: 0%;
}
.bottomTxt {
  margin-top: 50px;
}
img {
  width: 15em;
  height: auto;
}
</style>
