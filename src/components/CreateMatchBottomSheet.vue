<template>
  <VBottomSheet
    v-model="bindCreateMatchBottomSheet"
    fullscreen
    class="create-match-bottom-sheet-root"
  >
    <div class="wrap-bottom-sheet-info">
      <div class="wrap-search-user-list">
        <v-data-iterator
          :items="parsingGroupMembers"
          :items-per-page="30"
          :search="search"
          width="100%"
        >
          <template #header>
            <div class="d-flex justify-space-between align-center">
              <p class="font-weight-bold text-h5">{{ matchGroupName }} 참가자 검색 및 등록</p>
              <VBtn variant="tonal" width="100px" size="x-large" @click="closeBottomSheet">
                닫기
              </VBtn>
            </div>
            <v-text-field
              v-model="search"
              :base-color="styles.primary"
              :color="styles.primary"
              class="mt-6"
              style="max-width: 300px"
              width="100%"
              variant="outlined"
              density="compact"
              placeholder="이름, 닉네임 검색"
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
            />
          </template>
          <template #default="{ items }">
            <div class="wrap-search-users-info mt-5">
              <div
                v-for="(item, index) in items"
                :key="index"
                :class="selectedUserStyle(item.raw)"
                class="user-name"
                @click="onSelectGroupMember(item.raw)"
              >
                {{ item.raw.name }} ({{ item.raw.nickname }})
              </div>
            </div>
          </template>
          <template #footer="{ page, pageCount, prevPage, nextPage }">
            <div class="d-flex align-center justify-center pa-4">
              <v-btn
                :disabled="page === 1"
                density="comfortable"
                icon="mdi-arrow-left"
                rounded
                variant="tonal"
                @click="prevPage"
              />

              <div class="mx-2 text-caption">Page {{ page }} of {{ pageCount }}</div>

              <v-btn
                :disabled="page >= pageCount"
                density="comfortable"
                icon="mdi-arrow-right"
                rounded
                variant="tonal"
                @click="nextPage"
              />
            </div>
          </template>
        </v-data-iterator>
      </div>
      <div class="wrap-today-participant">
        <div class="wrap-tables">
          <p class="font-weight-bold text-h6">
            {{ matchGroupName }} 참가자 목록 ({{ selectedGroupMembers.length }}명)
          </p>
          <div
            v-if="selectedGroupMembers.length"
            class="today-participant d-flex justify-center mt-4"
          >
            <div
              v-if="nonTeamSelectedMembers.length"
              class="d-flex flex-column wrap-select-tier-table"
            >
              <div
                v-for="(selectedMembers, index) in nonTeamSelectedMembers"
                :key="index"
                class="select-tier-table d-flex"
                draggable="true"
                @dragstart="startDrag($event, index)"
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
                    {{ POSITION_KR[position] }}: {{ score }}점
                  </p>
                </div>
                <v-tooltip activator="parent" location="top">
                  <p v-for="(score, key) in selectedMembers.positionScore" :key="key">
                    {{ POSITION_KR[key] }}: {{ score }}점
                  </p>
                </v-tooltip>
              </div>
            </div>
            <div>
              <table class="participant-table">
                <tr class="header">
                  <th></th>
                  <th class="first text-h5">1팀</th>
                  <th class="second text-h5">2팀</th>
                </tr>
                <tr v-for="(position, key) in POSITION_KR" :key="key">
                  <td>{{ position }}</td>
                  <td @dragenter.prevent @dragover.prevent @drop.prevent="onDrop($event, 0, key)">
                    <div
                      v-if="teamList[0][key]"
                      class="position-user d-flex justify-center align-center"
                      draggable="true"
                      @dragstart="changeDrag($event, 0, key)"
                    >
                      <div class="w-50 text-center">
                        <p>{{ teamList[0][key]?.name }}</p>
                        <p>({{ teamList[0][key]?.nickname }})</p>
                      </div>
                      <div class="w-50 text-center">
                        <p>{{ teamList[0][key]?.positionScore[key] }}점</p>
                      </div>
                      <v-tooltip activator="parent" location="top">
                        <p
                          v-for="(score, positionScoreKey) in teamList[0][key]?.positionScore"
                          :key="positionScoreKey"
                        >
                          {{ POSITION_KR[positionScoreKey] }}: {{ score }}점
                        </p>
                      </v-tooltip>
                    </div>
                  </td>
                  <td @dragenter.prevent @dragover.prevent @drop.prevent="onDrop($event, 1, key)">
                    <div
                      v-if="teamList[1][key]"
                      class="position-user d-flex justify-center align-center"
                      draggable="true"
                      @dragstart="changeDrag($event, 1, key)"
                    >
                      <div class="w-50 text-center">
                        <p>{{ teamList[1][key]?.name }}</p>
                        <p>({{ teamList[1][key]?.nickname }})</p>
                      </div>
                      <div class="w-50 text-center">
                        <p>{{ teamList[1][key]?.positionScore[key] }}점</p>
                      </div>
                      <v-tooltip activator="parent" location="top">
                        <p
                          v-for="(score, positionScoreKey) in teamList[1][key]?.positionScore"
                          :key="positionScoreKey"
                        >
                          {{ POSITION_KR[positionScoreKey] }}: {{ score }}점
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
              <div class="wrap-buttons d-flex justify-end mt-6">
                <VBtn :color="styles.primary" size="x-large" variant="tonal" @click="createMatch">
                  대전 생성
                </VBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </VBottomSheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { type GroupMember, type Position, useUsersStore } from '@/stores/useUsers';
