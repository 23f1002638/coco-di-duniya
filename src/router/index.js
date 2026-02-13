import { createRouter, createWebHistory } from 'vue-router'
import Gateway from '../views/Gateway.vue'
import Hub from '../views/Hub.vue'
import Vault from '../views/Vault.vue'
import Coupons from '../views/Coupons.vue'
import Poetry from '../views/Poetry.vue'
import ShayariGenerator from '../views/ShayariGenerator.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'gateway',
      component: Gateway
    },
    {
      path: '/hub',
      name: 'hub',
      component: Hub
    },
    {
      path: '/vault',
      name: 'vault',
      component: Vault
    },
    {
      path: '/coupons',
      name: 'coupons',
      component: Coupons
    },
    {
      path: '/poetry',
      name: 'poetry',
      component: Poetry
    },
    {
      path: '/shayari-generator',
      name: 'shayari-generator',
      component: ShayariGenerator
    }
  ]
})

export default router
