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
        class="tier-header"
        :class="isSelectStyle(header.value)"
        v-for="header in headerList"
        :key="header.value"
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

interface User {
  name: string
  nickName: string
  point: number
  position: string
}

interface UserList {
  top: User[]
  mid: User[]
  sup: User[]
  jungle: User[]
  adc: User[]
}

const userList: UserList = {
  top: [
    {
      name: '김건우',
      nickName: '거뉴킹',
      point: 2,
      position: 'top'
    },
    {
      name: '김동주',
      nickName: '의로움, 흥겨움',
      point: 3,
      position: 'top'
    },
    {
      name: '김지성',
      nickName: '조져버렸다',
      point: 5,
      position: 'top'
    },
    {
      name: '박진배',
      nickName: '살가움',
      point: 4,
      position: 'top'
    },
    {
      name: '성현명',
      nickName: '반가움, 노여움',
      point: 2,
      position: 'top'
    },
    {
      name: '안일주',
      nickName: '엘올엘월즈',
      point: 3,
      position: 'top'
    },
    {
      name: '이종환',
      nickName: '푸우는바지안입어',
      point: 2,
      position: 'top'
    },
    {
      name: '이헌우',
      nickName: '늦어버렸다',
      point: 2,
      position: 'top'
    },
    {
      name: '정경수',
      nickName: '괴롭히지마십시오',
      point: 4,
      position: 'top'
    },
    {
      name: '유재경',
      nickName: '두꺼움, 정겨움',
      point: 2,
      position: 'top'
    }
  ],
  mid: [
    {
      name: '김건우',
      nickName: '거뉴킹',
      point: 2,
      position: 'mid'
    },
    {
      name: '김동주',
      nickName: '의로움, 흥겨움',
      point: 2,
      position: 'mid'
    },
    {
      name: '김석현',
      nickName: '주깐네',
      point: 4,
      position: 'mid'
    },
    {
      name: '백승민',
      nickName: '괴롭혀주십시오',
      point: 2,
      position: 'mid'
    },
    {
      name: '성현명',
      nickName: '반가움, 노여움',
      point: 3,
      position: 'mid'
    },
    {
      name: '이수환',
      nickName: '피터팬',
      point: 4,
      position: 'mid'
    },
    {
      name: '이승윤',
      nickName: '만능오른',
      point: 4,
      position: 'mid'
    },
    {
      name: '이완호',
      nickName: '가까움',
      point: 2,
      position: 'mid'
    },
    {
      name: '정경수',
      nickName: '괴롭히지마십시오',
      point: 4,
      position: 'mid'
    },
    {
      name: '허준영',
      nickName: '부서진장난감',
      point: 2,
      position: 'mid'
    },
    {
      name: '이호경',
      nickName: '솟구쳐버렸다',
      point: 4,
      position: 'mid'
    }
  ],
  sup: [
    {
      name: '김수관',
      nickName: '키타카와 마린',
      point: 4,
      position: 'sup'
    },
    {
      name: '변정택',
      nickName: '놀라움',
      point: 2,
      position: 'sup'
    },
    {
      name: '우명수',
      nickName: '쌀보리링',
      point: 1,
      position: 'sup'
    },
    {
      name: '유재경',
      nickName: '두꺼움, 정겨움',
      point: 3,
      position: 'sup'
    },
    {
      name: '이헌우',
      nickName: '늦어버렸다',
      point: 2,
      position: 'sup'
    },
    {
      name: '이호경',
      nickName: '솟구쳐버렸다',
      point: 2,
      position: 'sup'
    },
    {
      name: '안일주',
      nickName: '엘올엘월즈',
      point: 2,
      position: 'sup'
    }
  ],
  jungle: [
    {
      name: '김석현',
      nickName: '주깐네',
      point: 3,
      position: 'jungle'
    },
    {
      name: '김지성',
      nickName: '조져버렸다',
      point: 4,
      position: 'jungle'
    },
    {
      name: '우명수',
      nickName: '쌀보리링',
      point: 1,
      position: 'jungle'
    },
    {
      name: '유재훈',
      nickName: '따가움, 무거움',
      point: 5,
      position: 'jungle'
    },
    {
      name: '이완호',
      nickName: '가까움',
      point: 2,
      position: 'jungle'
    },
    {
      name: '박진배',
      nickName: '살가움',
      point: 3,
      position: 'jungle'
    }
  ],
  adc: [
    {
      name: '김우진',
      nickName: '국가와맞먹는힘',
      point: 5,
      position: 'adc'
    },
    {
      name: '박종보',
      nickName: '꽉채움',
      point: 1,
      position: 'adc'
    },
    {
      name: '유재원',
      nickName: '해로움',
      point: 4,
      position: 'adc'
    },
    {
      name: '이종환',
      nickName: '푸우는바지안입어',
      point: 2,
      position: 'adc'
    },
    {
      name: '이수환',
      nickName: '피터팬',
      point: 3,
      position: 'adc'
    },
    {
      name: '이승윤',
      nickName: '만능오른',
      point: 3,
      position: 'adc'
    },
    {
      name: '전재학',
      nickName: '인사혁신부',
      point: 2,
      position: 'adc'
    },
    {
      name: '허준영',
      nickName: '부서진장난감',
      point: 1,
      position: 'adc'
    },
    {
      name: '유재훈',
      nickName: '따가움, 무거움',
      point: 2,
      position: 'adc'
    }
  ]
}

const searchInput = ref('')

const userTierList = computed(() => {
  const position = router.currentRoute.value.params.position || 'all'

  if (position === 'all') {
    const flattenedList = Object.values(userList).flat()
    const sortedList = flattenedList.sort((a, b) => b.point - a.point)

    if (searchInput.value) {
      return sortedList.filter(
        (user) => user.nickName.includes(searchInput.value) || user.name.includes(searchInput.value)
      )
    }

    return sortedList
  }

  const filterUsers = userList[position as 'top' | 'mid' | 'sup' | 'jungle' | 'adc']
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
