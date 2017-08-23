<template>
  <!-- 问卷列表开始 -->
  <div class="wrap">
    <table class="table" v-if="qnData.length !== 0">
      <thead>
        <th></th>
        <th>问卷名</th>
        <th>结束时间</th>
        <th>状态</th>
        <th>操作</th>
      </thead>
      <tbody>
        <!-- 问卷列表 -->
        <tr :key="qn.qnId" v-for="qn in qnData">
          <td><i @click.stop="toggleSelected(qn.qnId)" :class="inArray(qnSelected, qn.qnId)?'icon-check':'icon-check-empty'"></i></td>
          <td>{{qn.title}}</td>
          <td><time class="time" :class="filterClass(qn)">{{qn.expires}}</time></td>
          <td><span class="status" :class="filterClass(qn)">{{ judgeStatus(qn) }}</span></td>
          <td>
            <div class="tools">
              <i @click.stop="deleteBtnClickHandler(qn)" class="icon-trash delete"></i>
              <span class="btn" @click.stop="editQn(qn)">编辑</span>
              <span class="btn" :class="{ disabled : !qn.publish }">{{ '查看数据' }}</span>
            </div>
          </td>
        </tr>
        <!-- 问卷列表 end -->
      </tbody>
    </table>
    <div class="btn-group" v-if="qnData.length !== 0">
      <button class="btn" @click="selectAll">{{ isSelectAll ? '全选' : '全不选' }}</button>
      <button class="btn" @click="deleteSelectedBtnHandler">删除</button>
    </div>
    <div class="tips" v-else>
      <div class="content">
        <p><i class="iconfont icon-reorder"></i></p>
        <p>你还没添加任何问卷</p>
      </div>
    </div>
    <!-- 删除一份问卷 -->
    <v-modal
      :show="showDeleteModal"
      cancel-text="取消"
      ok-text="确定"
      :callback="deleteQnModalHandler"
      title="提示" >
      <div slot="modal-body">
        <p>你确定要删除 <span style="{color: '#999'}">{{ qnTitleIfDelete }}</span> 这份问卷吗？</p>
      </div>
    </v-modal>
    <!-- 删除一份问卷 end -->
    <!-- 删除多份问卷 -->
    <v-modal
      :show="showDeleteSelectedModal"
      cancel-text="取消"
      ok-text="确定"
      :callback="deleteSelectedHandler"
      title="提示" >
      <div slot="modal-body">
        <p>你确定要删除这 <span style="{color: '#999'}">{{ qnSelected.length }}</span> 份问卷吗？</p>
      </div>
    </v-modal>
    <!-- 删除多份问卷 end -->
  </div>
  <!-- 问卷列表结束 -->
</template>

<script>
import VModal from '@/components/common/Modal'
export default {
  name: 'VQuestionare',
  data () {
    return {
      qnData: [],
      qnSelected: [],
      showDeleteModal: false,
      qnTitleIfDelete: '',
      qnIdIfDelete: -1,
      showDeleteSelectedModal: false
    }
  },
  computed: {
    isSelectAll () {
      return this.qnSelected.length !== this.qnData.length
    }
  },
  components: {
    VModal
  },
  created () {
    this.getQnData()
  },
  methods: {
    getQnData () {
      window.fetch('/getUserQnData', {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(response => {
        return response.json()
      })
      .then(result => {
        if (result.code === 0) {
          this.qnData = result.data
          console.log(this.qnData)
        }
        if (result.code === -2) {
          this.$router.push({ path: '/login' })
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    inArray (arr, val) {
      if (arr && arr.length > 0) {
        let result = arr.some(item => val === item)
        return result
      } else {
        return false
      }
    },
    // 选中某个问卷
    addSelected (qnId) {
      this.qnSelected.push(qnId)
    },
    // 取消选中某个问卷
    deleteSelected (qnId) {
      this.qnSelected.some((item, itemIndex) => {
        if (item === qnId) {
          this.qnSelected.splice(itemIndex, 1)
          return true
        }
      })
    },
    toggleSelected (qnId) {
      if (this.inArray(this.qnSelected, qnId)) {
        this.deleteSelected(qnId)
      } else {
        this.addSelected(qnId)
      }
    },
    // 点击删除某个问卷的按钮
    deleteBtnClickHandler (qn) {
      this.showDeleteModal = true
      this.qnTitleIfDelete = qn.title
      this.qnIdIfDelete = qn.qnId
    },
    // 确定删除某个问卷
    deleteQnModalHandler () {
      this.showDeleteModal = false
      this.deleteQn(this.qnIdIfDelete)
    },
    // 点击删除多个问卷按钮
    deleteSelectedBtnHandler () {
      if (this.qnSelected.length !== 0) {
        this.showDeleteSelectedModal = true
      }
    },
    // 确定删除多个问卷
    deleteSelectedHandler () {
      this.showDeleteSelectedModal = false
      this.deleteAll()
    },
    deleteQn (qnId) {
      let self = this
      window.fetch('/deleteUserQn', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `qnId=${qnId}`,
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json()
      })
      .then(result => {
        if (result.code === 1) {
          self.getQnData()
          self.qnSelected = []
        }
      })
    },
    selectAll () {
      if (this.qnSelected.length === this.qnData.length) {
        this.qnSelected = []
      } else {
        this.qnSelected = []
        let len = this.qnData.length
        let i = 0
        while (i < len) {
          this.qnSelected.push(this.qnData[i].qnId)
          i++
        }
      }
    },
    deleteAll () {
      let self = this
      window.fetch('/deleteUserQn', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `qnList=${JSON.stringify(this.qnSelected)}`,
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json()
      })
      .then(result => {
        if (result.code === 0) {
          self.getQnData()
          // 隐藏 Modal
          self.qnSelected = []
        }
      })
    },
    editQn (qn) {
      window.sessionStorage.setItem('edit-mode', 'modify')
      window.sessionStorage.setItem('current-qn-id', qn.qnId)
      this.$router.push({ path: '/platform/new/edit' })
    },
    judgeStatus (qn) {
      let qnExpires = new Date(qn.expires).getTime()
      if (qnExpires < new Date().getTime()) {
        return '已过期'
      } else if (qn.publish) {
        return '已发布'
      }
      return '未发布'
    },
    filterClass (qn) {
      return {
        'overdue': this.judgeStatus(qn) === '已过期',
        'published': this.judgeStatus(qn) === '已发布',
        'unpublished': this.judgeStatus(qn) === '未发布'
      }
    }
  }
}
</script>
