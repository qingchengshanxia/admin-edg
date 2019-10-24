<!--
 * @Description: 
 * @Author: lhl
 * @Date: 2019-08-14 16:37:55
 * @LastEditors: lhl
 * @LastEditTime: 2019-08-20 11:52:09
 -->
<template>
  <!-- 首页1 -->
  <div class="shouye-box">
    首页
  </div>
</template>

<script>
export default {
  name: "shouye",
  data() {
    return {};
  },
  props: [],
  components: {},
  methods: {},
  computed: {
    getTableHeight() {
      return this.$store.state.globalVarFunction.tableHeight;
    }
  },
  beforeCreate() {},
  created() {},
  beforemount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {}
};
</script>
<style scoped lang="scss">
.shouye-box {
  padding: 20px;
}
</style>