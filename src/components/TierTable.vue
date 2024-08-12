<template>
  <div class="tier-table-root">
    <div class="wrap-input">
      <label for="searchChampion" class="label"></label>
      <input
        v-model="searchInput"
        id="searchChampion"
        class="search-input"
        name="search"
        autocomplete="false"
        placeholder="이름, 닉네임 검색"
      />
    </div>
    <header class="wrap-tier-header">
      <p
        v-for="header in headerList"
        :key="header.value"
        class="tier-header"
        :class="isSelectStyle(header.value)"
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
      <div class="tier-table" v-for="(userTier, index) in userTierList" :key="index">
        <p>
          {{ userTier.point }}
        </p>
        <p>
          {{ userTier.nickName }}
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import top from '@/assets/images/icon/01-icon-01-lol-icon-position-top.svg'
import jungle from '@/assets/images/icon/01-icon-01-lol-icon-position-jng.svg'
import mid from '@/assets/images/icon/01-icon-01-lol-icon-position-mid.svg'
import adc from '@/assets/images/icon/01-icon-01-lol-icon-position-bot.svg'
import sup from '@/assets/images/icon/01-icon-01-lol-icon-position-sup.svg'
import { USER_TIER } from '@/constants/routes'
import { useUsersStore } from '@/stores/users'

const router = useRouter()

const headerList = [
  {
    title: '전체',
    value: 'all'
  },
  {
    title: '탑',
    value: 'top'
  },
  {
    title: '미드',
    value: 'mid'
  },
  {
    title: '정글',
    value: 'jungle'
  },
  {
    title: '원딜',
    value: 'adc'
  },
  {
    title: '서폿',
    value: 'sup'
  }
]

const usersStore = useUsersStore()

const userList = computed(() => {
  return usersStore.userList
})

const searchInput = ref('')

const userTierList = computed(() => {
  const position = router.currentRoute.value.params.position || 'all'

  if (position === 'all') {
    const flattenedList = Object.values(userList.value).flat()
    const sortedList = flattenedList.sort((a, b) => b.point - a.point)

    if (searchInput.value) {
      return sortedList.filter(
        (user) => user.nickName.includes(searchInput.value) || user.name.includes(searchInput.value)
      )
    }

    return sortedList
  }

  const filterUsers = userList.value[position as 'top' | 'mid' | 'sup' | 'jungle' | 'adc']
  if (searchInput.value) {
    return filterUsers
      .filter(
        (user) => user.nickName.includes(searchInput.value) || user.name.includes(searchInput.value)
      )
      .sort((a, b) => b.point - a.point)
  }

  return filterUsers.sort((a, b) => b.point - a.point)
})

const searchTierByLine = (position: string) => {
  router.push({
    name: USER_TIER.name,
    params: {
      position: position
    },
    replace: true
  })
}

const isSelectStyle = (position: string) => {
  if (!router.currentRoute.value.params.position && position === 'all') {
    return 'tier-header-selected'
  }

  return router.currentRoute.value.params.position === position ? 'tier-header-selected' : ''
}

const getPositionImage = (position: string) => {
  switch (position) {
    case 'top':
      return top
    case 'mid':
      return mid
    case 'jungle':
      return jungle
    case 'adc':
      return adc
    case 'sup':
      return sup
  }
}
</script>

<style scoped lang="scss">
.tier-table-root {
  .wrap-input {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    border: 1px solid rgb(83, 131, 232);
    box-sizing: border-box;
    border-radius: 4px;

    .label {
      display: block;
      color: transparent;
      background-color: rgb(154, 164, 175);
      mask: url(https://s-lol-web.op.gg/images/icon/icon-search.svg) center center / contain
        no-repeat;
      position: absolute;
      top: 6px;
      left: 16px;
      width: 28px;
      height: 28px;
      transition: background-color 0.3s linear 0s;
      cursor: default;
    }

    .search-input {
      width: 100%;
      height: 100%;
      padding: 0px 12px 0px 60px;
      color: #202d37;
      box-sizing: border-box;
      border-radius: 4px;
      border: none;
      outline: none !important;

      &:focus {
        border: none !important;
        outline: none !important;
      }
    }
  }

  .wrap-tier-header {
    margin-top: 12px;
    display: flex;
    align-items: center;
    border-radius: 4px;

    .tier-header {
      min-width: 100px;
      font-size: 14px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-repeat: no-repeat;
      -webkit-background-position: center;
      background-position: center;
      border: solid 1px #dbe0e4;
      box-sizing: border-box;
      cursor: pointer;

      &:not(:last-child) {
        border-right-width: 0;
      }
    }

    .tier-header-selected {
      color: #fff;
      background-color: #5383e8;
      font-weight: bold;
    }
  }

  .wrap-tier-table {
    .tier-table-header {
      width: 100%;
      display: grid;
      gap: 5px;
      grid-template-columns: 1fr 3fr 2fr 1fr 2fr;
      background-color: #f7f7f9;
      border-radius: 4px 4px 0 0;
      padding: 4px 8px;
      box-sizing: border-box;
      margin-top: 12px;
      height: 32px;

      > p {
        font-size: 12px;
        color: #9aa4af;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .tier-table {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 3fr 2fr 1fr 2fr;
      gap: 5px;
      border-radius: 4px 4px 0 0;
      padding: 4px 8px;
      box-sizing: border-box;
      height: 32px;
      border-bottom: solid 1px #ebeef1;

      > p {
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .tier-table-root {
    .wrap-tier-header {
      .tier-header {
        min-width: 40px;
        flex: 1;
        font-size: 12px;
      }
    }
  }
}
</style>
