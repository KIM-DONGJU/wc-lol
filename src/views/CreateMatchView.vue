<template>
  <div class="create-match-root">
    <v-card class="wrap-search-user-list" width="100%">
      <v-data-iterator
        :items="parsingGroupMembmers"
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
              :class="selectedUserStyle(item.raw)"
              @click="onSelectGroupMember(item.raw)"
            >
              {{ item.raw.name }} ({{ item.raw.nickname }})
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
          금일 내전 참가자 목록 ({{ selectedGroupMembers.length }}명)
        </p>
        <div v-if="selectedGroupMembers.length" class="today-participant d-flex mt-4">
          <div
            v-if="nonTeamSelectedMembers.length"
            class="d-flex flex-column wrap-select-tier-table"
          >
            <div
              v-for="(selectedMembers, index) in nonTeamSelectedMembers"
              :key="index"
              class="select-tier-table d-flex"
              @dragstart="startDrag($event, index)"
              draggable="true"
            >
              <p class="tier-table-left d-flex justify-center align-center text-center">
                {{ selectedMembers.name }}<br />
                ({{ selectedMembers.nickname }})
              </p>
              <div class="tier-table-right d-flex flex-column">
                <p
                  v-for="(score, position) in getMainPostionAndSubPosition(selectedMembers)"
                  :key="position"
                  class="flex-1-1"
                >
                  {{ LINE[position] }}: {{ score }}점
                </p>
              </div>
              <v-tooltip activator="parent" location="top">
                <p v-for="(score, key) in selectedMembers.positionScore" :key="key">
                  {{ LINE[key] }}: {{ score }}점
                </p>
              </v-tooltip>
            </div>
          </div>
          <table class="participant-table">
            <tr class="header">
              <th></th>
              <th class="first text-h5">1팀</th>
              <th class="second text-h5">2팀</th>
            </tr>
            <tr v-for="(position, index) in positionList" :key="index">
              <td>{{ position.label }}</td>
              <td
                @drop.prevent="onDrop($event, 0, position.value)"
                @dragenter.prevent
                @dragover.prevent
              >
                <div
                  v-if="teamList[0][position.value]"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 0, position.value)"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[0][position.value]?.name }}</p>
                    <p>({{ teamList[0][position.value]?.nickname }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[0][position.value]?.positionScore[position.value] }}점</p>
                  </div>
                  <v-tooltip activator="parent" location="top">
                    <p
                      v-for="(score, key) in teamList[0][position.value]?.positionScore"
                      :key="key"
                    >
                      {{ LINE[key] }}: {{ score }}점
                    </p>
                  </v-tooltip>
                </div>
              </td>
              <td
                @drop.prevent="onDrop($event, 1, position.value)"
                @dragenter.prevent
                @dragover.prevent
              >
                <div
                  v-if="teamList[1][position.value]"
                  class="position-user d-flex justify-center align-center"
                  draggable="true"
                  @dragstart="changeDrag($event, 1, position.value)"
                >
                  <div class="w-50 text-center">
                    <p>{{ teamList[1][position.value]?.name }}</p>
                    <p>({{ teamList[1][position.value]?.nickname }})</p>
                  </div>
                  <div class="w-50 text-center">
                    <p>{{ teamList[1][position.value]?.positionScore[position.value] }}점</p>
                  </div>
                  <v-tooltip activator="parent" location="top">
                    <p
                      v-for="(score, key) in teamList[1][position.value]?.positionScore"
                      :key="key"
                    >
                      {{ LINE[key] }}: {{ score }}점
                    </p>
                  </v-tooltip>
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
import { useUsersStore, type GroupMember, type Position, type User } from '@/stores/users'
import { computed, ref } from 'vue'

const usersStore = useUsersStore()

