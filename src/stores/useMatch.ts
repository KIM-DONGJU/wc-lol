import { supabase } from '@/supabase';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GroupMember, Position } from './useUsers';
import { useAuthStore } from './useAuth';

export interface MatchGroup {
  id: number;
  group_name: string;
  created_at: string;
  creator_id: string;
  is_fixed: boolean;
  win_members: number[];
  lose_members: number[];
}

export interface Match {
  id: number;
  group_id: number;
  created_at: string;
  wining_team_number: number;
  teams: Record<Position, GroupMember>[];
}

interface CreateMatchParams {
  groupId: number;
  teams: Record<Position, GroupMember>[];
}

interface SelectedWinningTeamParams {
  matchId: number;
  winningTeamNumber: number;
}

interface UpdateMatchTeamParams {
  matchId: number;
  teams: Record<Position, GroupMember | null>[];
}

interface OnFixedMatchGroupParams {
  groupId: number;
  winnerGroupMemberIds: number[];
  loserGroupMemberIds: number[];
}

export const useMatchStore = defineStore('match', () => {
  const authStore = useAuthStore();

  const matchGroups = ref<null | MatchGroup[]>(null);
  const setMatchGroups = (groups: MatchGroup[]) => {
    matchGroups.value = groups;
  };

  const pushMatchGroup = (group: MatchGroup) => {
    matchGroups.value?.push(group);
  };

  const setMatchGroup = (group: MatchGroup) => {
    if (group && matchGroups.value) {
      const findMatchGroupIndex = matchGroups.value?.findIndex((g) => g.id === group.id);

      if (findMatchGroupIndex !== -1) {
        matchGroups.value[findMatchGroupIndex] = group;
      }
    }
  };

  const removeMatchGroupByGroupId = (groupId: number) => {
    if (matchGroups.value === null) {
      return;
    }

    const findMatchGroupIndex = matchGroups.value?.findIndex((group) => group.id === groupId);
    if (findMatchGroupIndex !== -1) {
      matchGroups.value?.splice(findMatchGroupIndex, 1);
    }
  };

  const deleteMatchGroup = async (groupId: number) => {
    const { data } = await supabase.from('match_groups').delete().eq('id', groupId).select();

    return data;
  };

  const createMatchGroup = async (matchGroupName: string) => {
    const { data, error } = await supabase
      .from('match_groups')
      .insert([
        {
          creator_id: authStore.user?.id,
          group_name: matchGroupName,
        },
      ])
      .select<'', MatchGroup>();

    return data;
  };

  const getMatchGroupsTwelveHoursAgo = async () => {
    // 일단 3일치 보이도록 임시 설정, 원래 12시간으로 할 예정이었음
    const twelveHoursAgoUTC = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

    const { data } = await supabase
      .from('match_groups')
      .select<'', MatchGroup>()
      .gte('created_at', twelveHoursAgoUTC)
      .order('created_at', { ascending: false });

    return data;
  };

  const getMatchesByGroupId = async (groupId: number) => {
    const { data } = await supabase
      .from('matches')
      .select<'', Match>()
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    return data;
  };

  const matches = ref<Match[]>([]);
  const setMatches = (matchesData: Match[]) => {
    matches.value = matchesData;
  };

  const setMatch = (match: Match) => {
    const findMatchIndex = matches.value.findIndex((m) => m.id === match.id);
    matches.value[findMatchIndex] = match;
  };

  const removeMatchByMatchId = (matchId: number) => {
    const findMatchIndex = matches.value.findIndex((match) => match.id === matchId);
    matches.value.splice(findMatchIndex, 1);
  };

  const unshiftMatch = (match: Match) => {
    matches.value.unshift(match);
  };

  const createMatch = async ({ groupId, teams }: CreateMatchParams) => {
    const { data } = await supabase
      .from('matches')
      .insert({
        group_id: groupId,
        teams,
      })
      .select<'', Match>();

    return data;
  };

  const selectWinningTeam = async ({ matchId, winningTeamNumber }: SelectedWinningTeamParams) => {
    const { data } = await supabase
      .from('matches')
      .update({ wining_team_number: winningTeamNumber })
      .eq('id', matchId)
      .select<'', Match>();

    return data;
  };

  const deleteMatch = async (matchId: number) => {
    const { data } = await supabase.from('matches').delete().eq('id', matchId).select();

    return data;
  };

  const updateMatchTeam = async ({ matchId, teams }: UpdateMatchTeamParams) => {
    const { data } = await supabase
      .from('matches')
      .update({ teams })
      .eq('id', matchId)
      .select<'', Match>();

    return data;
  };

  const onFixedGroupMatch = async ({
    groupId,
    winnerGroupMemberIds,
    loserGroupMemberIds,
  }: OnFixedMatchGroupParams) => {
    const { data } = await supabase
      .from('match_groups')
      .update({
        win_members: winnerGroupMemberIds,
        lose_members: loserGroupMemberIds,
        is_fixed: true,
      })
      .eq('id', groupId)
      .select<'', MatchGroup>();

    return data;
  };

  return {
    matchGroups,
    setMatchGroups,
    setMatchGroup,
    pushMatchGroup,
    createMatchGroup,
    getMatchGroupsTwelveHoursAgo,
    createMatch,
    getMatchesByGroupId,
    matches,
    setMatches,
    unshiftMatch,
    selectWinningTeam,
    setMatch,
    deleteMatch,
    updateMatchTeam,
    removeMatchByMatchId,
    removeMatchGroupByGroupId,
    deleteMatchGroup,
    onFixedGroupMatch,
  };
});
