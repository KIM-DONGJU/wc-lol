<template>
  <AppNav />
  <RouterView />
</template>

<script setup lang="ts">
import AppNav from './layouts/AppNav.vue'

import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()
usersStore.getGroupMembers()
</script>
<style lang="scss"></style>
