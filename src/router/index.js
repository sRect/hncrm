import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/components/Home')
const AgencyOrderList = () => import('@/components/AgencyOrderList')
const AgencyOrderDetail = () => import('@/components/AgencyOrderDetail')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/agencyOrderList',
      name: 'AgencyOrderList',
      component: AgencyOrderList,
    },
    {
      path: '/agencyOrderDetail',
      name: 'AgencyOrderDetail',
      component: AgencyOrderDetail,
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