const positionList = [
  {
    label: '탑',
    value: 'top'
  },
  {
    label: '정글',
    value: 'jungle'
  },
  {
    label: '미드',
    value: 'mid'
  },
  {
    label: '원딜',
    value: 'adc'
  },
  {
    label: '서폿',
    value: 'sup'
  }
] as const

const search = ref('')

const parsingGroupMembmers = computed(() => {
  return usersStore.groupMembers
})

const selectedGroupMembers = ref<GroupMember[]>([])
const isVisibleMessage = ref(false)
const onSelectGroupMember = (groupMember: GroupMember) => {
  const findGroupMemberIndex = selectedGroupMembers.value.findIndex(
    (item) => item.name === groupMember.name && item.nickname === groupMember.nickname
  )

  if (findGroupMemberIndex !== -1) {
    selectedGroupMembers.value.splice(findGroupMemberIndex, 1)
    return
  }

  selectedGroupMembers.value.push(groupMember)
}

const teamList = ref<Record<Position, GroupMember | null>[]>([
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
  const firstTeamPoints = Object.entries(teamList.value[0]).reduce((total, [key, value]) => {
    const positionKey = key as Position
    return total + (value?.positionScore[positionKey] || 0)
  }, 0)

  const secondPoints = Object.entries(teamList.value[1]).reduce((total, [key, value]) => {
    const positionKey = key as Position
    return total + (value?.positionScore[positionKey] || 0)
  }, 0)

  return [firstTeamPoints, secondPoints]
})

const selectedUserStyle = (groupMember: GroupMember) => {
  const findGroupMember = selectedGroupMembers.value.find((item) => item.id === groupMember.id)

  return findGroupMember ? 'selected-user' : ''
}

const nonTeamSelectedMembers = computed(() => {
  const flatTeamList = teamList.value.flatMap((team) => Object.values(team).flat())
  const filterTeamList = selectedGroupMembers.value.filter(
    (originUser) =>
      !flatTeamList.find(
        (user) => user?.name === originUser.name && user?.nickname === originUser.nickname
      )
  )

  return filterTeamList
})

const startDrag = (e: DragEvent, index: number) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('selectedGroupMemberIndex', `${index}`)
  }
}

const changeDrag = (e: DragEvent, teamNumber: number, position: Position) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('dragType', 'change')
    e.dataTransfer.setData('teamNumber', `${teamNumber}`)
    e.dataTransfer.setData('position', position)
  }
}

const getMainPostionAndSubPosition = (groupMember: GroupMember) => {
  const mainPositionScore = groupMember.positionScore[groupMember.mainPosition]
  const position: Partial<Record<Position, number>> = {
    [groupMember.mainPosition]: mainPositionScore
  }

  if (groupMember.subPosition) {
    position[groupMember.subPosition] = groupMember.positionScore[groupMember.subPosition]
  }

  return position
}

const onDrop = (e: DragEvent, teamNumber: number, position: Position) => {
  if (e.dataTransfer) {
    if (e.dataTransfer.getData('dragType') === 'change') {
      const originTeamNumber = Number(e.dataTransfer.getData('teamNumber'))
      const originTeamPosition = e.dataTransfer.getData('position') as Position
      const originMember = teamList.value[originTeamNumber][originTeamPosition] as GroupMember
      const changeTeamMember = teamList.value[teamNumber][position]

      const findOriginMember = selectedGroupMembers.value.find((member) => {
        return member.id === originMember.id
      })
      teamList.value[teamNumber][position] = findOriginMember || null
      if (changeTeamMember === null) {
        teamList.value[originTeamNumber][originTeamPosition] = null
        return
      }

      const findChangeUser = selectedGroupMembers.value.find((member) => {
        return member.id === changeTeamMember.id
      })
      teamList.value[originTeamNumber][originTeamPosition] = findChangeUser || null
      return
    }

    const index = Number(e.dataTransfer.getData('selectedGroupMemberIndex'))
    teamList.value[teamNumber][position] = nonTeamSelectedMembers.value[index]

    return
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
