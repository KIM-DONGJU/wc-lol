<template>
  <div class="create-match-root">
    <v-card class="wrap-search-user-list" width="100%">
      <v-data-iterator
        :items="uniqueUserNameList"
        :items-per-page="30"
        :search="search"
        width="100%"
      >
        <template v-slot:header>
          <p>금일 내전 참가자 검색 및 등록</p>
          <v-text-field
            v-model="search"
            class="mt-3"
            density="compact"
            placeholder="이름, 닉네임 검색"
            prepend-inner-icon="mdi-magnify"
            width="100%"
            style="max-width: 300px"
            variant="outlined"
            base-color="#5382e8"
            color="#5382e8"
            clearable
            hide-details
          ></v-text-field>
        </template>
        <template v-slot:default="{ items }">
          <div class="wrap-search-users-info mt-5">
            <div
              class="user-name"
              v-for="(item, index) in items"
              :key="index"
              :class="selectedUserStyle(item.raw.title)"
              @click="onSelectUser(item.raw.title)"
            >
              {{ item.raw.title }}
            </div>
          </div>
        </template>
        <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
          <div class="d-flex align-center justify-center pa-4">
            <v-btn
              :disabled="page === 1"
              density="comfortable"
              icon="mdi-arrow-left"
              variant="tonal"
              rounded
              @click="prevPage"
            ></v-btn>

            <div class="mx-2 text-caption">Page {{ page }} of {{ pageCount }}</div>

            <v-btn
              :disabled="page >= pageCount"
              density="comfortable"
              icon="mdi-arrow-right"
              variant="tonal"
              rounded
              @click="nextPage"
            ></v-btn>
          </div>
        </template>
      </v-data-iterator>
    </v-card>
    <div class="wrap-today-participant">
      <div class="wrap-tables">
        <p class="font-weight-bold text-h6">
          금일 내전 참가자 목록 ({{ selectedUserList.length }}명)
        </p>
        <div v-if="selectedUserList.length" class="today-participant d-flex mt-4">
          <div
            v-if="filterFindUserListByTier.length"
            class="d-flex flex-column wrap-select-tier-table"
          >
            <div
              v-for="(findUser, index) in filterFindUserListByTier"
              :key="index"
              class="select-tier-table d-flex"
              @dragstart="startDrag($event, index)"
              draggable="true"
            >
              <p class="tier-table-left d-flex justify-center align-center text-center">
                {{ findUser.name }}<br />
                ({{ findUser.nickName }})
              </p>
              <div class="tier-table-right d-flex flex-column">
                <p v-for="(tier, ldx) in findUser.tier" :key="ldx" class="flex-1-1">
                  {{ LINE[tier.position] }}: {{ tier.point }}점
                </p>
              </div>
            </div>
          </div>
          <table class="participant-table">
            <tr class="header">
              <th></th>
              <th class="first text-h5">1팀</th>
              <th class="second text-h5">2팀</th>
            </tr>
            <tr>
              <td>탑</td>
              <td @drop.prevent="onDrop($event, 0, 'top')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[0].top"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 0, 'top')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].top.name }}</p>
                    <p>({{ teamList[0].top.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].top.point }}점</p>
                  </div>
                </div>
              </td>
              <td @drop.prevent="onDrop($event, 1, 'top')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[1].top"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 1, 'top')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].top.name }}</p>
                    <p>({{ teamList[1].top.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].top.point }}점</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>정글</td>
              <td @drop.prevent="onDrop($event, 0, 'jungle')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[0].jungle"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 0, 'jungle')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].jungle.name }}</p>
                    <p>({{ teamList[0].jungle.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].jungle.point }}점</p>
                  </div>
                </div>
              </td>
              <td @drop.prevent="onDrop($event, 1, 'jungle')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[1].jungle"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 1, 'jungle')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].jungle.name }}</p>
                    <p>({{ teamList[1].jungle.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].jungle.point }}점</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>미드</td>
              <td @drop.prevent="onDrop($event, 0, 'mid')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[0].mid"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 0, 'mid')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].mid.name }}</p>
                    <p>({{ teamList[0].mid.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].mid.point }}점</p>
                  </div>
                </div>
              </td>
              <td @drop.prevent="onDrop($event, 1, 'mid')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[1].mid"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 1, 'mid')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].mid.name }}</p>
                    <p>({{ teamList[1].mid.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].mid.point }}점</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>원딜</td>
              <td @drop.prevent="onDrop($event, 0, 'adc')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[0].adc"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 0, 'adc')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].adc.name }}</p>
                    <p>({{ teamList[0].adc.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].adc.point }}점</p>
                  </div>
                </div>
              </td>
              <td @drop.prevent="onDrop($event, 1, 'adc')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[1].adc"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 1, 'adc')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].adc.name }}</p>
                    <p>({{ teamList[1].adc.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].adc.point }}점</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>서폿</td>
              <td @drop.prevent="onDrop($event, 0, 'sup')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[0].sup"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 0, 'sup')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].sup.name }}</p>
                    <p>({{ teamList[0].sup.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[0].sup.point }}점</p>
                  </div>
                </div>
              </td>
              <td @drop.prevent="onDrop($event, 1, 'sup')" @dragenter.prevent @dragover.prevent>
                <div
                  v-if="teamList[1].sup"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 1, 'sup')"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].sup.name }}</p>
                    <p>({{ teamList[1].sup.nickName }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[1].sup.point }}점</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>포인트 합</td>
              <td>{{ sumPoints[0] }}점</td>
              <td>{{ sumPoints[1] }}점</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- <v-snackbar v-model="isVisibleMessage" multi-line>
      내전 참가자는 최대 10명까지 등록 가능합니다. <br />
      참가자를 다시 확인해주세요.
    </v-snackbar> -->
  </div>
