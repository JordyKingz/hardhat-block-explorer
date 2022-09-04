import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlockNumberView from '../views/block/Number.vue'
import AddressView from '../views/address/Address.vue'
import TxHashView from '../views/tx/Hash.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/block/:number',
      name: 'block',
      component: BlockNumberView
    },
    {
      path: '/address/:address',
      name: 'address',
      component: AddressView
    },
    {
      path: '/tx/:hash',
      name: 'tx',
      component: TxHashView
    }
  ]
})

export default router
