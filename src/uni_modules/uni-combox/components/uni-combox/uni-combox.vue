<template>
  <view class="uni-combox" :class="border ? '' : 'uni-combox__no-border'">
    <view v-if="label" class="uni-combox__label" :style="labelStyle">
      <text>{{ label }}</text>
    </view>
    <view class="uni-combox__input-box">
      <input
        class="uni-combox__input"
        type="text"
        :placeholder="placeholder"
        placeholder-class="uni-combox__input-plac"
        v-model="inputVal"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <text class="iconfont icon-a-tiaozhuanjiantoutiaoyemianyong text-gray text-28"></text>
      <!-- <uni-icons :type="showSelector? 'top' : 'bottom'" size="14" color="#999" @click="toggleSelector">
			</uni-icons> -->
    </view>
    <!-- penny && !(isInput && filterCandidatesLength === 0) 添加判断 当可输入时，没有匹配项时，不显示选择框 -->
    <view
      class="uni-combox__selector"
      :class="['bg-theme-sub-' + $thirdConfigS.themeConfig.className, 'border-theme-' + $thirdConfigS.themeConfig.className]"
      v-if="showSelector && !(isInput && filterCandidatesLength === 0)"
    >
      <view class="uni-popper__arrow"></view>
      <scroll-view scroll-y="true" class="uni-combox__selector-scroll">
        <view class="uni-combox__selector-empty" v-if="filterCandidatesLength === 0">
          <text>{{ emptyTips }}</text>
        </view>
        <view class="uni-combox__selector-item" v-for="(item, index) in filterCandidates" :key="index" @click="onSelectorClick(index)">
          <text>{{ item[`${labelKey}`] }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
/**
 * Combox 组合输入框
 * @description 组合输入框一般用于既可以输入也可以选择的场景
 * @tutorial https://ext.dcloud.net.cn/plugin?id=1261
 * @property {String} label 左侧文字
 * @property {String} labelWidth 左侧内容宽度
 * @property {String} placeholder 输入框占位符
 * @property {Array} candidates 候选项列表
 * @property {String} emptyTips 筛选结果为空时显示的文字
 * @property {String} value 组合框的值
 */
export default {
  name: 'uniCombox',
  emits: ['input', 'update:modelValue'],
  props: {
    border: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '',
    },
    labelWidth: {
      type: String,
      default: 'auto',
    },
    placeholder: {
      type: String,
      default: '',
    },
    candidates: {
      type: Array,
      default() {
        return [];
      },
    },
    emptyTips: {
      type: String,
      default: '无匹配项',
    },
    labelKey: {
      type: String,
      default: 'dictName',
    },
    valueKey: {
      type: String,
      default: 'dictId',
    },
    isInput: {
      //penny添加
      type: Boolean,
      default: false,
    },
    // #ifndef VUE3
    value: {
      type: [String, Number],
      default: '',
    },
    // #endif
    // #ifdef VUE3
    modelValue: {
      type: [String, Number],
      default: '',
    },
    // #endif
  },
  data() {
    return {
      showSelector: false,
      inputVal: '',
      dictVal: '',
      filterCandidates: [],
    };
  },
  computed: {
    ...mapState(['$thirdConfigS']),
    labelStyle() {
      if (this.labelWidth === 'auto') {
        return '';
      }
      return `width: ${this.labelWidth}`;
    },
    // 为了点击选择能够显示所有选项，把这个filterCandidates放在data中
    // filterCandidates() {
    // 	return this.candidates.filter((item) => {
    // 		console.log(item,this.labelKey)
    // 		return item[`${this.labelKey}`].toString().indexOf(this.inputVal) > -1
    // 	})
    // },
    filterCandidatesLength() {
      return this.filterCandidates.length;
    },
  },
  watch: {
    // #ifndef VUE3
    value: {
      handler(newVal) {
        this.dictVal = newVal;
        /*交互优化penny  有初始化值，或手动改动value值时，inputVal可以正确展示*/
        if (newVal == '') {
          this.inputVal = '';
        } else {
          this.candidates.forEach((item) => {
            if (item[`${this.valueKey}`] == newVal) {
              this.inputVal = item[`${this.labelKey}`];
            }
          });
        }
      },
      immediate: true,
    },
    // #endif
    // #ifndef VUE3
    // 因为获取列表是个异步的过程，需要对列表进行监听
    candidates: function (arr) {
      if (arr.length > 0 && this.dictVal) {
        let obj = arr.find((item, index) => {
          return this.dictVal == item[`${this.valueKey}`];
        });
        this.inputVal = obj[`${this.labelKey}`];
      }
      this.filterCandidates = arr.filter((item) => {
        return item[`${this.labelKey}`].toString().indexOf(this.inputVal) > -1;
      });
      // console.log("#####",this.filterCandidates)
    },
    // #endif
    // #ifdef VUE3
    modelValue: {
      handler(newVal) {
        // this.inputVal = newVal
        if (this.candidates.length > 0) {
          let obj = this.candidates.find((item, index) => {
            return newVal == item[`${this.valueKey}`];
          });
          this.inputVal = obj[`${this.labelKey}`];
        }
      },
      immediate: true,
    },
    // #endif
  },
  methods: {
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
    onFocus() {
      this.filterCandidates = this.candidates;
      this.showSelector = true;
    },
    onBlur() {
      setTimeout(() => {
        this.showSelector = false;
      }, 153);
    },
    onSelectorClick(index) {
      this.dictVal = this.filterCandidates[index][`${this.valueKey}`];
      //this.dictVal 的赋值一定要在this.inputVal前执行，
      //因为this.filterCandidates会监听this.inputVal的变化被重新赋值
      //这样在选择列表中非第一个选项会报错
      this.inputVal = this.filterCandidates[index][`${this.labelKey}`];
      this.showSelector = false;
      this.$emit('input', this.dictVal, this.filterCandidates[index]);
      this.$emit('update:modelValue', this.dictVal);
    },
    onInput() {
      const _this = this;
      this.filterCandidates = this.candidates.filter((item) => {
        // console.log(item,this.labelKey)
        return item[`${this.labelKey}`].toString().indexOf(this.inputVal) > -1;
      });
      setTimeout(() => {
        /* 优化penny  问题描述：
                    从下拉框选了值后，删除输入框的值，value还是上次选择的值 并没有清空， 优化成 会清空
                    如果不选择直接输入正确的值，value没有值     优化成 value会赋上值
                    */
        _this.dictVal = '';
        if (!_this.isInput) {
          //不是可输入的模糊搜索下拉框时
          let flag = true;
          //输入的值在下拉中存在时，给dictVal赋值
          _this.filterCandidates.forEach((item, index) => {
            if (item[`${_this.labelKey}`] == _this.inputVal) {
              _this.dictVal = item[`${_this.valueKey}`];
              _this.$emit('input', _this.dictVal, _this.filterCandidates[index]);
              flag = false;
            }
          });
          if (flag) {
            _this.$emit('input', _this.dictVal, {});
          }
        }
        //isInput为true时，可输入的模糊搜索下拉框  输入框的值在下拉里没有，该值也是有效的
        if (_this.isInput) {
          if (!_this.dictVal) {
            _this.dictVal = _this.inputVal;
          }
          //true代表当前是输入 不是选择下拉里的值
          _this.$emit('input', _this.dictVal, {}, true);
        }

        _this.$emit('update:modelValue', _this.dictVal);
      });
    },
  },
};
</script>

