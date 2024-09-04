<template>
  <VSnackbar
    v-model="bindToastMessage"
    :class="isFooter && 'is-footer-style'"
    :color="color"
    :timeout="timeout"
    :close-on-back="false"
    class="common-toast-message-root"
    rounded="4"
  >
    <div class="text-center snackbar-alert">
      <p>
        {{ message }}
      </p>
    </div>
  </VSnackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    message: string;
    color?: string;
    timeout?: number;
    isFooter?: boolean;
  }>(),
  {
    timeout: 3000,
    color: 'success',
    isFooter: false,
  }
);

const emit = defineEmits(['update:modelValue']);

const bindToastMessage = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});
</script>

<style lang="scss" scoped>
:deep(.v-snackbar__wrapper) {
  bottom: 1.6rem !important;
  width: 94vw;
  max-width: 100%;
  margin: 0;
}

.snackbar-alert {
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  white-space: pre-line;
}

.is-footer-style {
  &:deep(.v-overlay__content) {
    bottom: 86px !important;
  }
}
</style>
