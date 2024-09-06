<template>
  <div class="contianer">
    <div class="position__type">
      <VSelect v-model="selectedPositionType" :items="positionTypes" label="포지션 선택" />
    </div>

    <div class="position__name">
      <VSelect
        v-model="selectedPosition"
        :items="filteredPositions"
        label="포지션을 선택하세요"
        width="50%"
        disabled
      />
    </div>

    <div class="champion__list">
      <div v-for="champion in filteredChampions" :key="champion.id" class="champion__item">
        <img :alt="champion.name" :src="champion.image_url" class="champion__img" />
        <v-checkbox v-model="selectedChampions" :value="champion.id" :label="champion.name" />
      </div>
    </div>

    <div class="btns">
      <v-btn @click="confirmSelection">확인</v-btn>
      <v-btn @click="goBack">취소</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useChampions } from '@/stores/useChampion';
import { useUsersStore } from '@/stores/useUsers';

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

const filteredPositions = computed(() => {
  const positions: string[] = [];
  if (currentUser.value?.mainPosition) positions.push(currentUser.value.mainPosition);
  if (currentUser.value?.subPosition) positions.push(currentUser.value.subPosition);
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
  selectedPosition.value = currentUser.value?.mainPosition || '';
  if (currentUser.value?.subPosition) {
    positionTypes.value = ['main', 'sub'];
  } else {
    positionTypes.value = ['main'];
  }
});

const filteredChampions = computed(() => {
  if (!currentUser.value || !selectedPosition.value) return [];
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

onMounted(() => {
  championsStore.fetchChampionsData();
});

const confirmSelection = () => {
  console.log('선택된 챔피언:', selectedChampions.value);
};

const goBack = () => {
  router.back();
};
</script>

<style lang="scss" scoped></style>
