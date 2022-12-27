import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import io from 'socket.io-client'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/black-green-light.css'
import Directives from '../plugins/directive'

let socket = io('http://192.168.0.112:3001')

Vue.use(Vuetify)
Vue.use(VueMaterial)
Vue.use(Directives)

Vue.config.productionTip = false
Vue.prototype.$socket = socket

new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app')