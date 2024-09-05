import { ref } from 'vue';
import { supabase } from '@/supabase';
import { LOL_API_URL } from '@/constants/champion';
import type { CHAMPION } from '@/interfaces/champion';

import axios from 'axios';

const champions = ref<CHAMPION[]>([]);
const filteredChampions = ref<CHAMPION[]>([]);
const selectedFilter = ref<string>('all');
const searchChampion = ref('');

// 챔피언 데이터를 불러오는 함수
export const useChampions = () => {
  const fetchChampionsData = async () => {
    try {
      let { data: fetchedChampionsData, error: fetchError } = await supabase
        .from('LOL_champions')
        .select('*');

      if (fetchError) {
        console.error('Supabase에서 데이터 가져오는 중 에러 발생:', fetchError);
        return;
      }

      if (!fetchedChampionsData || fetchedChampionsData.length === 0) {
        await saveChampions();
        ({ data: fetchedChampionsData } = await supabase.from('LOL_champions').select('*'));
      } else {
        await updateChampionsImage(fetchedChampionsData);
        fetchedChampionsData = await getChampionsData();
      }

      if (fetchedChampionsData) {
        fetchedChampionsData.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
        champions.value = fetchedChampionsData;
        filterChampions('all');
      }
    } catch (error) {
      console.error('fetchChampionsData 함수 내부 에러:', error);
    }
  };

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

  // API로부터 데이터를 가져와 Supabase에 저장하는 함수
  const saveChampions = async () => {
    try {
      const LOL_API = LOL_API_URL;
      const response = await axios.get(LOL_API);
      const championsData = response.data.data;

      const maxKey = await getMaxKey();
      let key = maxKey + 1;

      const newChampions = Object.values(championsData).map((champion: any) => ({
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
      console.error('saveChampions 함수 내부 에러:', error);
    }
  };

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

  const getChampionsData = async () => {
    const { data: championsData } = await supabase.from('LOL_champions').select('*');
    return championsData;
  };

  const getChampionImage = (championKey: string) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${championKey}.png`;
  };

  return {
    champions,
    filteredChampions,
    selectedFilter,
    searchChampion,
    fetchChampionsData,
    filterChampions,
  };
};
