import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/supabase';

export type Position = 'top' | 'mid' | 'sup' | 'jungle' | 'adc';

export interface User {
  name: string;
  nickname: string;
  point: number;
  position: Position;
}

interface UserList {
  top: User[];
  mid: User[];
  sup: User[];
  jungle: User[];
  adc: User[];
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
  userId: number | null;
  positionScore: PositionScore;
  role: 'member' | 'admin';
}

export const useUsersStore = defineStore(
  'users',
  () => {
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

    return { getGroupMembers, groupMembers };
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
