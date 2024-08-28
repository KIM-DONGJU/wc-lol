<template>
  <div class="member-list-root">
    <div class="wrap-member-list">
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
      />
    </div>
    <div class="wrap-tier-table">
      <header class="tier-table-header">
        <p>이름</p>
        <p>닉네임</p>
        <p>탑</p>
        <p>정글</p>
        <p>미드</p>
        <p>원딜</p>
        <p>서폿</p>
      </header>
      <div
        v-for="(groupMember, index) in groupMembers"
        :key="index"
        :class="isAdmin && 'cursor-pointer'"
        class="tier-table"
        @click="goMemberDetail(groupMember)"
      >
        <p>
          {{ groupMember.name }}
        </p>
        <p>
          {{ groupMember.nickname }}
        </p>
        <p
          v-for="position in POSITION_LIST"
          :key="position"
          :class="getHighlightPosition(groupMember, position)"
        >
          {{ groupMember.positionScore[position] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { type GroupMember, useUsersStore } from '@/stores/useUsers';

import { POSITION_LIST } from '@/constants/position';
import styles from '@/styles/_export.module.scss';
import { USER_DETAIL } from '@/constants/routes';

const router = useRouter();
const usersStore = useUsersStore();

const searchInput = ref('');
const groupMembers = computed(() => {
  const trimSearchInput = searchInput.value.trim();

  if (!trimSearchInput) {
    return usersStore.groupMembers;
  }

  return usersStore.groupMembers.filter((user) => {
    return user.name.includes(trimSearchInput) || user.nickname.includes(trimSearchInput);
  });
});

const getHighlightPosition = (groupMember: GroupMember, position: string) => {
  if (position === groupMember.mainPosition) {
    return 'main-position';
  }

  if (position === groupMember.subPosition) {
    return 'sub-position';
  }
};

const goMemberDetail = (member: GroupMember) => {
  if (!isAdmin.value) {
    return;
  }

  router.push({
    name: USER_DETAIL.name,
    params: {
      id: member.id.toString(),
    },
  });
};

const isAdmin = computed(() => usersStore.currentMemberInGroup?.role === 'admin');
</script>
<style lang="scss" scoped>
.member-list-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px 20px;

  .wrap-member-list {
    width: 100%;
    max-width: 600px;
  }

  .wrap-tier-table {
    width: 100%;
    max-width: 600px;

    .tier-table-header {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 2fr 3fr 1fr 1fr 1fr 1fr 1fr;
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
      grid-template-columns: 2fr 3fr 1fr 1fr 1fr 1fr 1fr;
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

      .main-position {
        font-weight: bold;
        color: $color-primary;
      }

      .sub-position {
        font-weight: bold;
      }
    }
  }
}
</style>
