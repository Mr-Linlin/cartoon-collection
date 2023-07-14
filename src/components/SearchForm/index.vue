<template>
  <div class="search-form">
    <div class="form-wrap">
      <template v-for="item in form">
        <div v-if="!item.slot" :key="item.key" class="form-item">
          <span class="label" :style="{ width: item.labelWidth }">{{
            item.label
          }}</span>
          <component :is="item.tag" v-if="!item.options" v-model="query[item.key]" v-bind="item.attrs"
            :style="{ width: item.inputWidth }" v-on="$listeners" />
          <component :is="item.tag" v-else v-model="query[item.key]" v-bind="item.attrs" v-on="$listeners">
            <template v-for="(v, i) in item.options">
              <el-option v-if="'defaultSelect' in item" :key="i" :label="v[item.defaultSelect[1]]"
                :value="v[item.defaultSelect[0]]" />
              <el-option v-else :key="v" :label="v" :value="v" />
            </template>
          </component>
        </div>
        <div v-else :key="item.key" class="form-item">
          <span class="label" :style="{ width: item.labelWidth }">{{
            item.label
          }}</span>
          <slot :name="item.slot" />
        </div>
      </template>
      <div class="form-item">
        <el-button size="mini" type="primary" @click="seachForm">{{btnText}}</el-button>
        <slot name="btnSlot" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    query: {
      type: Object,
      default: () => { },
    },
    defaultSelect: {
      type: Array,
      default: () => [],
    },
    btnText: {
      type: String,
      default: '查询'
    }
  },
  data() {
    return {}
  },
  methods: {
    seachForm() {
      this.$emit('seachForm', this.query)
    },
  },
}
</script>

<style scoped lang="less">
.form-wrap {
  display: flex;
  flex-wrap: wrap;

  .form-item {
    display: flex;
    align-items: center;
    margin: 10px;

    .label {
      width: 100px;
      margin-right: 10px;
      text-align: right;
    }
  }
}
</style>
