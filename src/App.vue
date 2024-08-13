<template>
  <AppNav />
  <RouterView />
</template>

<script setup lang="ts">
import AppNav from './layouts/AppNav.vue'

import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()
if (usersStore.groupMembers.length === 0) {
  usersStore.getGroupMembers()
}
</script>
<style lang="scss"></style>
