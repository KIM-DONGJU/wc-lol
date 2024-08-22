<template>
  <div class="signup__container">
    <h1 class="signup__text">회원가입</h1>
    <form @submit.prevent="handleSubmit">
      <div class="inputs">
        <label for="name">이름</label>
        <input
          id="name"
          v-model="userInfo.name"
          type="text"
          placeholder="이름을 작성해주세요(예: 홍길동)"
        />
        <p v-if="errorMessage.name" class="error__message">{{ errorMessage.name }}</p>

        <label for="nickname">롤 닉네임</label>
        <input
          id="nickname"
          v-model="userInfo.nickname"
          type="text"
          placeholder="롤 닉네임을 작성해주세요(예: 괴롭혀주십시오)"
        />
        <p v-if="errorMessage.nickname" class="error__message">{{ errorMessage.nickname }}</p>

        <label for="email">이메일</label>
        <input
          id="email"
          v-model="userInfo.email"
          type="email"
          placeholder="이메일을 작성해주세요(예: example@example.com)"
        />
        <p v-if="errorMessage.email" class="error__message">{{ errorMessage.email }}</p>

        <label for="password">비밀번호</label>
        <input
          id="password"
          v-model="userInfo.password"
          type="password"
          placeholder="최대12자로 작성해주세요"
          maxlength="12"
        />
        <p v-if="errorMessage.password" class="error__message">{{ errorMessage.password }}</p>
      </div>

      <div v-for="(position, index) in positions" :key="position.value" class="position">
        <div class="position__img">
          <span class="position__name">{{ position.label }}</span>
          <img :src="position.img" />
        </div>

        <div class="position__select">
          <!-- 점수 선택 -->
          <div class="position__points">
            <label :for="`points-${index}`">점수: </label>
            <select :id="`points-${index}`" v-model="selectedPoints[index]">
              <option v-for="point in points" :key="point.value" :value="point.value">
                {{ point.label }} 점
              </option>
            </select>
          </div>

          <!-- 주 포지션 / 부 포지션 체크박스 -->
          <div class="position__checkbox">
            <input
              :id="`main-${index}`"
              v-model="selectedMain[index]"
              :disabled="disableCheckbox(index, 'main')"
              type="checkbox"
              @change="handleMainChange(index)"
            />
            <label id="main__position" :for="`main-${index}`">주 포지션</label>
            <input
              :id="`sub-${index}`"
              v-model="selectedSub[index]"
              :disabled="disableCheckbox(index, 'sub')"
              type="checkbox"
              @change="handleSubChange(index)"
            />
            <label :for="`sub-${index}`">부 포지션</label>
          </div>
        </div>
      </div>
      <div>
        <p v-if="errorMessage.position" class="error__message">{{ errorMessage.position }}</p>
      </div>
      <!-- 버튼들 -->
      <div class="btns">
        <button @click="goBack">뒤로가기</button>
        <button type="submit">가입하기</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, reactive, ref, watch } from 'vue';

import top from '../assets/images/icon/01-icon-01-lol-icon-position-top.svg';
import jungle from '../assets/images/icon/01-icon-01-lol-icon-position-jng.svg';
import mid from '../assets/images/icon/01-icon-01-lol-icon-position-mid.svg';
import adc from '../assets/images/icon/01-icon-01-lol-icon-position-bot.svg';
import sup from '../assets/images/icon/01-icon-01-lol-icon-position-sup.svg';

const router = useRouter();
const goBack = () => {
  router.back();
};

// 기존의 user의 정보를 따로 저장하는거에서 reactive()를 사용하여 한꺼번에 정보를 전달.
const userInfo = reactive({
  name: '',
  nickname: '',
  email: '',
  password: '',
});

const errorMessage = ref({
  name: '',
  nickname: '',
  email: '',
  password: '',
  position: '',
});

// 포지션 정보
const positions = ref([
  { value: 'top', label: '탑', img: top },
  { value: 'jungle', label: '정글', img: jungle },
  { value: 'mid', label: '미드', img: mid },
  { value: 'adc', label: '원딜', img: adc },
  { value: 'sup', label: '서폿', img: sup },
]);

// 각 포지션에 대해 점수를 저장하는 배열
const selectedPoints = ref(Array(positions.value.length).fill(1));

// 점수 옵션
const points = ref([
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
]);

// 주 포지션과 부 포지션 체크 상태를 저장하는 배열
const selectedMain = ref(Array(positions.value.length).fill(false));
const selectedSub = ref(Array(positions.value.length).fill(false));

