<template>
  <div class="champion">
    <div class="champion__search">
      <!-- 검색 입력 필드 -->
      <v-text-field
        v-model="searchChampion.value"
        :base-color="styles.primary"
        :color="styles.primary"
        placeholder="챔피언 이름을 입력하세요"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @input="filterChampions(selectedFilter.value)"
      />
    </div>
    <!-- 포지션 필터링 버튼 -->
    <header class="champion__header">
      <p
        v-for="header in headerList"
        :key="header.value"
        :class="[
          'chapion__header-position',
          { 'chapion__header__position-selected': selectedFilter.value === header.value },
        ]"
        @click="() => filterChampions(header.value)"
      >
        <!-- 전체 필터는 텍스트로, 나머지는 이미지로 표시 -->
        <template v-if="header.value === 'all'">
          {{ header.title }}
        </template>
        <template v-else>
          <img :src="header.img" :alt="header.value" class="header__img" />
        </template>
      </p>
    </header>

    <!-- 챔피언 목록 -->
    <div class="champion__champions">
      <div v-for="champion in filteredChampions.value" :key="champion.key">
        <img :alt="champion.name" :src="champion.image_url" class="champion__img" />
        <h2 class="champion__name">{{ champion.name }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useChampions } from '@/stores/useChampion';
import styles from '@/styles/_export.module.scss';

import top from '@/assets/images/icon/01-icon-01-lol-icon-position-top.svg';
import jungle from '@/assets/images/icon/01-icon-01-lol-icon-position-jng.svg';
import mid from '@/assets/images/icon/01-icon-01-lol-icon-position-mid.svg';
import adc from '@/assets/images/icon/01-icon-01-lol-icon-position-bot.svg';
import sup from '@/assets/images/icon/01-icon-01-lol-icon-position-sup.svg';

const championsStore = useChampions();

const filteredChampions = computed(() => championsStore.filteredChampions);
const selectedFilter = computed(() => championsStore.selectedFilter);
const searchChampion = computed(() => championsStore.searchChampion);

const fetchChampionsData = () => championsStore.fetchChampionsData();
const filterChampions = (position: string) => championsStore.filterChampions(position);

const headerList = [
  { title: '전체', value: 'all' },
  { img: top, value: 'top' },
  { img: mid, value: 'mid' },
  { img: jungle, value: 'jungle' },
  { img: adc, value: 'adc' },
  { img: sup, value: 'sup' },
];

onMounted(() => {
  fetchChampionsData();
});
</script>

<style scoped lang="scss">
.champion {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;

  .champion__search {
    width: 100%;
  }

  .champion__header {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
    border-radius: 4px;

    .chapion__header-position {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 108px;
      height: 40px;
      font-size: 14px;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: center;
      border: solid 1px #dbe0e4;

      &:not(:last-child) {
        border-right-width: 0;
      }

      &.chapion__header__position-selected {
        font-weight: bold;
        color: #fff;
        background-color: #5383e8;
      }

      .header__img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .champion__champions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    gap: 10px 20px;
    width: 100%;
    margin-top: 20px;

    .champion__img {
      width: 75px;
      height: 75px;
      transition: all 0.2s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }

    .champion__name {
      width: 75px;
      margin-top: 5px;
      overflow: hidden;
      font-size: 14px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