import { useMatchStore } from '@/stores/useMatch';
import { useCommonStore } from '@/stores/useCommon';
import { useAuthStore } from '@/stores/useAuth';
import { POSITION_KR } from '@/constants/position';

import styles from '@/styles/_export.module.scss';

const props = defineProps<{
  modelValue: boolean;
  matchGroupId: null | number;
  matchGroupName?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const usersStore = useUsersStore();
const matchStore = useMatchStore();
const commonStore = useCommonStore();
const authStore = useAuthStore();

const bindCreateMatchBottomSheet = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const closeBottomSheet = () => {
  bindCreateMatchBottomSheet.value = false;
};

const search = ref('');

const parsingGroupMembers = computed(() => {
  return usersStore.groupMembers;
});

const selectedGroupMembers = ref<GroupMember[]>([]);
const selectedUserStyle = (groupMember: GroupMember) => {
  const findGroupMember = selectedGroupMembers.value.find((item) => item.id === groupMember.id);

  return findGroupMember ? 'selected-user' : '';
};

const onSelectGroupMember = (groupMember: GroupMember) => {
  const findGroupMemberIndex = selectedGroupMembers.value.findIndex(
    (item) => item.name === groupMember.name && item.nickname === groupMember.nickname
  );

  if (findGroupMemberIndex !== -1) {
    selectedGroupMembers.value.splice(findGroupMemberIndex, 1);
    return;
  }

  selectedGroupMembers.value.push(groupMember);
};

const teamList = ref<Record<Position, GroupMember | null>[]>([
  {
    top: null,
    jungle: null,
    mid: null,
    adc: null,
    sup: null,
  },
  {
    top: null,
    jungle: null,
    mid: null,
    adc: null,
    sup: null,
  },
]);

const nonTeamSelectedMembers = computed(() => {
  const flatTeamList = teamList.value.flatMap((team) => Object.values(team).flat());
  const filterTeamList = selectedGroupMembers.value.filter(
    (originUser) =>
      !flatTeamList.find(
        (user) => user?.name === originUser.name && user?.nickname === originUser.nickname
      )
  );

  return filterTeamList;
});

const startDrag = (e: DragEvent, index: number) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('selectedGroupMemberIndex', `${index}`);
  }
};

const changeDrag = (e: DragEvent, teamNumber: number, position: Position) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('dragType', 'change');
    e.dataTransfer.setData('teamNumber', `${teamNumber}`);
    e.dataTransfer.setData('position', position);
  }
};

const getMainPostionAndSubPosition = (groupMember: GroupMember) => {
  const mainPositionScore = groupMember.positionScore[groupMember.mainPosition];
  const position: Partial<Record<Position, number>> = {
    [groupMember.mainPosition]: mainPositionScore,
  };

  if (groupMember.subPosition) {
    position[groupMember.subPosition] = groupMember.positionScore[groupMember.subPosition];
  }

  return position;
};

