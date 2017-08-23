<template>
  <li>
    <div class="content">
      <!-- 问题题目 -->
      <p @keyup="changeQuestionTitle(qIndex, $event)" class="input title" contenteditable>{{ question.title }}</p>
      <!-- 问题题目 end -->
      <!-- 所有答案 -->
      <ol v-if="question.type !== 'text'" class="answers">
        <!-- 答案 -->
        <li :key="index" v-for="(answer, index) in question.answers" class="answer">
          <!-- 选择框 -->
          <input class="select" :type="question.type" :name="'问题' + (qIndex + 1)">
          <!-- 选项内容 -->
          <div class="option">
            <div class="input-fix">
              <p
                @keyup="changeOptionValue(qIndex, index, $event)"
                @change="changeOptionValue(qIndex, index, $event)"
                class="input"
                contenteditable>{{ answer }}</p>
            </div>
            <!-- 选项工具框 -->
            <ul class="option-panel">
              <li
                @click="optionPositionFront(qIndex, index)"
                class="iconfont">↑</li>
              <li
                @click="optionPositionBack(qIndex, index)"
                class="iconfont">↓</li>
              <li
                v-show="question.answers.length > 2"
                @click="deleteOption(qIndex, index)"
                class="iconfont"><i class="icon-remove"></i></li>
            </ul>
          </div>
        </li>
      </ol>
      <!-- 所有答案 end -->
      <div @click="addOption(qIndex)" v-if="question.type !== 'text'" class="add-option">
        <i class="icon-plus-sign"></i> 添加选项</div>
      <div v-else class="option">
        <textarea class="textarea"></textarea>
        <label for="isRequired">
          <input
          @change="changeTextRequired(qIndex, $event)"
          :checked="question.required"
          class="required"
          id="isRequired"
          type="checkbox">是否必填</label>
      </div>
    </div>
    <div class="side">
      <div class="order">Q{{ qIndex + 1 }}</div>
      <ul class="opertions">
        <li
          @click="questionPositionFront(qIndex)"
          class="iconfont"><i class="icon-angle-up"></i></li>
        <li
          @click="questionPositionBack(qIndex)"
          class="iconfont"><i class="icon-angle-down"></i></li>
        <li
          @click="copyQuestion(qIndex)"
          class="iconfont"><i class="icon-copy"></i></li>
        <li
          @click="deleteQuestion(qIndex)"
          class="iconfont"><i class="icon-trash"></i></li>
      </ul>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    qIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    // 问题题目
    changeQuestionTitle (qIndex, e) {
      this.$emit('change-question-title', qIndex, e.target.textContent)
    },
    // 问题位置
    questionPositionFront (oldIndex) {
      this.$emit('question-pos-change', oldIndex, oldIndex - 1)
    },
    questionPositionBack (oldIndex) {
      this.$emit('question-pos-change', oldIndex, oldIndex + 1)
    },
    deleteQuestion (qIndex) {
      this.$emit('delete-question', qIndex)
    },
    // 选项值
    changeOptionValue (qIndex, oIndex, e) {
      this.$emit('change-option-value', qIndex, oIndex, e.target.textContent)
    },
    // 添加选项
    addOption (qIndex) {
      this.$emit('add-option', qIndex)
    },
    // 删除选项
    deleteOption (qIndex, oIndex) {
      this.$emit('delete-option', qIndex, oIndex)
    },
    copyQuestion (qIndex) {
      this.$emit('copy-question', qIndex)
    },
    changeTextRequired (qIndex, e) {
      this.$emit('change-text-required', qIndex, e.target.checked)
    },
    optionPositionFront (qIndex, oIndex) {
      this.$emit('option-pos-change', qIndex, oIndex, oIndex - 1)
    },
    optionPositionBack (qIndex, oIndex) {
      this.$emit('option-pos-change', qIndex, oIndex, oIndex + 1)
    }
  }
}
</script>
