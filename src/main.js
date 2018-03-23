// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {
  Tabs,
  TabPane,
  DatePicker,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Pagination,
  Message,
  MessageBox
} from 'element-ui'

import axios from './axios'
import isEmpty from 'lodash/isEmpty'
import App from './App'
import router from './router'


Vue.config.productionTip = false

Vue.use(axios)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)

Object.defineProperty(Vue.prototype, "$message", { value: Message })
Object.defineProperty(Vue.prototype, "$messagebox", { value: MessageBox })
Object.defineProperty(Vue.prototype, "$isEmpty", { value: isEmpty })
// Vue.prototype.HOST = '/hncrm'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
