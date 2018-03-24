import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('@/components/Home')
const AgencyOrderList = () => import('@/components/AgencyOrderList')
const AgencyOrderDetail = () => import('@/components/AgencyOrderDetail')
const ProductList = () => import('@/components/ProductList')
const StoreList = () => import('@/components/StoreList')
const SalesList = () => import('@/components/SalesList')
const StaffList = () => import('@/components/StaffList')

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
      path: '/productList',
      name: 'ProductList',
      component: ProductList,
    },
    {
      path: '/storeList',
      name: 'StoreList',
      component: StoreList,
    },
    {
      path: '/salesList',
      name: 'SalesList',
      component: SalesList,
    },
    {
      path: '/staffList',
      name: 'StaffList',
      component: StaffList,
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
