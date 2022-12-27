import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 토큰 정보도 쉽게 가져다 쓸 수 있게
    token: localStorage.getItem('token') || null
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    // DB
    // Auth: Auth,
    // User: User
  }
})
