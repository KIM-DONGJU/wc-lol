<template>
  <div class="select-most-champions">
    <h2>Choose Most Played Champions</h2>

    <div class="filters">
      <v-select
        v-model="selectedPosition"
        :items="positions"
        label="Select Position"
        outlined
        dense
      />
    </div>

    <div class="champions-grid">
      <v-checkbox
        v-for="champion in filteredChampions"
        :key="champion.id"
        v-model="selectedChampions"
        :label="champion.name"
        :value="champion.id"
        :disabled="selectedChampions.length >= 3 && !selectedChampions.includes(champion.id)"
      >
        <img :src="champion.image_url" class="champion-image" />
      </v-checkbox>
    </div>

    <div class="actions">
      <v-btn @click="confirmSelection">확인</v-btn>
      <v-btn @click="closeModal">취소</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useChampions } from '@/stores/useChampion';
import { useUsersStore } from '@/stores/useUsers';

const mostChampionStore = useChampions();
const fetchChampionsData = () => mostChampionStore.fetchChampionsData();
const filterChampions = (position: string) => mostChampionStore.filterChampions(position);
const { champions } = useChampions();
const usersStore = useUsersStore();

// 초기 챔피언 데이터 가져오기
fetchChampionsData();

// 사용자의 주/부 포지션 정보
const currentUser = usersStore.currentMemberInGroup;

// 포지션 선택 및 챔피언 선택 상태
const selectedPosition = ref(currentUser?.mainPosition || 'all');
const selectedChampions = ref<string[]>([]);
const positions = ['top', 'mid', 'jungle', 'adc', 'sup'];

const emit = defineEmits(['close']);

// 포지션에 따른 필터링 된 챔피언 리스트
const filteredChampions = computed(() => {
  return champions.value.filter(
    (champion) =>
      selectedPosition.value === 'all' || champion.position.includes(selectedPosition.value)
  );
});

// 포지션 변경 시 필터 적용
watch(selectedPosition, (newPosition) => {
  filterChampions(newPosition);
  selectedChampions.value = []; // 포지션이 바뀔 때 선택 초기화
});

// 선택 완료 시 처리 로직
const confirmSelection = () => {
  if (selectedChampions.value.length === 3) {
    // 주 포지션에 맞는 모스트 챔피언 저장
    if (selectedPosition.value === currentUser?.mainPosition) {
      usersStore.updateGroupMember({
        ...currentUser,
        mostChampionsMain: selectedChampions.value,
      });
    }
    // 부 포지션에 맞는 모스트 챔피언 저장
    else if (selectedPosition.value === currentUser?.subPosition) {
      usersStore.updateGroupMember({
        ...currentUser,
        mostChampionsSub: selectedChampions.value,
      });
    }
    closeModal();
  } else {
    alert('Please select exactly 3 champions.');
  }
};

// 모달 종료 처리
const closeModal = () => {
  // 부모 컴포넌트에서 모달을 닫는 로직 트리거
  emit('close');
};
</script>

<style scoped>
.select-most-champions {
  width: 100%;
  max-width: 600px;
  padding: 16px;
  margin: 0 auto;

  .filters {
    margin-bottom: 16px;
  }

  .champions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
    margin-bottom: 16px;
  }

  .champion-image {
    width: 50px;
    height: 50px;
  }

  .actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
