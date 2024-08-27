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
      <SetPosition
        v-for="position in POSITION_LIST"
        :key="position"
        v-model:score="selectedPoints[position]"
        v-model:mainPosition="selectedMain"
        v-model:subPosition="selectedSub"
        :position="position"
      />
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
import { computed, reactive } from 'vue';

import { supabase } from '@/supabase';
import usePosition from '@/composables/usePosition';

import SetPosition from '@/components/SetPosition.vue';

import { POSITION_LIST } from '@/constants/position';
import styles from '@/styles/_export.module.scss';

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

const { selectedPoints, selectedMain, selectedSub } = usePosition();

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
