<template>
  <div role="dialog"
    v-bind:class="{
      'modal':true
    }"
    v-if="show"
    >
    <div v-bind:class="{'modal-dialog':true}" v-bind:style="{width: optionalWidth}">
      <div v-if="structure.header" class="modal-content">
        <div class="modal-header">
          <span class="close" @click="close">&times;</span>
          <h4 class="modal-title">{{title}}</h4>
        </div>
        <div v-if="structure.body" class="modal-body">
          <slot name="modal-body"></slot>
        </div>
        <div v-if="structure.footer" class="modal-footer">
          <button type="button" class="btn btn-default" @click="close">{{ cancelText }}</button>
          <button type="button" class="btn btn-primary" @click="callback">{{ okText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    structure: {
      type: Object,
      default () {
        return {
          header: true,
          body: true,
          footer: true
        }
      }
    },
    okText: {
      type: String,
      default: 'Save changes'
    },
    cancelText: {
      type: String,
      default: 'Close'
    },
    title: {
      type: String,
      default: ''
    },
    show: {
      required: true,
      type: Boolean,
      coerce: function (val) {
        return !!val
      },
      twoWay: true
    },
    width: {
      default: null
    },
    callback: {
      type: Function,
      default () {}
    },
    effect: {
      type: String,
      default: null
    },
    backdrop: {
      type: Boolean,
      coerce: function (val) {
        return !!val
      },
      default: true
    }
  },
  computed: {
    optionalWidth () {
      if (this.width === null) {
        return null
      } else if (Number.isInteger(this.width)) {
        return this.width + 'px'
      }
      return this.width
    }
  },
  methods: {
    close () {
      this.show = false
    }
  }
}
</script>
<style lang="scss">
$mainColor: #018fe5;
.modal {
  transition: all 0.3s ease;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.7);
}

.modal-dialog {
  opacity: 1;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 1rem;
  border-radius: .4rem;
  width: 400px;
  .modal-header {
    position: relative;
    font-size: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .modal-title {
      margin: 0;
      color: $mainColor;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      color: $mainColor;
      &:hover {
        color: lighten($mainColor, 20%);
      }
    }
  }
  .modal-body {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    line-height: 2;
    font-size: 14px;
  }
  .modal-footer {
    padding-top: 10px;
    text-align: right;
    .btn {
      outline: none;
      border: 1px solid $mainColor;
      background-color: #fff;
      margin-left: 10px;
      border-radius: 4px;
      color: $mainColor;
      &:first-child {
        background-color: lighten($mainColor, 40%);
      }
      &:hover {
        background-color: lighten($mainColor, 20%);
        color: #fff;
      }
      &:active {
        background-color: $mainColor;
        color: #fff;
      }
    }
  }
}
.modal.in {
  background-color: rgba(0,0,0,0.5);
}
</style>
