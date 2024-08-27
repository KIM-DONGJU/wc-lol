import {
  CREATE_MATCH,
  LOGIN,
  MEMBER_LIST,
  NOT_FOUND,
  SIGN_UP,
  USER_DETAIL,
  USER_TIER,
} from '@/constants/routes';
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
      path: MEMBER_LIST.path,
      name: MEMBER_LIST.name,
      component: () => import('@/views/MemberList.vue'),
    },
    {
      path: USER_DETAIL.path,
      name: USER_DETAIL.name,
      component: () => import('@/views/UserDetailView.vue'),
      beforeEnter: (to, from, next) => {
        const usersStore = useUsersStore();

        const member = usersStore.groupMembers.find((user) => user.id === Number(to.params.id));
        if (usersStore.currentMemberInGroup?.role === 'admin' && member) {
          next();
          return;
        }

        next({ name: MEMBER_LIST.name });
      },
    },
  ],
});

export default router;
