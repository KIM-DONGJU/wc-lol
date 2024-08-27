<template>
  <div class="mt-5 set-position-root">
    <div class="position__img">
      <span class="position__name">{{ positionLabel }}</span>
      <img :src="positionImages[position]" />
    </div>

    <div class="position__select w-100">
      <div class="position__points">
        <VSelect
          v-model="bindScore"
          :items="scores"
          label="점수"
          variant="outlined"
          width="100%"
          hide-details
        />
      </div>
      <!-- 주 포지션 / 부 포지션 체크박스 -->
      <div class="position__checkbox">
        <VCheckbox
          v-model="bindMainPosition"
          :value="position"
          :color="styles.primary"
          label="주 포지션"
          hide-details
          density="compact"
        />
        <VCheckbox
          v-model="bindSubPosition"
          :value="position"
          :color="styles.primary"
          class="ml-3"
          label="부 포지션"
          hide-details
          density="compact"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Position } from '@/stores/users';

import styles from '@/styles/_export.module.scss';

import top from '@/assets/images/icon/01-icon-01-lol-icon-position-top.svg';
import jungle from '@/assets/images/icon/01-icon-01-lol-icon-position-jng.svg';
import mid from '@/assets/images/icon/01-icon-01-lol-icon-position-mid.svg';
import adc from '@/assets/images/icon/01-icon-01-lol-icon-position-bot.svg';
import sup from '@/assets/images/icon/01-icon-01-lol-icon-position-sup.svg';

import { POSITION_KR } from '@/constants/position';

const props = defineProps<{
  position: Position;
  score: number;
  mainPosition: Position | false;
  subPosition: Position | null;
}>();

const emit = defineEmits(['update:score', 'update:mainPosition', 'update:subPosition']);

const scores = [1, 2, 3, 4, 5];
const bindScore = computed({
  get: () => props.score,
  set: (value: number) => emit('update:score', value),
});

const bindMainPosition = computed({
  get: () => props.mainPosition,
  set: (value) => {
    emit('update:mainPosition', value);
    if (value && value === props.subPosition) {
      emit('update:subPosition', false);
    }
  },
});

const bindSubPosition = computed({
  get: () => props.subPosition,
  set: (value) => {
    emit('update:subPosition', value);
    if (value && value === props.mainPosition) {
      emit('update:mainPosition', false);
    }
  },
});

const positionImages = {
  top,
  jungle,
  mid,
  adc,
  sup,
} as const;

const positionLabel = computed(() => POSITION_KR[props.position]);
</script>

<style lang="scss" scoped>
.set-position-root {
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(0 0 0 / 10%);

  .position__img {
    display: flex;
    flex-direction: column;

    span {
      text-align: center;
    }

    img {
      width: 80px;
      height: 80px;
    }
  }

  .position__select {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 15px;

    .position__checkbox {
      display: flex;

      label {
        margin: 0;
        margin-left: 3px;
      }

      #main__position {
        margin-right: 20px;
      }
    }
  }
}
</style>
