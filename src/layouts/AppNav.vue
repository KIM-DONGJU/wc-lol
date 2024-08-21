<template v-if="!isLoginUser">
  <div class="nav-root">
    <nav class="nav">
      <div class="wrap-left">
        <router-link
          v-for="(routeInfo, index) in routes"
          :key="index"
          :class="currentRouteStyle(routeInfo.name)"
          :to="routeInfo.path"
        >
          {{ routeInfo.label }}
        </router-link>
      </div>
      <div class="wrap-login">
        <img src="@/assets/images/icon/my-page.svg" />
        <router-link :to="LOGIN.path">
          <p class="login">로그인</p>
        </router-link>
        <router-link style="text-decoration: none" to="/signup">
          <p class="signup">회원가입</p>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { CREATE_MATCH, LOGIN, MATCH_HISTORY, NOT_FOUND, USER_TIER } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();

const routes = [
  {
    path: '/user-tier',
    label: 'WC-LOL',
    name: '',
  },
  {
    path: '/user-tier',
    label: '유저 목록',
    name: USER_TIER.name,
  },
  {
    path: CREATE_MATCH.path,
    label: '대전 생성',
    name: CREATE_MATCH.name,
  },
  {
    path: MATCH_HISTORY.path,
    label: '대전 기록',
    name: MATCH_HISTORY.name,
  },
];

const currentRouteStyle = (name: string) => {
  if (route.name === NOT_FOUND.name) {
    return {
      'current-path': name === USER_TIER.name,
    };
  }

  return {
    'current-path': route.name === name,
  };
};

const isLoginUser = computed(() => authStore.user);
</script>
<style lang="scss" scoped>
.nav-root {
  display: flex;
  justify-content: center;
  padding: 0 30px;
  margin-bottom: 20px;
  background-color: #5383e8;

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1280px;

    .wrap-left {
      display: flex;
      gap: 20px;
      align-items: center;

      > a {
        padding: 10px 0 9px;
        font-size: 14px;
        color: #b3cdff;
        text-decoration: none;
      }

      > .current-path {
        box-sizing: border-box;
        font-weight: bold;
        color: #fff;
        border-bottom: 3px solid #fff;
      }
    }

    .wrap-login {
      display: flex;
      gap: 10px;
      align-items: center;
      cursor: pointer;

      > a {
        text-decoration: none;
      }

      .login {
        font-size: 14px;
        color: #b3cdff;
      }
      .signup {
        font-size: 14px;
        color: #b3cdff;
      }
    }
  }
}

@media screen and (width <= 1024px) {
  .nav-root {
    padding: 0 15px;
    margin-bottom: 20px;

    .nav {
      .wrap-left {
        gap: 12px;

        > a {
          font-size: 12px;
        }
      }

      .wrap-login {
        .login {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