</template>

<script setup lang="ts">
import { LINE } from '@/constants/tier'
import { useUsersStore, type User } from '@/stores/users'
import { computed, ref } from 'vue'

const usersStore = useUsersStore()
const search = ref('')
const userList = computed(() => {
  return usersStore.userList
})

// 중복 제거된 userList
const uniqueUserNameList = computed(() => {
  return Array.from(
    new Set(
      Object.values(userList.value)
        .flat()
        .map((user) => `${user.name} (${user.nickName})`)
    )
  ).map((name) => {
    return {
      title: name
    }
  })
})

const selectedUserList = ref<string[]>([])
const isVisibleMessage = ref(false)
const onSelectUser = (userName: string) => {
  if (selectedUserList.value.includes(userName)) {
    selectedUserList.value = selectedUserList.value.filter((name) => name !== userName)
  } else {
    // if (selectedUserList.value.length >= 10) {
    //   isVisibleMessage.value = true
    //   return
    // }

    selectedUserList.value.push(userName)
  }
}

const findUserListByTier = computed(() => {
  const setSelectedUserList = selectedUserList.value.map((userName) => {
    return {
      name: userName.split(' (')[0],
      nickName: userName.split(' (')[1].slice(0, -1)
    }
  })

  const allUserListbyTier = Object.values(userList.value).flat()
  const setSelectedUserListByTier = setSelectedUserList.map((user) => {
    const findUser = allUserListbyTier
      .filter((item) => item.name === user.name && item.nickName === user.nickName)
      .sort((a, b) => b.point - a.point)

    return {
      ...user,
      tier: findUser as User[]
    }
  })

  return setSelectedUserListByTier
})

const teamList = ref<Team[]>([
  {
    top: null,
    jungle: null,
    mid: null,
    adc: null,
    sup: null
  },
  {
    top: null,
    jungle: null,
    mid: null,
    adc: null,
    sup: null
  }
])

const sumPoints = computed(() => {
  const firstTeamPoints = Object.values(teamList.value[0])
    .flat()
    .reduce((acc, cur) => {
      return acc + (cur?.point || 0)
    }, 0)

  const secondPoints = Object.values(teamList.value[1])
    .flat()
    .reduce((acc, cur) => {
      return acc + (cur?.point || 0)
    }, 0)

  return [firstTeamPoints, secondPoints]
})

const filterFindUserListByTier = computed(() => {
  const flatTeamList = teamList.value.flatMap((team) => Object.values(team).flat())
  const filterTeamList = findUserListByTier.value.filter(
    (originUser) =>
      !flatTeamList.find(
        (user) => user?.name === originUser.name && user?.nickName === originUser.nickName
      )
  )

  return filterTeamList
})

const selectedUserStyle = (userName: string) => {
  return selectedUserList.value.includes(userName) ? 'selected-user' : ''
}

type Position = 'top' | 'mid' | 'sup' | 'jungle' | 'adc'
interface Team {
  top: User | null
  jungle: User | null
  mid: User | null
  adc: User | null
  sup: User | null
}

const startDrag = (e: DragEvent, index: number) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('selectedUserIndex', `${index}`)
  }
}

const changeDrag = (e: DragEvent, teamNumber: number, position: Position) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('dragType', 'change')
    e.dataTransfer.setData('teamNumber', `${teamNumber}`)
    e.dataTransfer.setData('position', position)
  }
}

