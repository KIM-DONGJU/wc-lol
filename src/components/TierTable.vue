<template>
  <div class="tier-table-root">
    <div class="wrap-input">
      <v-text-field
        v-model="searchInput"
        :base-color="styles.primary"
        :color="styles.primary"
        width="100%"
        variant="outlined"
        density="compact"
        placeholder="이름, 닉네임 검색"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
        @click:clear="clearInput"
      />
    </div>
    <header class="wrap-tier-header">
      <p
        v-for="header in headerList"
        :key="header.value"
        :class="isSelectStyle(header.value)"
        class="tier-header"
        @click="searchTierByLine(header.value)"
      >
        {{ header.title }}
      </p>
    </header>
    <div class="wrap-tier-table">
      <header class="tier-table-header">
        <p>포인트</p>
        <p>닉네임</p>
        <p>이름</p>
        <p>포지션</p>
        <p>모스트 챔피언</p>
      </header>
      <div v-for="(userTier, index) in groupMembers" :key="index" class="tier-table">
        <p>
          {{ userTier.point }}
        </p>
        <p>
          {{ userTier.nickname }}
        </p>
        <p>
          {{ userTier.name }}
        </p>
        <p>
          <img :src="getPositionImage(userTier.position)" />
        </p>
        <div>
          <div v-if="userTier.position === userTier.mainPosition" class="champion__images">
            <img
              v-for="(champion, idx) in userTier.mostChampionsMain || []"
              :key="idx"
              :src="getChampionImage(champion)"
              alt="Main Champions"
              class="champion__img"
            />
          </div>

          <div v-if="userTier.position === userTier.subPosition" class="champion__images">
            <img
              v-for="(champion, idx) in userTier.mostChampionsSub || []"
              :key="idx"
              :src="getChampionImage(champion)"
              alt="Sub Champions"
              class="champion__img"
            />
          </div>

          <div class="select__btn">
            <button
              v-if="!userTier.mostChampionsMain && !userTier.mostChampionsSub"
              @click="selectMostChampions(userTier.id)"
            >
              선택하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { SELECTMOSTCHAMPION, USER_TIER } from '@/constants/routes';
import { type Position, useUsersStore } from '@/stores/useUsers';

import styles from '@/styles/_export.module.scss';

import top from '@/assets/images/icon/01-icon-01-lol-icon-position-top.svg';
import jungle from '@/assets/images/icon/01-icon-01-lol-icon-position-jng.svg';
import mid from '@/assets/images/icon/01-icon-01-lol-icon-position-mid.svg';
import adc from '@/assets/images/icon/01-icon-01-lol-icon-position-bot.svg';
import sup from '@/assets/images/icon/01-icon-01-lol-icon-position-sup.svg';

const router = useRouter();

const headerList = [
  {
    title: '전체',
    value: 'all',
  },
  {
    title: '탑',
    value: 'top',
  },
  {
    title: '미드',
    value: 'mid',
  },
  {
    title: '정글',
    value: 'jungle',
  },
  {
    title: '원딜',
    value: 'adc',
  },
  {
    title: '서폿',
    value: 'sup',
  },
];

const usersStore = useUsersStore();

const searchInput = ref('');

const groupMembers = computed(() => {
  const position = (router.currentRoute.value.params.position || 'all') as Position | 'all';

  const parsingGroupMembers = usersStore.groupMembers
    .flatMap((groupMember) => {
      const member = [
        {
          id: groupMember.id,
          nickname: groupMember.nickname,
          name: groupMember.name,
          position: groupMember.mainPosition,
          point: groupMember.positionScore[groupMember.mainPosition],
          mainPosition: groupMember.mainPosition,
          subPosition: groupMember.subPosition,
          mostChampionsMain: groupMember.most_champions_main,
          mostChampionsSub: groupMember.most_champions_sub,
        },
      ];

      if (groupMember.subPosition) {
        member.push({
          id: groupMember.id,
          nickname: groupMember.nickname,
          name: groupMember.name,
          position: groupMember.subPosition,
          point: groupMember.positionScore[groupMember.subPosition],
          mainPosition: groupMember.mainPosition,
          subPosition: groupMember.subPosition,
          mostChampionsMain: groupMember.most_champions_main,
          mostChampionsSub: groupMember.most_champions_sub,
        });
      }

      return member;
    })
    .filter(
      (member) =>
        member.nickname.includes(searchInput.value.trim()) ||
        member.name.includes(searchInput.value.trim())
    )
    .sort((a, b) => b.point - a.point);

  if (position === 'all') {
    return parsingGroupMembers;
  }

  const filterGroupMembers = parsingGroupMembers.filter(
    (member) =>
      member.position === position &&
      (member.mainPosition === position || member.subPosition === position)
  );

  return filterGroupMembers;
});

const selectMostChampions = (userId: number) => {
  router.push({
    name: SELECTMOSTCHAMPION.name,
    params: {
      id: userId,
    },
  });
};

const searchTierByLine = (position: string) => {
  router.push({
    name: USER_TIER.name,
    params: {
      position,
    },
    replace: true,
  });
};

const isSelectStyle = (position: string) => {
  if (!router.currentRoute.value.params.position && position === 'all') {
    return 'tier-header-selected';
  }

  return router.currentRoute.value.params.position === position ? 'tier-header-selected' : '';
};

const getChampionImage = (championKey: string) => {
  return `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${championKey}.png`;
};

const getPositionImage = (position: string) => {
  switch (position) {
    case 'top':
      return top;
    case 'mid':
      return mid;
    case 'jungle':
      return jungle;
    case 'adc':
      return adc;
    case 'sup':
      return sup;
  }
};

const clearInput = () => {
  searchInput.value = '';
};
</script>

<style scoped lang="scss">
.tier-table-root {
  width: 100%;
  max-width: 600px;

  .wrap-tier-header {
    display: flex;
    align-items: center;
    margin-top: 12px;
    border-radius: 4px;

    .tier-header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 100px;
      height: 40px;
      font-size: 14px;
      cursor: pointer;
      background-repeat: no-repeat;
      -webkit-background-position: center;
      background-position: center;
      border: solid 1px #dbe0e4;

      &:not(:last-child) {
        border-right-width: 0;
      }
    }

    .tier-header-selected {
      font-weight: bold;
      color: #fff;
      background-color: #5383e8;
    }
  }

  .wrap-tier-table {
    .tier-table-header {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 1fr 3fr 2fr 1fr 2fr;
      gap: 5px;
      width: 100%;
      height: 32px;
      padding: 4px 8px;
      margin-top: 12px;
      background-color: #f7f7f9;
      border-radius: 4px 4px 0 0;

      > p {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #9aa4af;
      }
    }

    .tier-table {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 1fr 3fr 2fr 1fr 2fr;
      gap: 5px;
      width: 100%;
      height: 32px;
      padding: 4px 8px;
      border-bottom: solid 1px #ebeef1;
      border-radius: 4px 4px 0 0;

      > p {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }

      .champion__images {
        display: flex;
        gap: 5px;
        justify-content: center;

        .champion__img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }
      }

      .select__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        button {
          color: rgb(0 0 0 / 50%);
        }
      }
    }
  }
}

@media screen and (width <= 1024px) {
  .tier-table-root {
    .wrap-tier-header {
      .tier-header {
        flex: 1;
        min-width: 40px;
        font-size: 12px;
      }
    }
  }
}
</style>
