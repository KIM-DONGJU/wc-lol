import type { Position } from '@/stores/users';

export const POSITION_LIST: Position[] = ['top', 'jungle', 'mid', 'adc', 'sup'];

export const POSITION_KR = {
  top: '탑',
  jungle: '정글',
  mid: '미드',
  adc: '원딜',
  sup: '서폿',
} as const;
