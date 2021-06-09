<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/create">Create a new game</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped lang="scss">
nav {
  padding: 30px;
  ul {
    list-style-type: none;
    li {
      display: inline-block;
      padding-right: 1em;
      margin-right: 1em;
      border-right: 2px solid #112233;

      &:last-child {
        padding: 0;
        margin: 0;
        border: none;
      }
    }
  }
}
</style>
