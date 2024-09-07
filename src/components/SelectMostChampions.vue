<template>
  <div class="container">
    <VSelect
      v-model="selectedPositionType"
      :items="positionTypes"
      label="포지션 선택"
      width="100%"
    />

    <VSelect
      v-model="selectedPosition"
      :items="filteredPositions"
      label="포지션을 선택하세요"
      disabled
      width="100%"
    />

    <div class="champion__list">
      <div v-for="champion in filteredChampions" :key="champion.id" class="champion__item">
        <img :alt="champion.name" :src="champion.image_url" class="champion__img" />
        <VCheckbox
          v-model="selectedChampions"
          :value="champion.id"
          :label="champion.name"
          :disabled="isCheckboxDisabled(champion.id)"
        />
      </div>
    </div>

    <div class="btns">
      <v-btn :color="styles.primary" @click="confirmSelection">확인</v-btn>
      <v-btn :color="styles.primary" @click="goBack">취소</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useChampions } from '@/stores/useChampion';
import { useUsersStore } from '@/stores/useUsers';

import styles from '@/styles/_export.module.scss';

const route = useRoute();
const router = useRouter();
const userId = route.params.id;

const positionTypes = ref(['main']);
const selectedPositionType = ref('main');

const selectedPosition = ref('');

const selectedChampions = ref<string[]>([]);

const championsStore = useChampions();
const usersStore = useUsersStore();

const currentUser = computed(() =>
  usersStore.groupMembers.find((member) => member.id === Number(userId))
);

// 주 포지션, 부 포지션 필터링
const filteredPositions = computed(() => {
  const positions: string[] = [];
  if (currentUser.value?.mainPosition) positions.push(currentUser.value.mainPosition);
  if (currentUser.value?.subPosition) positions.push(currentUser.value.subPosition);
  return positions;
});

// 포지션 타입 변경 시 주 포지션 또는 부 포지션으로 선택
watch(selectedPositionType, (newType) => {
  if (newType === 'main') {
    selectedPosition.value = currentUser.value?.mainPosition || '';
  } else if (newType === 'sub' && currentUser.value?.subPosition) {
    selectedPosition.value = currentUser.value.subPosition;
  }
});

// 컴포넌트 마운트 시 기본 포지션 설정
onMounted(() => {
  championsStore.fetchChampionsData();
  selectedPosition.value = currentUser.value?.mainPosition || '';
  if (currentUser.value?.subPosition) {
    positionTypes.value = ['main', 'sub'];
  } else {
    positionTypes.value = ['main'];
  }
});

// 주/부 포지션에 따른 챔피언 필터링
const filteredChampions = computed(() => {
  if (!currentUser.value || !selectedPosition.value) return [];

  console.log('챔피언 데이터:', championsStore.champions.value);
  console.log('선택된 포지션:', selectedPosition.value);

  return championsStore.champions.value.filter((champion: any) => {
    if (selectedPositionType.value === 'main') {
      return champion.position.includes(currentUser.value?.mainPosition);
    } else if (selectedPositionType.value === 'sub') {
      return (
        currentUser.value?.subPosition && champion.position.includes(currentUser.value?.subPosition)
      );
    }
    return false;
  });
});

const isCheckboxDisabled = (championId: string) => {
  const isMain = selectedPositionType.value === 'main';
  const selectedCount = selectedChampions.value.filter((id) => {
    const champion = championsStore.champions.value.find((champ) => champ.id === id);
    const mainPosition = currentUser.value?.mainPosition || ''; // undefined일 경우 빈 문자열로 처리
    const subPosition = currentUser.value?.subPosition || ''; // undefined일 경우 빈 문자열로 처리

    return isMain
      ? champion?.position.includes(mainPosition) // mainPosition이 항상 문자열
      : champion?.position.includes(subPosition); // subPosition이 항상 문자열
  }).length;

  return selectedCount >= 3 && !selectedChampions.value.includes(championId);
};

const confirmSelection = () => {
  // 주 포지션에서 선택된 챔피언 필터링
  const mainSelected = selectedChampions.value.filter((id) => {
    const champion = championsStore.champions.value.find((champ) => champ.id === id);
    const mainPosition = currentUser.value?.mainPosition || ''; // undefined일 경우 빈 문자열로 처리
    return champion?.position.includes(mainPosition);
  });

  // 부 포지션에서 선택된 챔피언 필터링
  const subSelected = selectedChampions.value.filter((id) => {
    const champion = championsStore.champions.value.find((champ) => champ.id === id);
    const subPosition = currentUser.value?.subPosition || ''; // undefined일 경우 빈 문자열로 처리
    return champion?.position.includes(subPosition);
  });

  console.log('주 포지션 선택된 챔피언:', mainSelected);
  console.log('부 포지션 선택된 챔피언:', subSelected);
};

const goBack = () => {
  router.back();
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  .champion__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: 10px;
    width: 100%;
  }

  .champion__item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .champion__img {
    width: 75px;
    height: 75px;
    margin-bottom: 10px;
  }

  .btns {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
  }
}
</style>
