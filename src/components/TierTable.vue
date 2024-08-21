<template>
  <div class="tier-table-root">
    <div class="wrap-input">
      <label class="label" for="searchChampion"></label>
      <input
        id="searchChampion"
        v-model="searchInput"
        autocomplete="false"
        class="search-input"
        name="search"
        placeholder="이름, 닉네임 검색"
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
      <div v-for="(userTier, index) in groupMemberList" :key="index" class="tier-table">
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
        <p>
          <!-- {{ userTier.mostChampion }} -->
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { USER_TIER } from '@/constants/routes';
import { type Position, useUsersStore } from '@/stores/users';

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

const groupMemberList = computed(() => {
  const position = (router.currentRoute.value.params.position || 'all') as Position | 'all';

  const parsingGroupMembmers = usersStore.groupMembers
    .flatMap((groupMember) => {
      const member = [
        {
          nickname: groupMember.nickname,
          name: groupMember.name,
          position: groupMember.mainPosition,
          point: groupMember.positionScore[groupMember.mainPosition],
          mainPosition: groupMember.mainPosition,
          subPosition: groupMember.subPosition,
        },
      ];

      if (groupMember.subPosition) {
        member.push({
          nickname: groupMember.nickname,
          name: groupMember.name,
          position: groupMember.subPosition,
          point: groupMember.positionScore[groupMember.subPosition],
          mainPosition: groupMember.mainPosition,
          subPosition: groupMember.subPosition,
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
    return parsingGroupMembmers;
  }

  const filterGroupMembers = parsingGroupMembmers.filter(
    (member) =>
      member.position === position &&
      (member.mainPosition === position || member.subPosition === position)
  );

  return filterGroupMembers;
});

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
</script>

<style scoped lang="scss">
.tier-table-root {
  .wrap-input {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 40px;
    border: 1px solid rgb(83 131 232);
    border-radius: 4px;

    .label {
      position: absolute;
      top: 6px;
      left: 16px;
      display: block;
      width: 28px;
      height: 28px;
      color: transparent;
      cursor: default;
      background-color: rgb(154 164 175);
      mask: url("https://s-lol-web.op.gg/images/icon/icon-search.svg") center center / contain
        no-repeat;
      transition: background-color 0.3s linear 0s;
    }

    .search-input {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 0 12px 0 60px;
      color: #202d37;
      border: none;
      border-radius: 4px;
      outline: none !important;

      &:focus {
        border: none !important;
        outline: none !important;
      }
    }
  }

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
