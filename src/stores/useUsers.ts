import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/supabase';

import { useAuthStore } from './useAuth';

export type Position = 'top' | 'mid' | 'sup' | 'jungle' | 'adc';

export interface User {
  name: string;
  nickname: string;
  point: number;
  position: Position;
}

interface PositionScore {
  top: number;
  mid: number;
  sup: number;
  jungle: number;
  adc: number;
}

export interface GroupMember {
  groupId: number;
  id: number;
  joinedAt: string;
  name: string;
  nickname: string;
  mainPosition: Position;
  subPosition: Position | null;
  userId: string | null;
  positionScore: PositionScore;
  role: 'member' | 'admin';
}

export const useUsersStore = defineStore(
  'users',
  () => {
    const authStore = useAuthStore();

    const groupMembers = ref<GroupMember[]>([]);
    const setGroupMembers = (members: GroupMember[]) => {
      groupMembers.value = members;
    };

    const getGroupMembers = async () => {
      try {
        const { data } = await supabase
          .from('groupmembers')
          .select<'', GroupMember>()
          .eq('groupId', 1);

        setGroupMembers(data || []);
      } catch (err) {
        console.log(err);
      }
    };

    const updateGroupMember = (member: GroupMember) => {
      const index = groupMembers.value.findIndex((groupMember) => groupMember.id === member.id);
      groupMembers.value[index] = member;
    };

    const currentMemberInGroup = computed(() => {
      return groupMembers.value.find((groupMember) => {
        return groupMember.userId === authStore.user?.id;
      });
    });

    return { getGroupMembers, groupMembers, currentMemberInGroup, updateGroupMember };
  },
  {
    persist: [
      {
        storage: sessionStorage,
        paths: ['groupMembers'],
      },
    ],
  }
);
