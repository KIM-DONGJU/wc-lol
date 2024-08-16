<template>
  <AppNav />
  <RouterView />
</template>

<script setup lang="ts">
import AppNav from './layouts/AppNav.vue'

import { useUsersStore } from '@/stores/users'
import { useAuthStore } from './stores/auth'

const usersStore = useUsersStore()
const authStore = useAuthStore()

usersStore.getGroupMembers()
authStore.initUserData()
</script>
<style lang="scss"></style>
