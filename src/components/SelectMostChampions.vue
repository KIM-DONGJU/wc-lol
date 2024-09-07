<template>
  <div class="container">
    <VSelect
      v-model="selectedPositionType"
      :items="positionTypes"
      label="포지션 선택"
      width="100%"
    />

    <VSelect v-model="selectedPosition" :items="filteredPositions" disabled width="100%" />

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
import { supabase } from '@/supabase';

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

console.log('Current User:', currentUser.value);
console.log('Main Position:', currentUser.value?.mainPosition);
console.log('Sub Position:', currentUser.value?.subPosition);

const filteredPositions = computed(() => {
  const positions: string[] = [];

  if (currentUser.value?.mainPosition) positions.push(currentUser.value.mainPosition);

  if (
    currentUser.value?.subPosition &&
    currentUser.value.subPosition !== currentUser.value.mainPosition
  ) {
    positions.push(currentUser.value.subPosition);
  }

  return positions;
});

watch(selectedPositionType, (newType) => {
  if (newType === 'main') {
    selectedPosition.value = currentUser.value?.mainPosition || '';
  } else if (newType === 'sub' && currentUser.value?.subPosition) {
    selectedPosition.value = currentUser.value.subPosition;
  }
});

onMounted(() => {
  championsStore.fetchChampionsData();
  selectedPosition.value = currentUser.value?.mainPosition || '';
  if (currentUser.value?.subPosition) {
    positionTypes.value = ['main', 'sub'];
  } else {
    positionTypes.value = ['main'];
  }
});

const filteredChampions = computed(() => {
  if (!currentUser.value || !selectedPosition.value) return [];

  if (selectedPositionType.value === 'main') {
    return championsStore.champions.value.filter((champion: any) =>
      champion.position.includes(currentUser.value?.mainPosition)
    );
  }

  if (
    selectedPositionType.value === 'sub' &&
    currentUser.value?.subPosition !== currentUser.value?.mainPosition
  ) {
    return championsStore.champions.value.filter((champion: any) =>
      champion.position.includes(currentUser.value?.subPosition)
    );
  }

  return [];
});

const isCheckboxDisabled = (championId: string) => {
  const isMain = selectedPositionType.value === 'main';
  const selectedCount = selectedChampions.value.filter((id) => {
    const champion = championsStore.champions.value.find((champ) => champ.id === id);
    const mainPosition = currentUser.value?.mainPosition || '';
    const subPosition = currentUser.value?.subPosition || '';

    return isMain
      ? champion?.position.includes(mainPosition)
      : champion?.position.includes(subPosition);
  }).length;

  return selectedCount >= 3 && !selectedChampions.value.includes(championId);
};

const confirmSelection = async () => {
  const mainSelected = selectedChampions.value.filter((id) => {
    const champion = championsStore.champions.value.find((champ) => champ.id === id);
    const mainPosition = currentUser.value?.mainPosition || '';
    return champion?.position.includes(mainPosition);
  });

  const subSelected = selectedChampions.value.filter((id) => {
    const champion = championsStore.champions.value.find((champ) => champ.id === id);
    const subPosition = currentUser.value?.subPosition || '';
    return champion?.position.includes(subPosition);
  });

  try {
    const { data: mainData, error: mainError } = await supabase
      .from('groupmembers')
      .update({
        most_champions_main: mainSelected.length > 0 ? mainSelected : null,
      })
      .eq('id', currentUser.value?.id);

    if (mainError) {
      console.error('Main position update error:', mainError.message);
      return;
    }

    const { data: subData, error: subError } = await supabase
      .from('groupmembers')
      .update({
        most_champions_sub: subSelected.length > 0 ? subSelected : null,
      })
      .eq('id', currentUser.value?.id);

    if (subError) {
      console.error('Sub position update error:', subError.message);
      return;
    }

    console.log('데이터 업데이트 완료');
  } catch (error) {
    console.error('데이터 업데이트 중 오류 발생:', error);
  }
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
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }

  .btns {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
  }
}
</style>
