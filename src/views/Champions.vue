<template>
  <div class="champion">
    <!-- 검색 입력 필드 -->
    <v-text-field
      v-model="searchChampion"
      :base-color="styles.primary"
      :color="styles.primary"
      @input="filterChampions(selectedFilter)"
      width="49%"
      placeholder="챔피언 이름을 입력하세요"
      density="compact"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
    />

    <!-- 포지션 필터링 버튼 -->
    <header class="champion__header">
      <p
        v-for="header in headerList"
        :key="header.value"
        @click="filterChampions(header.value)"
        :class="[
          'chapion__header-position',
          { 'chapion__header__position-selected': selectedFilter === header.value },
        ]"
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
      <div v-for="champion in filteredChampions" :key="champion.key">
        <img class="champion__img" :src="champion.image_url" :alt="champion.name" />
        <h2 class="champion__name">{{ champion.name }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';

import axios from 'axios';
import styles from '@/styles/_export.module.scss';

import top from '@/assets/images/icon/01-icon-01-lol-icon-position-top.svg';
import jungle from '@/assets/images/icon/01-icon-01-lol-icon-position-jng.svg';
import mid from '@/assets/images/icon/01-icon-01-lol-icon-position-mid.svg';
import adc from '@/assets/images/icon/01-icon-01-lol-icon-position-bot.svg';
import sup from '@/assets/images/icon/01-icon-01-lol-icon-position-sup.svg';

// 챔피언 데이터
const champions = ref([]);
const filteredChampions = ref([]); // 필터링된 챔피언들
const selectedFilter = ref('all'); // 선택된 필터
const searchChampion = ref('');
// 필터 목록
const headerList = [
  { title: '전체', value: 'all' },
  { img: top, value: 'top' },
  { img: mid, value: 'mid' },
  { img: jungle, value: 'jungle' },
  { img: adc, value: 'adc' },
  { img: sup, value: 'sup' },
];

// supabase에 저장된 data를 불러오는 로직
const championsData = async () => {
  try {
    let { data: championsData, error: fetchError } = await supabase
      .from('LOL_champions')
      .select('*');

    if (fetchError) {
      console.error('Supabase에서 데이터 가져오는 중 에러 발생:', fetchError);
      return;
    }

    if (championsData.length === 0) {
      await saveChampions();
      ({ data: championsData } = await supabase.from('LOL_champions').select('*'));
    } else {
      await updateChampionsImage(championsData);
      championsData = await getChampionsData(); // Fetch champions after updating image URLs
    }

    championsData.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

    champions.value = championsData;
    filterChampions('all');
  } catch (error) {
    console.error('championsData 함수 내부 에러:', error);
  }
};

// 챔피언 필터링 로직
const filterChampions = (position: string) => {
  selectedFilter.value = position;

  let filtered = champions.value;

  if (position !== 'all') {
    filtered = filtered.filter((champion) => champion.position.includes(position));
  }

  if (searchChampion.value) {
    filtered = filtered.filter((champion) => champion.name.includes(searchChampion.value.trim()));
  }

  filteredChampions.value = filtered;
};

// API로부터 끌어온 data를 supabase에 저장하는 로직
const saveChampions = async () => {
  try {
    const LOL_API = 'https://ddragon.leagueoflegends.com/cdn/14.17.1/data/ko_KR/champion.json';
    const response = await axios.get(LOL_API);
    const championsData = response.data.data;

    const maxKey = await getMaxKey();
    let key = maxKey + 1;

    const newChampions = Object.values(championsData).map((champion) => ({
      key: key++,
      id: champion.id,
      name: champion.name,
      image_url: getChampionImage(champion.id),
    }));

    const { error: insertError } = await supabase.from('LOL_champions').insert(newChampions);
    if (insertError) {
      console.error('Error inserting new champions:', insertError);
    }
  } catch (error) {
    console.error('saveChampions 함수 내부 에러:', error.message);
  }
};

// 챔피언 이미지 업데이트 로직
const updateChampionsImage = async (championsData: any) => {
  for (const champ of championsData) {
    const expectedImageUrl = getChampionImage(champ.id);

    if (!champ.image_url || champ.image_url !== expectedImageUrl) {
      await supabase
        .from('LOL_champions')
        .update({ image_url: expectedImageUrl })
        .eq('id', champ.id);
    }
  }
};

// 챔피언 이름을 한국어로 업데이트하는 로직
const championsKoreanName = async () => {
  try {
    const LOL_API_KR = 'https://ddragon.leagueoflegends.com/cdn/14.17.1/data/ko_KR/champion.json';
    const response = await axios.get(LOL_API_KR);
    const championsDataKR = response.data.data;

    for (const championKey in championsDataKR) {
      const championKR = championsDataKR[championKey];

      const error = await supabase
        .from('LOL_champions')
        .update({ name: championKR.name })
        .eq('id', championKey);
    }
  } catch (error) {}
};

// 챔피언 이미지 URL 생성 함수
const getChampionImage = (championKey: string) => {
  return `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${championKey}.png`;
};

// Max Key 값을 가져오는 함수
const getMaxKey = async () => {
  const { data: maxKeyData, error: maxKeyError } = await supabase
    .from('LOL_champions')
    .select('key')
    .order('key', { ascending: false })
    .limit(1);

  if (maxKeyError) {
    console.error('Error fetching max key:', maxKeyError);
    return 0;
  }

  return maxKeyData && maxKeyData.length > 0 ? maxKeyData[0].key : 0;
};

// 수파베이스에서 챔피언 데이터를 가져오는 함수
const getChampionsData = async () => {
  const { data: championsData } = await supabase.from('LOL_champions').select('*');
  return championsData;
};

onMounted(() => {
  championsData();
  championsKoreanName();
});
</script>

<style scoped lang="scss">
.champion {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .champion__header {
    display: flex;
    align-items: center;
    border-radius: 4px;

    .chapion__header-position {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 156.7px;
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
    grid-template-columns: repeat(8, 1fr);
    gap: 10px 20px;
    margin-top: 20px;

    .champion__img {
      width: 100px;
      height: 100px;
      transition: all 0.5s ease-in-out;

      &:hover {
        transform: scale(1.2);
      }
    }

    .champion__name {
      width: 100px;
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
