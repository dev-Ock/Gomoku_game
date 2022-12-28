import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import io from 'socket.io-client'
import Directives from '../plugins/directive'

let socket = io.connect('http://192.168.0.16:3041', { cors: { origin: '*' } })

// var socket = io.connect(`채팅서버 주소`,{
//   cors: { origin: '*' }
// });

Vue.use(Vuetify)
Vue.use(Directives)

Vue.config.productionTip = false
Vue.prototype.$socket = socket

new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app')
