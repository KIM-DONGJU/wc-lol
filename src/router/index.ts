import { CREATE_MATCH, LOGIN, NOT_FOUND, SIGN_UP, USER_LIST, USER_TIER } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: USER_TIER.path,
      name: USER_TIER.name,
      component: () => import('@/views/UserTierView.vue'),
    },
    {
      path: NOT_FOUND.path,
      redirect: '/user-tier/all',
    },
    {
      path: CREATE_MATCH.path,
      name: CREATE_MATCH.name,
      component: () => import('@/views/CreateMatchView.vue'),
    },
    {
      path: SIGN_UP.path,
      name: SIGN_UP.name,
      component: () => import('@/views/SignUpView.vue'),
    },
    {
      path: LOGIN.path,
      name: LOGIN.name,
      component: () => import('@/views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.user) {
          next({ name: 'userTier', params: { position: 'all' } });
        } else {
          next();
        }
      },
    },
    {
      path: USER_LIST.path,
      name: USER_LIST.name,
      component: () => import('@/views/UserListView.vue'),
      beforeEnter: (to, from, next) => {
        const usersStore = useUsersStore();

        if (usersStore.currentMemberInGroup?.role === 'admin') {
          next();
        } else {
          next({ name: 'userTier', params: { position: 'all' } });
        }
      },
    },
  ],
});

export default router;
