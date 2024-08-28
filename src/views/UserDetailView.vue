<template>
  <div class="user-detail-root">
    <div class="wrap-user-detail">
      <VTextField :value="member?.name" label="이름" variant="outlined" disabled active />
      <VTextField :value="member?.nickname" label="닉네임" variant="outlined" disabled active />
      <SetPosition
        v-for="position in POSITION_LIST"
        :key="position"
        v-model:score="selectedPoints[position]"
        v-model:mainPosition="selectedMain"
        v-model:subPosition="selectedSub"
        :position="position"
      />
      <div class="mt-6 w-100 d-flex justify-space-between align-center">
        <VBtn
          width="92"
          variant="outlined"
          size="x-large"
          density="compact"
          color="#666"
          @click="goBack"
        >
          뒤로가기
        </VBtn>
        <VBtn
          :disabled="isNotEdit"
          :color="styles.primary"
          :base-color="styles.primary"
          variant="tonal"
          size="x-large"
          density="compact"
          @click="onUpdatePositionScore"
        >
          수정
        </VBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import usePosition from '@/composables/usePosition';
import { type GroupMember, useUsersStore } from '@/stores/useUsers';
import { useCommonStore } from '@/stores/useCommon';

import SetPosition from '@/components/SetPosition.vue';

import { POSITION_LIST } from '@/constants/position';
import styles from '@/styles/_export.module.scss';
import { supabase } from '@/supabase';

const usersStore = useUsersStore();
const commonStore = useCommonStore();
const route = useRoute();
const router = useRouter();

const { selectedPoints, selectedMain, selectedSub } = usePosition();
const member = computed(() => {
  return usersStore.groupMembers.find((user) => user.id === Number(route.params.id));
});

const isNotEdit = computed(() => {
  // 주라인, 부라인이 변경되었는지 확인
  if (
    member.value?.mainPosition !== selectedMain.value ||
    member.value?.subPosition !== selectedSub.value
  ) {
    return false;
  }

  // 각 포지션별 점수가 변경되었는지 확인
  const positionScore = member.value?.positionScore;
  if (
    positionScore?.adc !== selectedPoints.adc ||
    positionScore?.jungle !== selectedPoints.jungle ||
    positionScore?.mid !== selectedPoints.mid ||
    positionScore?.sup !== selectedPoints.sup ||
    positionScore?.top !== selectedPoints.top
  ) {
    return false;
  }
  return true;
});

onMounted(() => {
  if (member.value) {
    selectedMain.value = member.value.mainPosition;
    selectedSub.value = member.value.subPosition;
    selectedPoints.adc = member.value.positionScore.adc;
    selectedPoints.jungle = member.value.positionScore.jungle;
    selectedPoints.mid = member.value.positionScore.mid;
    selectedPoints.sup = member.value.positionScore.sup;
    selectedPoints.top = member.value.positionScore.top;
  }
});

const goBack = () => {
  router.back();
};

const onUpdatePositionScore = async () => {
  if (!selectedMain.value) {
    commonStore.showToast({
      message: '주 포지션을 선택해주세요.',
      color: 'error',
      timeout: 3000,
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('groupmembers')
      .update({
        positionScore: selectedPoints,
        mainPosition: selectedMain.value,
        subPosition: selectedSub.value || null,
      })
      .eq('id', member.value?.id)
      .select<'', GroupMember>();

    if (data && data[0]) {
      usersStore.updateGroupMember(data[0]);
      commonStore.showToast({
        message: `${member.value?.name}(${member.value?.nickname})님의 정보가 수정되었습니다.`,
        color: 'success',
        timeout: 5000,
      });
      goBack();
    }
  } catch (err) {
    console.log(err);
  }
};
</script>
<style lang="scss" scoped>
.user-detail-root {
  display: flex;
  justify-content: center;
  padding: 0 15px;

  .wrap-user-detail {
    width: 100%;
    max-width: 600px;

    :deep(.v-btn--disabled) {
      opacity: 0.5;
    }
  }
}
</style>
