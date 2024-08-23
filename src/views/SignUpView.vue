<template>
  <div class="signup__container">
    <h1 class="signup__text">회원가입</h1>
    <form @submit.prevent="handleSubmit">
      <div class="inputs">
        <label for="name">이름</label>
        <input
          id="name"
          v-model="bindUserName"
          type="text"
          placeholder="이름을 작성해주세요(예: 홍길동)"
        />
        <p v-if="errorMessage.name.isVisible" class="error__message">
          {{ errorMessage.name.message }}
        </p>
        <label for="nickname">롤 닉네임</label>
        <input
          id="nickname"
          v-model="bindUserNickname"
          type="text"
          placeholder="롤 닉네임을 작성해주세요(예: 괴롭혀주십시오)"
        />
        <p v-if="errorMessage.nickname.isVisible" class="error__message">
          {{ errorMessage.nickname.message }}
        </p>
        <label for="email">이메일</label>
        <input
          id="email"
          v-model="bindUserEmail"
          type="email"
          placeholder="이메일을 작성해주세요(예: example@example.com)"
        />
        <p v-if="errorMessage.email.isVisible" class="error__message">
          {{ errorMessage.email.message }}
        </p>

        <label for="password">비밀번호</label>
        <input
          id="password"
          v-model="bindUserPassword"
          type="password"
          placeholder="최대12자로 작성해주세요"
          maxlength="12"
        />
        <p v-if="errorMessage.password.isVisible" class="error__message">
          {{ errorMessage.password.message }}
        </p>
        <label for="passwordCheck">비밀번호 확인</label>
        <input
          id="passwordCheck"
          v-model="bindUserPasswordCheck"
          type="password"
          placeholder="최대12자로 작성해주세요"
          maxlength="12"
        />
        <p v-if="errorMessage.passwordCheck.isVisible" class="error__message">
          {{ errorMessage.passwordCheck.message }}
        </p>
      </div>

      <div v-for="(position, key) in positions" :key="key" class="position">
        <div class="position__img">
          <span class="position__name">{{ position.label }}</span>
          <img :src="position.img" />
        </div>

        <div class="position__select w-100">
          <!-- 점수 선택 -->
          <div class="position__points">
            <VSelect
              v-model="selectedPoints[key]"
              :items="points"
              label="점수"
              variant="outlined"
              width="100%"
              hide-details
            />
          </div>
          <!-- 주 포지션 / 부 포지션 체크박스 -->
          <div class="position__checkbox">
            <VCheckbox
              v-model="selectedMain"
              :value="key"
              :color="styles.primary"
              label="주 포지션"
              hide-details
              density="compact"
            />
            <VCheckbox
              v-model="selectedSub"
              :value="key"
              :color="styles.primary"
              class="ml-3"
              label="부 포지션"
              hide-details
              density="compact"
            />
          </div>
        </div>
      </div>
      <div>
        <p v-if="errorMessage.position.isVisible" class="error__message">
          {{ errorMessage.position.message }}
        </p>
      </div>
      <!-- 버튼들 -->
      <div class="btns">
        <VBtn :color="styles.primary" size="large" variant="outlined" @click="goBack">
          뒤로가기
        </VBtn>
        <VBtn :color="styles.primary" size="large" variant="tonal" type="submit">가입하기</VBtn>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, reactive, ref, watch } from 'vue';

import { supabase } from '@/supabase';
import type { Position } from '@/stores/users';

import styles from '@/styles/_export.module.scss';

import top from '@/assets/images/icon/01-icon-01-lol-icon-position-top.svg';
import jungle from '@/assets/images/icon/01-icon-01-lol-icon-position-jng.svg';
import mid from '@/assets/images/icon/01-icon-01-lol-icon-position-mid.svg';
import adc from '@/assets/images/icon/01-icon-01-lol-icon-position-bot.svg';
import sup from '@/assets/images/icon/01-icon-01-lol-icon-position-sup.svg';

const router = useRouter();
const goBack = () => {
  router.back();
};

// 기존의 user의 정보를 따로 저장하는거에서 reactive()를 사용하여 한꺼번에 정보를 전달.
type UserInfoKey = 'name' | 'nickname' | 'email' | 'password' | 'passwordCheck';
const userInfo = reactive<Record<UserInfoKey, string>>({
  name: '',
  nickname: '',
  email: '',
  password: '',
  passwordCheck: '',
});

const errorMessage = reactive({
  name: {
    isVisible: false,
    message: '이름을 입력해주세요.',
  },
  nickname: {
    isVisible: false,
    message: '롤 닉네임을 입력해주세요.',
  },
  email: {
    isVisible: false,
    message: '이메일을 입력해주세요.',
  },
  password: {
    isVisible: false,
    message: '비밀번호를 입력해주세요.',
  },
  passwordCheck: {
    isVisible: false,
    message: '비밀번호가 일치하지 않습니다.',
  },
  position: {
    isVisible: false,
    message: '주 포지션을 선택해주세요.',
  },
});