<style lang="scss">
.uni-combox {
  font-size: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 6px 0;
  // padding-right:5px;
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  // height: 40px;
  flex-direction: row;
  align-items: center;
  // border-bottom: solid 1px #DDDDDD;
  // .icon-a-tiaozhuanjiantoutiaoyemianyong{
  //     margin-right:2rpx;
  // }
}

.uni-combox__label {
  font-size: 16px;
  line-height: 22px;
  padding-right: 10px;
  color: #999999;
}

.uni-combox__input-box {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  flex-direction: row;
  align-items: center;
}

.uni-combox__input {
  flex: 1;
  font-size: 16px;
  height: 22px;
  line-height: 22px;
  // margin-right: 10rpx;
}

.uni-combox__input-plac {
  font-size: 30rpx;
  color: #b3b3b3;
}

.uni-combox__selector {
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 99;
  padding: 4px 0;
}

.uni-combox__selector-scroll {
  /* #ifndef APP-NVUE */
  max-height: 200px;
  box-sizing: border-box;
  /* #endif */
}

.uni-combox__selector-empty,
.uni-combox__selector-item {
  /* #ifndef APP-NVUE */
  // display: flex;
  cursor: pointer;
  /* #endif */
  line-height: 36px;
  font-size: 16px;
  text-align: center;
  // border-bottom: solid 1px #DDDDDD;
  padding: 0px 10px;
}

.uni-combox__selector-item:hover {
  background-color: #f9f9f9;
}

.uni-combox__selector-empty:last-child,
.uni-combox__selector-item:last-child {
  /* #ifndef APP-NVUE */
  border-bottom: none;
  /* #endif */
}

// picker 弹出层通用的指示小三角
.uni-popper__arrow,
.uni-popper__arrow::after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 6px;
}

.uni-popper__arrow {
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  top: -6px;
  right: 10%;
  margin-right: 3px;
  border-top-width: 0;
  border-bottom-color: #ebeef5;
}

.uni-popper__arrow::after {
  content: ' ';
  top: 1px;
  margin-left: -6px;
  border-top-width: 0;
  border-bottom-color: #fff;
}

.uni-combox__no-border {
  border: none;
}
</style>
