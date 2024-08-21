<template>
  <div class="nav-root">
    <nav class="nav">
      <div class="wrap-left">
        <router-link
          v-for="(route, index) in routes"
          :key="index"
          :to="route.path"
          :class="currentRouteStyle(route.name)"
        >
          {{ route.label }}
        </router-link>
      </div>
      <div class="wrap-login">
        <img src="@/assets/images/icon/my-page.svg" />
        <router-link v-if="!isLoginUser" :to="LOGIN.path">
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
import { CREATE_MATCH, LOGIN, MATCH_HISTORY, NOT_FOUND, USER_TIER } from '@/constants/routes'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()

const routes = [
  {
    path: '/user-tier',
    label: 'WC-LOL',
    name: ''
  },
  {
    path: '/user-tier',
    label: '유저 목록',
    name: USER_TIER.name
  },
  {
    path: CREATE_MATCH.path,
    label: '대전 생성',
    name: CREATE_MATCH.name
  },
  {
    path: MATCH_HISTORY.path,
    label: '대전 기록',
    name: MATCH_HISTORY.name
  }
]

const currentRouteStyle = (name: string) => {
  if (route.name === NOT_FOUND.name) {
    return {
      'current-path': name === USER_TIER.name
    }
  }

  return {
    'current-path': route.name === name
  }
}

const isLoginUser = computed(() => authStore.user)
</script>
<style lang="scss" scoped>
.nav-root {
  background-color: #5383e8;
  display: flex;
  justify-content: center;
  padding: 0 30px;
  margin-bottom: 20px;

  .nav {
    width: 100%;
    max-width: 1280px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .wrap-left {
      display: flex;
      align-items: center;
      gap: 20px;

      > a {
        text-decoration: none;
        color: #b3cdff;
        font-size: 14px;
        padding: 10px 0 9px;
      }

      > .current-path {
        color: #fff;
        font-weight: bold;
        border-bottom: 3px solid #fff;
        box-sizing: border-box;
      }
    }

    .wrap-login {
      display: flex;
      align-items: center;
      gap: 10px;
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

@media screen and (max-width: 1024px) {
  .nav-root {
    padding: 0 15px;
    margin-bottom: 20px;

    .nav {
      .wrap-left {
        gap: 12px;

        > a {
          font-size: 12px;
        }

        > .current-path {
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
