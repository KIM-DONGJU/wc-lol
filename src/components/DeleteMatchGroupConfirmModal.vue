<template>
  <CommonModal v-model:dialog="bindDialog" class="delete-match-group-confirm-modal-root">
    <p class="font-weight-bold text-h5">대전 그룹 삭제</p>
    <div class="d-flex flex-column">
      <p class="mt-4">
        <span class="font-weight-bold">{{ matchGroup?.group_name }}</span> 대전 그룹을
        삭제하시겠습니까?
      </p>
      <p>삭제 시 그룹에 속한 대전 정보가 모두 삭제됩니다.</p>
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

import type { MatchGroup } from '@/stores/useMatch';

import CommonModal from './CommonModal.vue';

import styles from '@/styles/_export.module.scss';

const props = defineProps<{
  dialog: boolean;
  matchGroup?: MatchGroup;
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
