<template>
  <AppNav />
  <RouterView />
  <CommonToastMessage
    v-model="commonStore.toastMessage.show"
    :message="toastMessage.message"
    :color="toastMessage.color"
    :timeout="toastMessage.timeout"
    :is-footer="toastMessage.isFooter"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useUsersStore } from '@/stores/useUsers';
import { useAuthStore } from '@/stores/useAuth';
import { useCommonStore } from '@/stores/useCommon';

import CommonToastMessage from '@/components/CommonToastMessage.vue';
import AppNav from '@/layouts/AppNav.vue';

const usersStore = useUsersStore();
const authStore = useAuthStore();
const commonStore = useCommonStore();

usersStore.getGroupMembers();
authStore.initUserData();

const toastMessage = computed(() => commonStore.toastMessage);
</script>
