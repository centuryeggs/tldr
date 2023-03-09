import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router';
import axios from 'axios'

Vue.prototype.axios = axios;
Vue.use(VueRouter);
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  axios,
  render: h => h(App),
  router: router,
}).$mount('#app')
