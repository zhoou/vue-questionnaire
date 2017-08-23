<template>
  <div
    v-show="show"
    v-bind:class="{
      'alert': true,
      'alert-success':(type == 'success'),
      'alert-warning':(type == 'warning'),
      'alert-info':	(type == 'info'),
      'alert-danger':	(type == 'danger'),
      'top': (placement === 'top'),
      'top-right': (placement === 'top-right')
    }"
    v-bind:style="{width:width}"
    role="alert">
    <span v-show="dismissable" class="alert-dismissible"><span class="close"
      @click="show = false">&times;</span></span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },
    dismissable: {
      type: Boolean,
      coerce: function (val) {
        return !!val
      },
      default: false
    },
    show: {
      type: Boolean,
      coerce: function (val) {
        return !!val
      },
      default: true,
      twoWay: true
    },
    duration: {
      type: Number,
      coerce: function (val) {
        return Number(val)
      },
      default: 0
    },
    width: {
      type: String
    },
    placement: {
      type: String
    }
  },
  watch: {
    show (val) {
      if (this._timeout) clearTimeout(this._timeout)
      if (val && Boolean(this.duration)) {
        this._timeout = setTimeout(() => { this.show = false }, this.duration)
      }
    }
  }
}
</script>

<style lang="scss">
$warningColor: #a94442;
$successColor: #4cae4c;
@mixin theme($color) {
  background: lighten($warningColor, 40%);
  border-color: $warningColor;
  color: $warningColor;
  .close {
    color: $warningColor;
  }
}
.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: .1rem solid transparent;
  border-radius: .4rem;
  position: relative;
  .close {
    position: absolute;
    top: .5rem;
    right: 1rem;
    cursor: pointer;
    font-size: 20px;
  }
}

.alert-heading {
  color: inherit;
}

.alert-link {
  font-weight: normal;
}

.alert-success {
}
.alert-info {

}
.alert-warning {
  @include theme($warningColor);
}
.alert-danger {
  background: red;
  border-color: red;
  color: #fff;
}
.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter,
.fade-leave {
  height: 0;
  opacity: 0;
}
.alert.top {
  position: fixed;
  top: 20%;
  margin: 0 auto;
  left: 0;
  right: 0;
  z-index: 1050;
}
.alert.top-right {
  position: fixed;
  top: 30px;
  right: 50px;
  z-index: 1050;
}
</style>
