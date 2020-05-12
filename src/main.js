import Vue from 'vue'
import App from './App'
import request from './utils/requestMethod'
import store from './store/index'
import login from './utils/login'

Vue.prototype.$login = login
Vue.prototype.$store = store
Vue.prototype.$http = request
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
