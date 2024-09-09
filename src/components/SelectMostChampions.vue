<template>
  <div class="container">
    <div class="champion__search">
      <v-text-field
        v-model="searchChampion"
        :base-color="styles.primary"
        :color="styles.primary"
        placeholder="챔피언 이름을 입력하세요"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />
    </div>

    <div class="champion__list">
      <div v-for="champion in filteredChampions" :key="champion.id" class="champion__item">
        <img :alt="champion.name" :src="champion.image_url" class="champion__img" />
        <p class="champion__name">{{ champion.name }}</p>
        <VCheckbox
          v-model="currentSelectedChampions"
          :value="champion.id"
          :disabled="isCheckboxDisabled(champion.id)"
          hide-details
          density="compact"
        />
      </div>
    </div>

    <div class="btns">
      <VBtn :color="styles.primary" @click="goBack">취소</VBtn>
      <VBtn :color="styles.primary" @click="selectConfirm">확인</VBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useChampions } from '@/stores/useChampion';
import { useUsersStore } from '@/stores/useUsers';

import { supabase } from '@/supabase';

import styles from '@/styles/_export.module.scss';

const route = useRoute();
const router = useRouter();
const userId = route.params.id;

const positionType = route.params.positionType as 'main' | 'sub';

const selectedChampionsMain = ref<string[]>([]);
const selectedChampionsSub = ref<string[]>([]);

const searchChampion = ref('');

const championsStore = useChampions();
const usersStore = useUsersStore();

const currentUser = computed(() =>
  usersStore.groupMembers.find((member) => member.id === Number(userId))
);

const currentSelectedChampions = computed({
  get() {
    return positionType === 'main' ? selectedChampionsMain.value : selectedChampionsSub.value;
  },
  set(value) {
    if (positionType === 'main') {
      selectedChampionsMain.value = value;
    } else {
      selectedChampionsSub.value = value;
    }
  },
});

const filteredChampions = computed(() => {
  if (!currentUser.value) return [];

  const search = searchChampion.value.toLowerCase();
  return championsStore.champions.value.filter((champion: any) =>
    champion.name.toLowerCase().includes(search)
  );
});

const isCheckboxDisabled = (championId: string) => {
  const selectedCount = currentSelectedChampions.value.length;
  return selectedCount >= 3 && !currentSelectedChampions.value.includes(championId);
};

const selectConfirm = async () => {
  if (currentSelectedChampions.value.length < 3) {
    alert('3개의 챔피언을 선택하세요.');
    return;
  }
  try {
    if (positionType === 'main') {
      const { data: mainData, error: mainError } = await supabase
        .from('groupmembers')
        .update({
          most_champions_main:
            selectedChampionsMain.value.length > 0 ? selectedChampionsMain.value : null,
        })
        .eq('id', currentUser.value?.id)
        .select();

      if (mainError) {
        console.error('주 포지션 저장 오류:', mainError.message);
        return;
      }

      if (mainData && mainData.length > 0) {
        usersStore.updateGroupMember(mainData[0]);
      } else {
        console.log('주 포지션 저장 후 데이터 없음.');
      }
    }

    if (positionType === 'sub') {
      const { data: subData, error: subError } = await supabase
        .from('groupmembers')
        .update({
          most_champions_sub:
            selectedChampionsSub.value.length > 0 ? selectedChampionsSub.value : null,
        })
        .eq('id', currentUser.value?.id)
        .select();

      if (subError) {
        console.error('부 포지션 저장 오류:', subError.message);
        return;
      }

      if (subData && subData.length > 0) {
        usersStore.updateGroupMember(subData[0]);
      } else {
        console.log('부 포지션 저장 후 데이터 없음.');
      }
    }

    router.push('/user-tier/all');
  } catch (error) {
    console.error('저장 중 오류 발생:', error);
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  championsStore.fetchChampionsData();

  if (positionType === 'main') {
    selectedChampionsMain.value = currentUser.value?.most_champions_main || [];
  } else if (positionType === 'sub') {
    selectedChampionsSub.value = currentUser.value?.most_champions_sub || [];
  }
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  .champion__search {
    width: 100%;
  }

  .champion__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: 10px;
    width: 100%;

    .champion__name {
      width: 100%;
      overflow: hidden;
      font-size: 14px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
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