const onDrop = (e: DragEvent, teamNumber: number, position: Position) => {
  if (e.dataTransfer) {
    if (e.dataTransfer.getData('dragType') === 'change') {
      const originTeamNumber = Number(e.dataTransfer.getData('teamNumber'))
      const originTeamPosition = e.dataTransfer.getData('position') as Position
      const originUser = teamList.value[originTeamNumber][originTeamPosition] as User
      const changeTeamUser = teamList.value[teamNumber][position]

      const findOriginUser = findUserListByTier.value.find((user) => {
        return user.name === originUser?.name && user.nickName === originUser.nickName
      })?.tier
      const findOriginUserTier = findOriginUser?.find((tier) => {
        return tier.position === position
      })

      if (!findOriginUserTier) {
        teamList.value[teamNumber][position] = {
          name: originUser?.name,
          nickName: originUser?.nickName,
          position,
          point: 1
        }
      } else {
        teamList.value[teamNumber][position] = findOriginUserTier
      }

      if (changeTeamUser === null) {
        teamList.value[originTeamNumber][originTeamPosition] = null
        return
      }

      const findChangeUser = findUserListByTier.value.find((user) => {
        return user.name === changeTeamUser?.name && user.nickName === changeTeamUser?.nickName
      })?.tier

      const findChangeUserTier = findChangeUser?.find((tier) => {
        return tier.position === originTeamPosition
      })

      if (!findChangeUserTier) {
        teamList.value[originTeamNumber][originTeamPosition] = {
          name: changeTeamUser?.name,
          nickName: changeTeamUser?.nickName,
          position: originTeamPosition,
          point: 1
        }
      } else {
        teamList.value[originTeamNumber][originTeamPosition] = findChangeUserTier
      }

      return
    }

    const index = Number(e.dataTransfer.getData('selectedUserIndex'))
    const userTiers = filterFindUserListByTier.value[index].tier
    const findUserTier = userTiers.find((tier) => {
      return tier.position === position
    })

    if (!findUserTier) {
      teamList.value[teamNumber][position] = {
        name: filterFindUserListByTier.value[index].name,
        nickName: filterFindUserListByTier.value[index].nickName,
        position,
        point: 1
      }

      return
    }

    teamList.value[teamNumber][position] = findUserTier
  }
}
</script>

<style scoped lang="scss">
.create-match-root {
  .wrap-search-user-list {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0 10px 20px;

    :deep(.v-data-iterator) {
      width: 100%;
      max-width: 1280px;
    }

    .wrap-search-users-info {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;

      .user-name {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        padding: 0 10px;
        box-sizing: border-box;
        border: solid 1px #5382e8;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
        white-space: normal; /* 기본값으로 줄바꿈을 허용 */
        word-break: keep-all; /* 단어 단위로 줄바꿈 */
        overflow-wrap: break-word;
      }

      .selected-user {
        background-color: #5382e8;
        color: #fff;
      }
    }
  }

  .wrap-today-participant {
    display: flex;
    justify-content: center;
    padding: 20px 10px;
    width: 100%;

    .wrap-tables {
      width: 100%;
      max-width: 1280px;

      .today-participant {
        gap: 60px;

        .wrap-select-tier-table {
          gap: 12px;

          .select-tier-table {
            border: solid 1px #5382e8;
            width: 320px;
            border-radius: 4px;
            cursor: pointer;

            .tier-table-left {
              border-right: solid 1px #5382e8;
              padding: 10px;
              width: 50%;
            }

            .tier-table-right {
              width: 50%;
              padding: 10px;
              gap: 5px;
            }
          }
        }
      }
    }

    .participant-table {
      border-spacing: 0;
      table-layout: fixed;
      height: 400px;

      th {
        height: 25px;
      }

      td {
        height: 75px;
      }

      th,
      td {
        text-align: center;
        vertical-align: middle;
        border: solid 1px #000;
        padding: 10px;
        box-sizing: border-box;

        &:first-child,
        &:first-of-type {
          border-left-width: 0;
          border-top-width: 0;
        }
      }

      .position-user {
        gap: 10px;
        border: solid 1px #5382e8;
        width: 320px;
        border-radius: 4px;
        cursor: pointer;
        padding: 10px;
      }

      .header {
        th {
          border-top: 0;
          border-right: 0;
        }

        .first {
          border-left: 0;
        }
      }

      // 두 번째, 세 번째 td는 width 320px로
      td:nth-child(2),
      td:nth-child(3) {
        width: 341px;
      }
    }
  }
}
</style>