// 주 포지션과 부 포지션을 선택한 개수를 계산
const mainCount = computed(() => selectedMain.value.filter(Boolean).length);
const subCount = computed(() => selectedSub.value.filter(Boolean).length);

// 체크박스 비활성화 로직
const disableCheckbox = (index: number, type: 'main' | 'sub') => {
  if (type === 'main' && selectedMain.value[index]) return false;
  if (type === 'sub' && selectedSub.value[index]) return false;

  if (type === 'main') return mainCount.value >= 1;
  if (type === 'sub') return subCount.value >= 1;

  return false;
};

// 주 포지션 선택 시 처리 로직
const handleMainChange = (index: number) => {
  if (mainCount.value > 1) {
    selectedMain.value[index] = false;
  }
};

// 부 포지션 선택 시 처리 로직
const handleSubChange = (index: number) => {
  if (subCount.value > 1) {
    selectedSub.value[index] = false;
  }
};

const handleSubmit = () => {
  let valid = true;
  errorMessage.value = { name: '', nickname: '', email: '', password: '', position: '' };
  // 유효성 검사
  if (!userInfo.name) {
    errorMessage.value.name = '이름을 입력해주세요.';
    valid = false;
  }

  if (!userInfo.nickname) {
    errorMessage.value.nickname = '롤 닉네임을 입력해주세요.';
    valid = false;
  }

  if (!userInfo.email) {
    errorMessage.value.email = '이메일을 입력해주세요.';
    valid = false;
  }

  if (!userInfo.password) {
    errorMessage.value.password = '비밀번호를 입력해주세요.';
    valid = false;
  }

  if (mainCount.value === 0 || subCount.value === 0) {
    errorMessage.value.position = '주 포지션과 부 포지션을 각각 하나씩 선택해주세요.';
    valid = false;
  }

  if (!valid) return;

  // 유효성 검사 통과 시 데이터 제출
  const formData = {
    name: userInfo.name,
    nickname: userInfo.nickname,
    email: userInfo.email,
    password: userInfo.password,
    positions: positions.value.map((position, index) => ({
      position: position.value,
      points: selectedPoints.value[index],
      isMain: selectedMain.value[index],
      isSub: selectedSub.value[index],
    })),
  };

  console.log('제출된 데이터:', formData);
};

// 실시간 에러 초기화 (watch 사용)
watch(
  () => userInfo.name,
  () => {
    errorMessage.value.name = userInfo.name ? '' : '이름을 입력해주세요.';
  }
);

watch(
  () => userInfo.nickname,
  () => {
    errorMessage.value.nickname = userInfo.nickname ? ' ' : '롤 닉네임을 입력해주세요.';
  }
);

watch(
  () => userInfo.email,
  () => {
    errorMessage.value.email = userInfo.email ? '' : '이메일을 입력해주세요.';
  }
);

watch(
  () => userInfo.password,
  () => {
    errorMessage.value.password = userInfo.password ? '' : '비밀번호를 입력해주세요.';
  }
);

// 포지션 변경 시 에러 메시지 초기화
watch(
  [selectedMain, selectedSub],
  () => {
    if (mainCount.value > 0 || subCount.value > 0) {
      errorMessage.value.position = '';
    } else {
      errorMessage.value.position = '주 포지션과 부 포지션을 각각 하나씩 선택해주세요.';
    }
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
$opa: 0.6;
$color: #5282e6;

.signup__container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;

  label {
    margin-bottom: 15px;
    opacity: $opa;
  }

  p {
    margin-bottom: 15px;
    font-size: 15px;
  }

  .signup__text {
    margin-bottom: 20px;
    font-size: 30px;
    opacity: $opa;
  }

  .inputs {
    display: flex;
    flex-direction: column;

    label {
      opacity: 1;
    }

    input {
      width: 500px;
      padding: 15px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid rgb(0 0 0 / 10%);

      &:hover {
        background-color: rgba($color, 0.1);
      }

      &:focus {
        outline: none;
      }
    }
  }

  .position {
    display: flex;
    padding-bottom: 10px;
    margin: 20px 0;
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

  .btns {
    display: flex;
    justify-content: space-between;

    button {
      padding: 20px 15px;
      font-size: 17px;
      color: white;
      background-color: $color;
      border-radius: 12px;
      transition: all 0.5s ease-in-out;

      &:hover {
        color: $color;
        background-color: rgb(0 0 0 / 10%);
      }
    }
  }

  .error__message {
    margin-top: -10px;
    margin-bottom: 15px;
    font-size: 12px;
    color: red;
  }
}
</style>
