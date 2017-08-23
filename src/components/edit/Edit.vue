<template>
<div>
  <div class="qn-wrap">
    <div class="qn">
      <header class="header">
        <input type="text" class="title" placeholder="填写问卷标题" :value="title" v-model="title">
      </header>
      <div class="body">
        <div class="body-wrap">
          <ol v-if="questions.length !== 0" class="questions">
            <li
              :key="index"
              is="question"
              v-for="(q, index) in questions"
              track-by="$index"
              :q-index="index"
              :question="q"
              :class="['question', q.type]"
              @change-question-title="changeQuestionTitle"
              @change-option-value="changeOptionValue"
              @question-pos-change="questionPosChange"
              @add-option="addOption"
              @delete-option="deleteOption"
              @delete-question="deleteQuestion"
              @copy-question="copyQuestion"
              @change-text-required="changeTextRequired"
              @option-pos-change="optionPosChange"
              >
            </li>
          </ol>
          <div class="tools">
            <div class="toolbar">
              <span class="btn" @click.stop="addQuestion('radio')"><i class="icon-circle-blank"></i> 单选题</span>
              <span class="btn" @click.stop="addQuestion('checkbox')"><i class="icon-check"></i> 多选题</span>
              <span class="btn" @click.stop="addQuestion('text')"><i class="icon-file"></i> 文本题</span>
            </div>
            <div class="add-btn"><i class="icon-plus-sign"></i> 添加问题</div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="pick-date">
          <span class="msg">问卷截止日期</span>
          <calendar 
            ref='datePicker'
            @date-change="dateChange"
          ></calendar>
        </div>
        <div class="operation">
          <span class="btn" :class="{ disabled: isLoading }" @click.stop="saveBtnHandler">保存问卷</span>
          <span class="btn" :class="{ disabled: isLoading }" @click.stop="publishBtnHandler">发布问卷</span>
        </div>
      </footer>
    </div>
  </div>
  <alert :show="showAlert" placement="top" :duration=3000 type="warning" width="400px" dismissable>
    <strong>您正在离开当前页面 ...</strong>
    <p>需要先保存问卷吗？</p>
  </alert>
  <modal
    :show="showModal"
    cancel-text="取消"
    ok-text="确定"
    :callback="modalCallback"
    title="提示" >
    <div slot="modal-body">
      <div>你的问卷尚未保存，确定要放弃保存此问卷吗？</div>
    </div>
  </modal>
</div>
</template>

<script>
import Question from './Question'
import Calendar from '../common/Calendar'
import Alert from '../common/Alert'
import Modal from '../common/Modal'
import uuid from 'uuid'

export default {
  data () {
    let editMode
    if (!window.sessionStorage.getItem('edit-mode')) {
      editMode = 'create'
      window.sessionStorage.setItem('edit-mode', 'create')
    } else {
      editMode = window.sessionStorage.getItem('edit-mode')
    }
    let defaults = {
      title: '问卷题目',
      questions: [],
      showAlert: false,
      publish: false,
      showModal: false,
      routerCanDeactivate: false,
      expires: '',
      qnId: -1,
      isLoading: false
    }
    if (editMode === 'create') {
      Object.assign(defaults, { qnId: this.createId() })
    }
    return defaults
  },
  computed: {
    questionaire () {
      return {
        title: this.title,
        questions: this.questions,
        expires: this.expires,
        publish: this.publish,
        qnId: this.qnId
      }
    }
  },
  methods: {
    // 保存问卷
    saveData () {
      if (!this.isLoading) {
        let editMode = window.sessionStorage.getItem('edit-mode')
        this.isLoading = true
        window.fetch('/updateUserQnData', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `qnData=${JSON.stringify(this.questionaire)}&editMode=${editMode}`,
          credentials: 'same-origin'
        })
        .then(res => {
          return res.json()
        })
        .then(result => {
          if (result.code === 0 || result.code === 1) {
            this.canDeactivate = true
            this.$router.push({ path: '/platform/questionare' })
          } else if (result.code === -1) {
            this.canDeactivate = true
            this.$route.push({ path: '/login' })
          }
        })
      }
    },
    addQuestion (type) {
      let option = {
        title: '问题题目',
        type: type
      }
      if (type !== 'text') {
        option.answers = ['选项1', '选项2']
        option.answersData = [this.getRandomNumber(), this.getRandomNumber()]
      } else {
        option.required = false
        option.text = ''
      }
      this.questions.push(option)
    },
    transposition (arr, oldIndex, newIndex) {
      let value = arr.splice(oldIndex, 1)[0]
      arr.splice(newIndex, 0, value)
    },
    modalCallback () {
      this.canDeactivate = true
      this.$router.push({ path: '/platform/questionare' })
    },
    saveBtnHandler () {
      this.saveData()
    },
    publishBtnHandler () {
      this.publish = true
      this.saveBtnHandler()
    },
    createId () {
      return uuid.v4()
    },
    getRandomNumber () {
      return Math.floor(Math.random() * 30)
    },
    changeQuestionTitle (qIndex, value) {
      this.questions[qIndex].title = value
    },
    changeOptionValue (qIndex, oIndex, value) {
      this.questions[qIndex].answers[oIndex] = value
    },
    questionPosChange (oldIndex, newIndex) {
      this.transposition(this.questions, oldIndex, newIndex)
    },
    addOption (qIndex) {
      this.questions[qIndex].answers.push('选项' + (this.questions[qIndex].answers.length + 1))
      this.questions[qIndex].answersData.push(this.getRandomNumber())
    },
    deleteOption (qIndex, oIndex) {
      this.questions[qIndex].answers.splice(oIndex, 1)
      this.questions[qIndex].answersData.pop()
    },
    deleteQuestion (qIndex) {
      this.questions.splice(qIndex, 1)
    },
    copyQuestion (qIndex) {
      let temp = JSON.stringify(this.questions[qIndex])
      let newQ = JSON.parse(temp)
      this.questions.push(newQ)
    },
    changeTextRequired (qIndex, required) {
      this.questions[qIndex].required = required
    },
    optionPosChange (qIndex, oOldIndex, oNewIndex) {
      this.transposition(this.questions[qIndex].answers, oOldIndex, oNewIndex)
    },
    dateChange (dateValue) {
      this.expires = dateValue
    }
  },
  created () {
    let editMode = window.sessionStorage.getItem('edit-mode')
    let currentQnId = window.sessionStorage.getItem('current-qn-id')
    // 如果是编辑模式，获取要编辑的那份问卷
    if (editMode === 'modify') {
      window.fetch(`/getUserQnData?qnId=${currentQnId}`, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(response => {
        return response.json()
      })
      .then(result => {
        if (result.code === 1) {
          let qnData = result.data
          this.title = qnData.title
          this.questions = qnData.questions
          this.publish = qnData.publish
          this.expires = qnData.expires
          this.qnId = qnData.qnId
          this.$refs.datePicker.$els.datePicker.value = qnData.expires
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  components: {
    Question,
    Calendar,
    Alert,
    Modal
  },
  route: {
    canDeactivate () {
      if (!this.canDeactivate) {
        this.showModal = true
        return false
      }
      return true
    }
  }
}
</script>

