<template>
  <VDialog v-model="bindDialog" class="d-flex justify-center align-center">
    <div class="d-flex justify-center align-center">
      <VProgressCircular
        :color="styles.primary"
        class="d-flex justify-center align-center"
        size="36"
        width="3"
        indeterminate
      />
    </div>
  </VDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import styles from '@/styles/_export.module.scss';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const bindDialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});
</script>
