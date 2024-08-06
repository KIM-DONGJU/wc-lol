<template>
  <div class="user-tier-root">
    <TierTable />
  </div>
</template>

<script setup lang="ts">
import TierTable from '@/components/TierTable.vue'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const position = computed(() => {
  return route.params.position || 'all'
})
</script>

<style scoped lang="scss">
.user-tier-root {
  display: flex;
  justify-content: center;
  padding: 0 10 20px;
}
</style>
