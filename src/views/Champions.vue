<template>
  <div class="champion">
    <h1>리그 오브 레전드 챔피언</h1>
    <div>
      <div v-for="champion in champions" :key="champion.key">
        <h2>{{ champion.name }}</h2>
        <img class="champion_img" :src="champion.image_url" :alt="champion.name" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { supabase } from '@/supabase';

const champions = ref([]);

const fetchChampionsData = async () => {
  try {
    // Supabase에서 기존 챔피언 데이터를 가져옴
    let { data: championsData, error: fetchError } = await supabase
      .from('LOL_champions')
      .select('*');

    if (fetchError) {
      console.error('Supabase에서 데이터 가져오는 중 에러 발생:', fetchError);
      return;
    }

    if (championsData.length === 0) {
      // API에서 데이터를 가져와 Supabase에 저장
      await saveChampionsFromAPI();
      // 저장된 데이터를 다시 가져옴
      ({ data: championsData } = await supabase.from('LOL_champions').select('*'));
    } else {
      await updateChampionImageUrls(championsData);
      ({ data: championsData } = await supabase.from('LOL_champions').select('*'));
    }

    championsData.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

    champions.value = championsData;
  } catch (error) {
    console.error('fetchChampionsData 함수 내부 에러:', error);
  }
};

const saveChampionsFromAPI = async () => {
  try {
    const LOL_API = 'https://ddragon.leagueoflegends.com/cdn/14.17.1/data/ko_KR/champion.json';
    const response = await axios.get(LOL_API);
    const championsData = response.data.data;

    const { data: maxKeyData, error: maxKeyError } = await supabase
      .from('LOL_champions')
      .select('key')
      .order('key', { ascending: false })
      .limit(1);

    if (maxKeyError) {
      return;
    }

    let key = maxKeyData && maxKeyData.length > 0 ? maxKeyData[0].key + 1 : 1;

    const newChampions = [];

    for (const championKey in championsData) {
      const champion = championsData[championKey];
      const imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${championKey}.png`;

      console.log('생성된 imageUrl:', imageUrl);

      newChampions.push({
        key: key++,
        id: championKey,
        name: champion.name,
        image_url: imageUrl,
      });
    }

    const { error: insertError } = await supabase.from('LOL_champions').insert(newChampions);

    if (insertError) {
      console.error('Supabase 삽입 중 에러 발생:', insertError.message);
    } else {
      console.log('모든 챔피언 데이터 삽입 완료');
    }
  } catch (error) {
    console.error('saveChampionsFromAPI 함수 내부 에러:', error.message);
  }
};

const updateChampionImageUrls = async (championsData) => {
  for (const champ of championsData) {
    const expectedImageUrl = `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${champ.id}.png`;

    if (!champ.image_url || champ.image_url !== expectedImageUrl) {
      await supabase
        .from('LOL_champions')
        .update({ image_url: expectedImageUrl })
        .eq('id', champ.id);
    }
  }
};

const updateChampionNamesToKorean = async () => {
  try {
    const LOL_API_KR = 'https://ddragon.leagueoflegends.com/cdn/14.17.1/data/ko_KR/champion.json';
    const response = await axios.get(LOL_API_KR);
    const championsDataKR = response.data.data;

    for (const championKey in championsDataKR) {
      const championKR = championsDataKR[championKey];

      const { error: updateError } = await supabase
        .from('LOL_champions')
        .update({ name: championKR.name })
        .eq('id', championKey);

      if (updateError) {
        console.error(
          `챔피언 ${championKey}의 이름을 한국어로 업데이트 중 에러 발생:`,
          updateError.message
        );
      }
    }
  } catch (error) {
    console.error('updateChampionNamesToKorean 함수 내부 에러:', error.message);
  }
};

onMounted(() => {
  fetchChampionsData();
  updateChampionNamesToKorean(); // 추가: 한국어 이름으로 업데이트
});
</script>
<style scoped lang="scss">
.champion_img {
  width: 80px;
  height: 80px;
}
</style>