// watch로 하나하나의 데이터를 감시하는 것이 아닌 computed를 사용하여 감시.
// 더 직관적이고 간결할 것으로 판단.
const bindUserName = computed({
  get: () => userInfo.name,
  set: (value: string) => {
    userInfo.name = value;
    if (value) {
      errorMessage.name.isVisible = false;
    }
  },
});

const bindUserNickname = computed({
  get: () => userInfo.nickname,
  set: (value: string) => {
    userInfo.nickname = value;
    if (value) {
      errorMessage.nickname.isVisible = false;
    }
  },
});

const bindUserEmail = computed({
  get: () => userInfo.email,
  set: (value: string) => {
    userInfo.email = value;
    if (value) {
      errorMessage.email.isVisible = false;
    }
  },
});

const bindUserPassword = computed({
  get: () => userInfo.password,
  set: (value: string) => {
    userInfo.password = value;
    if (value) {
      errorMessage.password.isVisible = false;
    }
  },
});

let passwordCheckDebounceTimer: NodeJS.Timeout | null = null;
const bindUserPasswordCheck = computed({
  get: () => userInfo.passwordCheck,
  set: (value: string) => {
    userInfo.passwordCheck = value;
    if (passwordCheckDebounceTimer) {
      clearTimeout(passwordCheckDebounceTimer);
    }

    if (value && value === userInfo.password) {
      errorMessage.passwordCheck.isVisible = false;
    }

    if (value !== userInfo.password) {
      passwordCheckDebounceTimer = setTimeout(() => {
        errorMessage.passwordCheck.isVisible = true;
      }, 500);
    }
  },
});

// 포지션 정보
const positions = reactive({
  top: {
    value: 'top',
    label: '탑',
    img: top,
  },
  jungle: {
    value: 'jungle',
    label: '정글',
    img: jungle,
  },
  mid: {
    value: 'mid',
    label: '미드',
    img: mid,
  },
  adc: {
    value: 'adc',
    label: '원딜',
    img: adc,
  },
  sup: {
    value: 'sup',
    label: '서폿',
    img: sup,
  },
});

// 각 포지션에 대해 점수를 저장
const selectedPoints = reactive({
  top: 1,
  jungle: 1,
  mid: 1,
  adc: 1,
  sup: 1,
});

// 점수 옵션
const points = [1, 2, 3, 4, 5];

// 주 포지션과 부 포지션 체크 상태를 저장
const selectedMain = ref<Position | false>(false);
const selectedSub = ref<Position | false>(false);

// 주 포지션과 부 포지션을 같이 선택할 수 없도록 설정
watch(selectedMain, (newValue) => {
  errorMessage.position.isVisible = false;
  if (newValue && newValue === selectedSub.value) {
    selectedSub.value = false;
  }
});

watch(selectedSub, (newValue) => {
  if (newValue && newValue === selectedMain.value) {
    selectedMain.value = false;
  }
});

const handleSubmit = async () => {
  let isValid = false;
  for (const key in userInfo) {
    const keyName = key as UserInfoKey;

    if (!userInfo[keyName]) {
      errorMessage[keyName].isVisible = true;
      isValid = true;
    }
  }

  if (userInfo.passwordCheck !== userInfo.password) {
    errorMessage.passwordCheck.isVisible = true;
    isValid = true;
  }

  if (!selectedMain.value) {
    errorMessage.position.isVisible = true;
    isValid = true;
  }

  if (isValid) {
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: userInfo.email,
      password: userInfo.password,
      options: {
        data: {
          name: userInfo.name,
          nickname: userInfo.nickname,
          positionScore: selectedPoints,
          mainPosition: selectedMain.value,
          subPosition: selectedSub.value || null,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped lang="scss">
$opa: 0.6;

.signup__container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;

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
      padding: 10px 5px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgb(0 0 0 / 10%);

      &:hover {
        background-color: rgba($color-primary, 0.1);
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

    // button {
    //   padding: 20px 15px;
    //   font-size: 17px;
    //   color: white;
    //   background-color: $color-primary;
    //   border-radius: 12px;
    //   transition: all 0.5s ease-in-out;

    //   &:hover {
    //     color: $color-primary;
    //     background-color: rgb(0 0 0 / 10%);
    //   }
    // }
  }

  .error__message {
    margin-top: -10px;
    margin-bottom: 15px;
    font-size: 12px;
    color: red;
  }
}
</style>
