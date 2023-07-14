<template>
  <div class="search_tabs_pc" :style="{ marginBottom: mb }">
    <div class="search_tabs_out">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(tabItem, index) in tabs"
          :key="index"
          :name="tabItem.label.toString() || tabItem.name || tabItem.value"
        >
          <span slot="label"
            >{{ tabItem.value || tabItem.label }}
            <span v-if="tabItem.count" class="tab-count">{{
              tabItem.count
            }}</span></span
          >
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    mb: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeName: null,
    }
  },
  watch: {
    tabs: {
      handler() {
        if (this.tabs.length !== 0) {
          this.activeName =
            this.tabs[0].label.toString() ||
            this.tabs[0].name ||
            this.tabs[0].value
        }
      },
      deep: true,
    },
  },
  methods: {
    handleClick(e) {
      this.activeName = e.name.toString()
      this.$emit('tab-click', this.activeName)
    },
  },
}
</script>

<style lang="less" scoped>
.search_tabs_out {
  background: #fff;
  box-sizing: border-box;
  padding: 0px 30px;
  border-bottom: 1px solid #eff0f5;
  // height: 25;

  /deep/.el-tabs__nav-wrap::after {
    height: 0px !important;
  }
  /deep/.el-tabs__header {
    margin: 0px !important;
  }
  /deep/.el-tabs__item {
    height: 50px !important;
    line-height: 50px !important;
    font-weight: 700px;
  }
  /deep/.el-tabs__item {
    position: relative;
  }
  .tab-count {
    position: absolute;
    display: inline-block;
    min-width: 30px;
    line-height: 16px;
    background-color: #f53f3f;
    color: #ffffff;
    font-size: 12px;
    text-align: center;
    border-radius: 8px;
    top: 10px;
    right: -5px;
  }
}
</style>
