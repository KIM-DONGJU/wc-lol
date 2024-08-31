import { supabase } from '@/supabase';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GroupMember, Position } from './useUsers';
import { useAuthStore } from './useAuth';

interface MatchGroup {
  id: number;
  group_name: string;
  created_at: string;
  creator_id: string;
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

export const useMatchStore = defineStore('match', () => {
  const authStore = useAuthStore();

  const matchGroups = ref<null | MatchGroup[]>(null);
  const setMatchGroups = (groups: MatchGroup[]) => {
    matchGroups.value = groups;
  };

  const pushMatchGroup = (group: MatchGroup) => {
    matchGroups.value?.push(group);
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
    const twelveHoursAgoUTC = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data } = await supabase
      .from('match_groups')
      .select<'', MatchGroup>()
      .gte('created_at', twelveHoursAgoUTC);

    return data;
  };

  const getMatchesByGroupId = async (groupId: number) => {
    const { data } = await supabase.from('matches').select<'', Match>().eq('group_id', groupId);

    return data;
  };

  const matches = ref<Match[]>([]);
  const setMatches = (matchesData: Match[]) => {
    matches.value = matchesData;
  };

  const setMatchesByIndex = (index: number, match: Match) => {
    matches.value[index] = match;
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

  const selectWinningTeam = async (matchId: number, winningTeamNumber: number) => {
    const { data } = await supabase
      .from('matches')
      .update({ wining_team_number: winningTeamNumber })
      .eq('id', matchId)
      .select<'', Match>();

    return data;
  };

  return {
    matchGroups,
    setMatchGroups,
    pushMatchGroup,
    createMatchGroup,
    getMatchGroupsTwelveHoursAgo,
    createMatch,
    getMatchesByGroupId,
    matches,
    setMatches,
    unshiftMatch,
    selectWinningTeam,
    setMatchesByIndex,
  };
});
