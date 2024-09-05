<template>
  <VDialog v-model="bindDialog" :no-click-animation="noClickAnimation" persistent>
    <VCard :width="width" :max-width="maxWidth" class="pa-4" color="white">
      <slot></slot>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts" name="StoreModal">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    dialog: boolean;
    width?: string | number;
    maxWidth?: string | number;
    noClickAnimation?: boolean;
  }>(),
  {
    noClickAnimation: true,
    width: 'auto',
    maxWidth: 'auto',
  }
);

const emit = defineEmits(['update:dialog', 'close-modal']);

const bindDialog = computed({
  get: () => props.dialog,
  set: (value: boolean) => emit('update:dialog', value),
});
</script>

<style lang="scss" scoped>
:deep(.v-overlay__content) {
  align-items: center;

  .v-card {
    width: 280px;
  }
}
</style>
