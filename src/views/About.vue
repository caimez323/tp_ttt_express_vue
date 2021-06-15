<template>
  <div>
    <p class="txt">A project made by Clement THIEBAULT</p>
    <p class="txt">Find the project on <a v-bind:href="url">github.com</a></p>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      url: "https://github.com/caimez323/tp_ttt_express_vue/",
    };
  },
};
</script>

<style lang="scss" scoped>
.txt {
  margin-left: 20px;
  text-align: left;
  font-size: 18px;
  color: rgb(0, 0, 0);
}
</style>
