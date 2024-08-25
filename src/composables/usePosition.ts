import { reactive, ref } from 'vue';

import type { Position } from '@/stores/users';

export default function usePosition() {
  const selectedPoints = reactive({
    top: 1,
    jungle: 1,
    mid: 1,
    adc: 1,
    sup: 1,
  });

  // 주 포지션과 부 포지션 체크 상태를 저장
  const selectedMain = ref<Position | false>(false);
  const selectedSub = ref<Position | null>(null);

  return {
    selectedPoints,
    selectedMain,
    selectedSub,
  };
}
