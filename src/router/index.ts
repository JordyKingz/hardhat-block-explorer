import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/home/Home.vue'
import BlockView from '@/components/block/Block.vue'
import AddressView from '@/components/address/Address.vue'
import TxHashView from '@/components/tx/Tx.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import("@/views/index.vue"),
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/block/:number',
          name: 'block',
          component: BlockView
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
    },
  ]
})

export default router
