import { CREATE_MATCH, NOT_FOUND, USER_TIER } from '@/constants/routes'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: USER_TIER.path,
      name: USER_TIER.name,
      component: () => import('@/views/UserTierView.vue')
    },
    {
      path: NOT_FOUND.path,
      redirect: '/user-tier/all'
    },
    {
      path: CREATE_MATCH.path,
      name: CREATE_MATCH.name,
      component: () => import('@/views/CreateMatchView.vue')
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../components/SignUp.vue')
    }
  ]
})

export default router
