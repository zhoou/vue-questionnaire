import Vue from 'vue'
import Vuex from 'vuex'
// import createLogger from 'vuex/logger'

export const STORAGE_KEY = 'todos-vuejs'

Vue.use(Vuex)

const state = {
  todos: [
    {
      text: 'test'
    }
  ]
}

const mutations = {
  ADD_TODO (state, mutation) {
    state.todos.push({
      text: mutation.payload.text
    })
  }
}

const demo = {
  state,
  mutations
}

export default new Vuex.Store({
  modules: {
    demo
  }
})
