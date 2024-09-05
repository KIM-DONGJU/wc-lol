<template>
  <div class="create-match-root">
    <div v-show="winningTeamSelectIndex !== null" class="dim" @click="cancelSelectWiningTeam"></div>
    <div class="wrap-create-match-group d-flex justify-center align-center">
      <div class="w-100 px-3 wrap-buttons d-flex justify-space-between align-center">
        <div class="flex-1-1 d-flex align-center">
          <VSelect
            v-model="selectMatchGroupId"
            :items="matchGroupsSelectLabel"
            label="대전 그룹 선택"
            width="100%"
            max-width="250px"
            variant="outlined"
            no-data-text="대전 그룹이 없습니다."
            placeholder="대전 그룹을 선택해 주세요."
            hide-details
          />
          <VBtn
            :color="styles.primary"
            :base-color="styles.primary"
            class="ml-3"
            size="x-large"
            height="56px"
            variant="outlined"
            @click="insertMatchGroup"
          >
            대전 그룹 생성
          </VBtn>
        </div>
        <div v-if="!selectedMatchGroup?.is_fixed" class="d-flex align-center">
          <VBtn
            v-if="selectedMatchGroup && matches.length > 0"
            :color="styles.primary"
            variant="tonal"
            @click="openMatchGroupVictoryConfirmModal"
          >
            승자 확정
          </VBtn>
          <VBtn
            v-if="selectMatchGroupId"
            :color="styles.error"
            class="ml-3"
            @click="openDeleteMatchGroupConfirmModal"
          >
            대전 그룹 삭제
          </VBtn>
        </div>
      </div>
    </div>
    <VDivider class="mt-6" />
    <div class="mt-10 wrap-create-match d-flex flex-column justify-center align-center">
      <div v-if="!selectMatchGroupId" class="w-100 d-flex flex-column justify-center align-center">
        <VImg src="@/assets/images/error/secure_data.svg" width="100%" max-width="400px" />
        <p class="mt-10 w-100 d-flex flex-column justify-center align-center">
          <span class="text-h6 text-center">대전 그룹을 선택해 주세요 </span>
        </p>
      </div>
      <template v-else>
        <div
          v-if="matches && !matches.length"
          class="w-100 d-flex flex-column justify-center align-center"
        >
          <VImg src="@/assets/images/error/cancel.svg" width="100%" max-width="400px" />
          <p class="mt-10 w-100 d-flex flex-column justify-center align-center">
            <span class="font-weight-bold text-h5 text-center">{{
              selectedMatchGroup.group_name
            }}</span>
            <span class="mt-2 text-h6 text-center">대전 그룹에 생성된 대전이 없습니다. </span>
          </p>
        </div>
        <div v-else class="wrap-matches d-flex flex-column">
          <div
            v-for="(match, index) in matches"
            :key="match.id"
            :class="getSelectWinningTeamClass(index)"
            class="wrap-match pa-5"
          >
            <div class="match-round pb-1 d-flex justify-space-between">
              <p class="text-h6 text-primary font-weight-bold">{{ matches.length - index }}경기</p>
              <div v-if="!selectedMatchGroup?.is_fixed" class="d-flex">
                <VBtn
                  v-if="winningTeamSelectIndex === null || winningTeamSelectIndex !== index"
                  :color="styles.primary"
                  size="small"
                  @click="selectReadyWinningTeam(index)"
                >
                  <span class="mr-1"> 승리팀 </span>
                  <span v-if="match.wining_team_number === null"> 선택 </span>
                  <span v-else> 변경 </span>
                </VBtn>
                <VBtn v-else :color="styles.error" size="small" @click="cancelSelectWiningTeam">
                  취소
                </VBtn>
                <VBtn
                  :disabled="winningTeamSelectIndex !== null"
                  size="small"
                  class="ml-2"
                  @click="openUpdateMatchBottomSheet(match, index)"
                >
                  수정
                </VBtn>
              </div>
            </div>
            <div class="match mt-5 d-flex flex-column">
              <div
                v-for="(team, teamIndex) in match.teams"
                :key="teamIndex"
                :class="getLoseTeamClass(match, teamIndex)"
                class="wrap-member d-flex align-center"
                @click="selectWinningTeam(match, index, teamIndex)"
              >
                <div
                  v-for="position in POSITION_LIST"
                  :key="position"
                  class="member d-flex flex-column justify-center align-center"
                >
                  <p class="member-name d-flex align-center text-center">
                    {{ team[position].name }}
                  </p>
                  <p class="member-nickname mt-1 text-center">{{ team[position].nickname }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!selectedMatchGroup?.is_fixed"
          :class="winningTeamSelectIndex !== null && 'opacity-20'"
          class="mt-10 px-5 create-match w-100 d-flex justify-end"
        >
          <VBtn
            :color="styles.primary"
            variant="tonal"
            size="x-large"
            @click="openCreateMatchBottomSheet"
          >
            대전 생성
          </VBtn>
        </div>
      </template>
    </div>
    <CreateMatchGroupModal v-model:dialog="isVisibleCreateMatchGroupModal" />
    <CreateMatchBottomSheet
      v-if="isVisibleCreateMatchBottomSheet"
      v-model="isVisibleCreateMatchBottomSheet"
      :match-group="selectedMatchGroup"
    />
    <UpdateMatchBottomSheet
      v-if="isVisibleUpdateMatchBottomSheet"
      v-model="isVisibleUpdateMatchBottomSheet"
      :match="updatingMatch"
      :match-group="selectedMatchGroup"
      :match-index="updatingMatchIndex"
    />
    <DeleteMatchGroupConfirmModal
      v-model:dialog="isVisibleDeleteMatchGroupConfirmModal"
      :match-group="selectedMatchGroup"
      @confirm="deleteMatchGroup"
    />
    <MatchGroupVictoryConfirmModal
      v-model:dialog="isVisibleMatchGroupVictoryConfirmModal"
      :match-group="selectedMatchGroup"
      @confirm="onMatchGroupVictoryConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useAuthStore } from '@/stores/useAuth';
import { useCommonStore } from '@/stores/useCommon';
import { type Match, type MatchGroup, useMatchStore } from '@/stores/useMatch';

import CreateMatchGroupModal from '@/components/CreateMatchGroupModal.vue';

import styles from '@/styles/_export.module.scss';
import CreateMatchBottomSheet from '@/components/CreateMatchBottomSheet.vue';
import UpdateMatchBottomSheet from '@/components/UpdateMatchBottomSheet.vue';
import DeleteMatchGroupConfirmModal from '@/components/DeleteMatchGroupConfirmModal.vue';
import MatchGroupVictoryConfirmModal from '@/components/MatchGroupVictoryConfirmModal.vue';
import { POSITION_LIST } from '@/constants/position';

const authStore = useAuthStore();
const commonStore = useCommonStore();
const matchStore = useMatchStore();

const selectMatchGroupId = ref<null | number>(null);
const isVisibleCreateMatchGroupModal = ref(false);

const insertMatchGroup = () => {
  if (!authStore.user?.id) {
    commonStore.showToast({
      message: '로그인이 필요합니다.',
      color: 'error',
    });

    return;
  }

  isVisibleCreateMatchGroupModal.value = true;
};

const getMatchGroups = async () => {
  if (matchStore.matchGroups) {
    return;
  }

  try {
    commonStore.setLoadingSpinner(true);

    const data = await matchStore.getMatchGroupsTwelveHoursAgo();
    if (data && data.length > 0) {
      matchStore.setMatchGroups(data);
    }
  } catch (err) {
    console.log(err);
  } finally {
    commonStore.setLoadingSpinner(false);
  }
};

getMatchGroups();
const matchGroupsSelectLabel = computed(() => {
  return matchStore.matchGroups?.map((item) => {
    return {
      title: item.group_name,
      value: item.id,
    };
  });
});

const selectedMatchGroup = computed(() => {
  return matchStore.matchGroups?.find((item) => item.id === selectMatchGroupId.value) as MatchGroup;
});

const isVisibleCreateMatchBottomSheet = ref(false);
const openCreateMatchBottomSheet = () => {
  if (!selectMatchGroupId.value) {
    return;
  }

  if (!authStore.user?.id) {
    commonStore.showToast({
      message: '로그인이 필요합니다.',
      color: 'error',
    });

    return;
  }

  isVisibleCreateMatchBottomSheet.value = true;
};

const matches = computed(() => matchStore.matches);
const isVisibleMatchGroupVictoryConfirmModal = ref(false);
const openMatchGroupVictoryConfirmModal = () => {
  isVisibleMatchGroupVictoryConfirmModal.value = true;
};

const onMatchGroupVictoryConfirm = async () => {
  if (!selectMatchGroupId.value) {
    return;
  }

  if (authStore.user?.id !== selectedMatchGroup.value?.creator_id) {
    commonStore.showToast({
      message: '대전 그룹을 만든 사람만 승자 팀을 확정할 수 있습니다.',
      color: 'error',
    });

    return;
  }

  const isEveryMatchWinningTeamSelected = matches.value.every(
    (match) => match.wining_team_number !== null
  );

  if (!isEveryMatchWinningTeamSelected) {
    commonStore.showToast({
      message: '모든 경기의 승리팀을 선택해 주세요.',
      color: 'error',
    });

    return;
  }

  let firstTeamWinCount = 0;
  let secondTeamWinCount = 0;

  matches.value.forEach((match) => {
    if (match.wining_team_number === 0) {
      firstTeamWinCount += 1;
    } else {
      secondTeamWinCount += 1;
    }
  });

  let winnerGroupMemberIds: number[] = [];
  let loserGroupMemberIds: number[] = [];

  if (firstTeamWinCount !== secondTeamWinCount) {
    const lastMatches = matches.value[matches.value.length - 1];

    if (firstTeamWinCount > secondTeamWinCount) {
      winnerGroupMemberIds = Object.values(lastMatches.teams[0]).map((member) => member.id);
      loserGroupMemberIds = Object.values(lastMatches.teams[1]).map((member) => member.id);
    } else {
      winnerGroupMemberIds = Object.values(lastMatches.teams[1]).map((member) => member.id);
      loserGroupMemberIds = Object.values(lastMatches.teams[0]).map((member) => member.id);
    }
  }

  try {
    commonStore.setLoadingSpinner(true);

    const data = await matchStore.onFixedGroupMatch({
      groupId: selectMatchGroupId.value,
      winnerGroupMemberIds,
      loserGroupMemberIds,
    });

    if (data && data.length > 0) {
      commonStore.showToast({
        message: '승자 팀이 확정되었습니다.',
        color: 'success',
      });

      matchStore.setMatchGroup(data[0]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    isVisibleMatchGroupVictoryConfirmModal.value = false;
    commonStore.setLoadingSpinner(false);
  }
};

const isVisibleDeleteMatchGroupConfirmModal = ref(false);
const openDeleteMatchGroupConfirmModal = () => {
  isVisibleDeleteMatchGroupConfirmModal.value = true;
};
const deleteMatchGroup = async () => {
  if (!selectMatchGroupId.value) {
    return;
  }

  if (authStore.user?.id !== selectedMatchGroup.value?.creator_id) {
    commonStore.showToast({
      message: '대전 그룹을 만든 사람만 삭제할 수 있습니다.',
      color: 'error',
    });

    return;
  }

  if (selectedMatchGroup.value?.is_fixed) {
    commonStore.showToast({
      message: '대전 그룹이 확정되어 삭제할 수 없습니다.',
      color: 'error',
    });

    return;
  }

  try {
    commonStore.setLoadingSpinner(true);
    const data = await matchStore.deleteMatchGroup(selectMatchGroupId.value);

    if (data && data.length > 0) {
      commonStore.showToast({
        message: '대전 그룹이 삭제되었습니다.',
        color: 'success',
      });

      matchStore.removeMatchGroupByGroupId(data[0].id);
      matchStore.setMatches([]);
      selectMatchGroupId.value = null;
    }
  } catch (err) {
    console.log(err);
  } finally {
    isVisibleDeleteMatchGroupConfirmModal.value = false;
    commonStore.setLoadingSpinner(false);
  }
};

const getMatches = async () => {
  if (!selectMatchGroupId.value) {
    return;
  }

  try {
    commonStore.setLoadingSpinner(true);
    const data = await matchStore.getMatchesByGroupId(selectMatchGroupId.value);

    if (data) {
      matchStore.setMatches(data);
    }
  } catch (err) {
    console.log(err);
  } finally {
    commonStore.setLoadingSpinner(false);
  }
};

watch(
  () => selectMatchGroupId.value,
  () => {
    getMatches();
  }
);

const winningTeamSelectIndex = ref<null | number>(null);
const selectReadyWinningTeam = (index: number) => {
  winningTeamSelectIndex.value = index;
};

const selectWinningTeam = async (match: Match, matchIndex: number, teamIndex: number) => {
  if (winningTeamSelectIndex.value === null) {
    return;
  }

  if (winningTeamSelectIndex.value !== matchIndex) {
    return;
  }

  if (match.wining_team_number === teamIndex) {
    commonStore.showToast({
      message: '기존 승리팀과 동일한 팀을 선택할 수 없습니다.',
      color: 'error',
    });

    winningTeamSelectIndex.value = null;
    return;
  }

  try {
    commonStore.setLoadingSpinner(true);
    const data = await matchStore.selectWinningTeam({
      matchId: match.id,
      winningTeamNumber: teamIndex,
    });
    if (data && data.length > 0) {
      const message =
        match.wining_team_number === null ? '승리팀이 선택되었습니다.' : '승리팀이 변경되었습니다.';

      matchStore.setMatch(data[0]);
      commonStore.showToast({
        message,
        color: 'success',
      });
      winningTeamSelectIndex.value = null;
    }
  } catch (err) {
    console.log(err);
  } finally {
    commonStore.setLoadingSpinner(false);
  }
};

const cancelSelectWiningTeam = () => {
  winningTeamSelectIndex.value = null;
};

const getLoseTeamClass = (match: Match, teamIndex: number) => {
  if (
    winningTeamSelectIndex.value === null &&
    match.wining_team_number !== null &&
    match.wining_team_number !== teamIndex
  ) {
    return 'opacity-20';
  }

  return '';
};

const getSelectWinningTeamClass = (teamIndex: number) => {
  if (winningTeamSelectIndex.value === null) {
    return '';
  }

  return {
    'selected-team': winningTeamSelectIndex.value === teamIndex,
    'opacity-20': winningTeamSelectIndex.value !== teamIndex,
    'back-team': winningTeamSelectIndex.value !== teamIndex,
  };
};

const isVisibleUpdateMatchBottomSheet = ref(false);
const updatingMatch = ref<null | Match>(null);
const updatingMatchIndex = ref(-1);

const openUpdateMatchBottomSheet = (match: Match, index: number) => {
  updatingMatch.value = match;
  updatingMatchIndex.value = index;
  isVisibleUpdateMatchBottomSheet.value = true;
};
</script>

<style scoped lang="scss">
.create-match-root {
  .dim {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    background-color: rgb(0 0 0 / 50%);
  }

  .wrap-buttons {
    max-width: 1280px;
  }

  .wrap-create-match {
    .create-match {
      width: 100%;
      max-width: 660px;
    }

    .wrap-matches {
      gap: 40px;
      width: 100%;
      max-width: 660px;

      .selected-team {
        z-index: 20;
        background-color: #fff;
        border-radius: 4px;

        .wrap-member {
          cursor: pointer;
          opacity: 0.3;

          &:hover {
            opacity: 1;
          }
        }
      }

      .back-team {
        z-index: -1;
      }

      .match-round {
        border-bottom: solid 2px $color-primary;
      }

      .wrap-match {
        .match {
          gap: 10px;

          .wrap-member {
            gap: 10px;

            .member {
              flex: 1;
              max-width: 124px;
              height: 64px;
              border: solid 0.5px #525c65;
              border-radius: 2px;

              .member-name {
                min-width: 40px;
                height: 20px;
                padding: 2px 4px;
                font-size: 12px;
                color: #fff;
                background-color: #525c65;
                border-radius: 2px;
              }

              .member-nickname {
                font-size: 14px;
                color: #525c65;
              }
            }

            &:nth-child(2) .member {
              border: solid 0.5px $color-primary;

              .member-name {
                background-color: $color-primary;
              }
            }
          }
        }
      }
    }
  }
}
</style>
