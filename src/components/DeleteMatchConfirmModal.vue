<template>
  <CommonModal v-model:dialog="bindDialog" width="100%" max-width="350">
    <p class="font-weight-bold text-h5">대전 삭제</p>
    <div class="d-flex flex-column">
      <p class="mt-4">
        <span class="font-weight-bold">{{ matchGroupName }}</span> 대전의
      </p>
      <p>
        <span class="font-weight-bold">{{ matchIndex + 1 }}경기</span>를 삭제하시겠습니까?
      </p>
      <div class="mt-4 d-flex align-center">
        <VBtn size="large" class="flex-1-1" variant="tonal" @click="cancel"> 취소 </VBtn>
        <VBtn :color="styles.error" size="large" class="flex-1-1 ml-2" @click="emit('confirm')">
          확인
        </VBtn>
      </div>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import CommonModal from './CommonModal.vue';

import styles from '@/styles/_export.module.scss';

const props = defineProps<{
  dialog: boolean;
  matchGroupName?: string;
  matchIndex: number;
}>();

const emit = defineEmits(['update:dialog', 'confirm']);

const bindDialog = computed({
  get: () => props.dialog,
  set: (value: boolean) => emit('update:dialog', value),
});

const cancel = () => {
  emit('update:dialog', false);
};
</script>