const onDrop = (e: DragEvent, teamNumber: number, position: Position) => {
  if (e.dataTransfer) {
    if (e.dataTransfer.getData('dragType') === 'change') {
      const originTeamNumber = Number(e.dataTransfer.getData('teamNumber'));
      const originTeamPosition = e.dataTransfer.getData('position') as Position;
      const originMember = teamList.value[originTeamNumber][originTeamPosition] as GroupMember;
      const changeTeamMember = teamList.value[teamNumber][position];

      const findOriginMember = selectedGroupMembers.value.find((member) => {
        return member.id === originMember.id;
      });
      teamList.value[teamNumber][position] = findOriginMember || null;
      if (changeTeamMember === null) {
        teamList.value[originTeamNumber][originTeamPosition] = null;
        return;
      }

      const findChangeUser = selectedGroupMembers.value.find((member) => {
        return member.id === changeTeamMember.id;
      });
      teamList.value[originTeamNumber][originTeamPosition] = findChangeUser || null;
      return;
    }

    const index = Number(e.dataTransfer.getData('selectedGroupMemberIndex'));
    teamList.value[teamNumber][position] = nonTeamSelectedMembers.value[index];
  }
};

const sumPoints = computed(() => {
  const firstTeamPoints = Object.entries(teamList.value[0]).reduce((total, [key, value]) => {
    const positionKey = key as Position;
    return total + (value?.positionScore[positionKey] || 0);
  }, 0);

  const secondPoints = Object.entries(teamList.value[1]).reduce((total, [key, value]) => {
    const positionKey = key as Position;
    return total + (value?.positionScore[positionKey] || 0);
  }, 0);

  return [firstTeamPoints, secondPoints];
});

const createMatch = async () => {
  if (!authStore.user?.id) {
    commonStore.showToast({
      message: '로그인이 필요합니다.',
      color: 'error',
    });

    return;
  }

  if (!props.matchGroupId) {
    commonStore.showToast({
      message: '대전 그룹을 선택해 주세요.',
      color: 'error',
    });
    return;
  }

  if (teamList.value.some((team) => Object.values(team).some((user) => !user))) {
    commonStore.showToast({
      message: '팀원을 모두 배치해 주세요.',
      color: 'error',
    });
    return;
  }

  try {
    commonStore.setLoadingSpinner(true);
    const data = await matchStore.createMatch({
      groupId: props.matchGroupId,
      teams: teamList.value as Record<Position, GroupMember>[],
    });

    if (data && data.length > 0) {
      matchStore.unshiftMatch(data[0]);
      commonStore.showToast({
        message: '대전이 생성되었습니다.',
        color: 'success',
      });
    }

    closeBottomSheet();
  } catch (err) {
    console.log(err);
  } finally {
    commonStore.setLoadingSpinner(false);
  }
};
</script>
<style lang="scss" scoped>
.create-match-bottom-sheet-root {
  .wrap-bottom-sheet-info {
    height: 100%;
    padding: 20px;
    overflow: auto;
    background-color: #fff;

    .wrap-search-user-list {
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 0 10px 20px;
      background-color: #fff;

      :deep(.v-data-iterator) {
        width: 100%;
        max-width: 1280px;
      }

      .wrap-search-users-info {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
        width: 100%;

        .user-name {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          padding: 0 10px;
          font-size: 14px;
          line-height: 20px;
          text-align: center;
          word-break: keep-all; /* 단어 단위로 줄바꿈 */
          overflow-wrap: break-word;
          white-space: normal; /* 기본값으로 줄바꿈을 허용 */
          cursor: pointer;
          border: solid 1px #5382e8;
          border-radius: 4px;
        }

        .selected-user {
          color: #fff;
          background-color: #5382e8;
        }
      }
    }

    .wrap-today-participant {
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 20px 10px;
      background-color: #fff;

      .wrap-tables {
        width: 100%;
        max-width: 1280px;

        .today-participant {
          gap: 60px;

          .wrap-select-tier-table {
            gap: 12px;

            .select-tier-table {
              width: 320px;
              cursor: pointer;
              border: solid 1px #5382e8;
              border-radius: 4px;

              .tier-table-left {
                width: 50%;
                padding: 10px;
                border-right: solid 1px #5382e8;
              }

              .tier-table-right {
                gap: 5px;
                width: 50%;
                padding: 10px;
              }
            }
          }
        }
      }

      .participant-table {
        height: 400px;
        table-layout: fixed;
        border-spacing: 0;

        th {
          height: 25px;
        }

        td {
          height: 75px;
        }

        th,
        td {
          box-sizing: border-box;
          padding: 10px;
          text-align: center;
          vertical-align: middle;
          border: solid 1px #000;

          &:first-child,
          &:first-of-type {
            border-top-width: 0;
            border-left-width: 0;
          }
        }

        .position-user {
          gap: 10px;
          width: 320px;
          padding: 10px;
          cursor: pointer;
          border: solid 1px #5382e8;
          border-radius: 4px;
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
}
</style>
