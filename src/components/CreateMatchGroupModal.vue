<template>
  <CommonModal
    v-model:dialog="bindDialog"
    width="100%"
    max-width="400"
    class="create-match-group-modal-root"
  >
    <p class="text-h5 font-weight-bold d-flex justify-space-between align-center">
      <span> 대전 그룹 생성 </span>
      <VIcon class="ml-2" icon="mdi-close" size="24" @click="closeDialog" />
    </p>
    <div class="wrap-match-group-info mt-6 d-flex flex-column">
      <div class="match-group-info d-flex align-center">
        <p class="title">대전 그룹 이름</p>
        <VTextField
          v-model="matchGroupName"
          :base-color="styles.primary"
          :color="styles.primary"
          class="flex-1-1"
          variant="outlined"
          density="compact"
          hide-details
        />
      </div>
    </div>
    <div class="footer mt-6 d-flex justify-space-between align-center">
      <VBtn
        color="#666"
        base-color="#666"
        variant="tonal"
        size="x-large"
        density="compact"
        @click="closeDialog"
      >
        취소
      </VBtn>
      <VBtn
        :color="styles.primary"
        :base-color="styles.primary"
        variant="tonal"
        size="x-large"
        density="compact"
        @click="createMatchGroup"
      >
        생성
      </VBtn>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { useCommonStore } from '@/stores/useCommon';
import { useMatchStore } from '@/stores/useMatch';

import CommonModal from './CommonModal.vue';

import styles from '@/styles/_export.module.scss';

const props = defineProps<{
  dialog: boolean;
}>();

const emit = defineEmits(['update:dialog']);

const commonStore = useCommonStore();
const matchStore = useMatchStore();

const bindDialog = computed({
  get: () => props.dialog,
  set: (value: boolean) => emit('update:dialog', value),
});

const matchGroupName = ref('');
const closeDialog = () => {
  bindDialog.value = false;
};

const createMatchGroup = async () => {
  try {
    commonStore.setLoadingSpinner(true);
    const data = await matchStore.createMatchGroup(matchGroupName.value);

    if (data && data.length > 0) {
      commonStore.showToast({
        message: '대전 그룹이 생성되었습니다.',
      });
      bindDialog.value = false;

      matchStore.pushMatchGroup(data[0]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    commonStore.setLoadingSpinner(false);
  }
};
</script>

<style lang="scss" scoped>
.create-match-group-modal-root {
  gap: 16px;

  .wrap-match-group-info {
    .title {
      width: 100px;
    }

    .match-group-info {
      gap: 16px;
    }
  }
}
</style>
