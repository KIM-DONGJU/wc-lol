<template>
  <div class="signup__container">
    <h1 class="signup__text">회원가입</h1>
    <form @submit.prevent="handleSubmit">
      <div class="inputs">
        <label for="name">이름</label>
        <input type="text" id="name" placeholder="이름을 작성해주세요(예: 홍길동)" v-model="name" />
        <p v-if="errorMessage.name" class="error__message">{{ errorMessage.name }}</p>

        <label for="nickname">롤 닉네임</label>
        <input
          type="text"
          id="nickname"
          placeholder="롤 닉네임을 작성해주세요(예: 괴롭혀주십시오)"
          v-model="nickname"
        />
        <p v-if="errorMessage.nickname" class="error__message">{{ errorMessage.nickname }}</p>

        <label for="email">이메일</label>
        <input
          type="email"
          id="email"
          placeholder="이메일을 작성해주세요(예: example@example.com)"
          v-model="email"
        />
        <p v-if="errorMessage.email" class="error__message">{{ errorMessage.email }}</p>

        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          placeholder="최대12자로 작성해주세요"
          v-model="password"
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
            <select v-model="selectedPoints[index]" :id="`points-${index}`">
              <option v-for="point in points" :key="point.value" :value="point.value">
                {{ point.label }} 점
              </option>
            </select>
          </div>

          <!-- 주 포지션 / 부 포지션 체크박스 -->
          <div class="position__checkbox">
            <input
              type="checkbox"
              :id="`main-${index}`"
              v-model="selectedMain[index]"
              :disabled="disableCheckbox(index, 'main')"
              @change="handleMainChange(index)"
            />
            <label :for="`main-${index}`" id="main__position">주 포지션</label>
            <input
              type="checkbox"
              :id="`sub-${index}`"
              v-model="selectedSub[index]"
              :disabled="disableCheckbox(index, 'sub')"
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
import { useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'

import top from '../assets/images/icon/01-icon-01-lol-icon-position-top.svg'
import jungle from '../assets/images/icon/01-icon-01-lol-icon-position-jng.svg'
import mid from '../assets/images/icon/01-icon-01-lol-icon-position-mid.svg'
import adc from '../assets/images/icon/01-icon-01-lol-icon-position-bot.svg'
import sup from '../assets/images/icon/01-icon-01-lol-icon-position-sup.svg'

const router = useRouter()
const goBack = () => {
  router.back()
}

const name = ref('')
const nickname = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref({
  name: '',
  nickname: '',
  email: '',
  password: '',
  position: ''
})

// 포지션 정보
const positions = ref([
  { value: 'top', label: '탑', img: top },
  { value: 'jungle', label: '정글', img: jungle },
  { value: 'mid', label: '미드', img: mid },
  { value: 'adc', label: '원딜', img: adc },
  { value: 'sup', label: '서폿', img: sup }
])

// 각 포지션에 대해 점수를 저장하는 배열
const selectedPoints = ref(Array(positions.value.length).fill(1))

// 점수 옵션
const points = ref([
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 }
])

// 주 포지션과 부 포지션 체크 상태를 저장하는 배열
const selectedMain = ref(Array(positions.value.length).fill(false))
const selectedSub = ref(Array(positions.value.length).fill(false))

// 주 포지션과 부 포지션을 선택한 개수를 계산
const mainCount = computed(() => selectedMain.value.filter(Boolean).length)
const subCount = computed(() => selectedSub.value.filter(Boolean).length)

// 체크박스 비활성화 로직
const disableCheckbox = (index: number, type: 'main' | 'sub') => {
  if (type === 'main' && selectedMain.value[index]) return false
  if (type === 'sub' && selectedSub.value[index]) return false

  if (type === 'main') return mainCount.value >= 1
  if (type === 'sub') return subCount.value >= 1

  return false
}

// 주 포지션 선택 시 처리 로직
const handleMainChange = (index: number) => {
  if (mainCount.value > 1) {
    selectedMain.value[index] = false
  }
}

// 부 포지션 선택 시 처리 로직
const handleSubChange = (index: number) => {
  if (subCount.value > 1) {
    selectedSub.value[index] = false
  }
}

const handleSubmit = () => {
  let valid = true
  errorMessage.value = { name: '', nickname: '', email: '', password: '', position: '' }
  // 유효성 검사
  if (!name.value) {
    errorMessage.value.name = '이름을 입력해주세요.'
    valid = false
  }

  if (!nickname.value) {
    errorMessage.value.nickname = '롤 닉네임을 입력해주세요.'
    valid = false
  }

  if (!email.value) {
    errorMessage.value.email = '이메일을 입력해주세요.'
    valid = false
  }

  if (!password.value) {
    errorMessage.value.password = '비밀번호를 입력해주세요.'
    valid = false
  }

  if (mainCount.value === 0 || subCount.value === 0) {
    errorMessage.value.position = '주 포지션과 부 포지션을 각각 하나씩 선택해주세요.'
    valid = false
  }

  if (!valid) return

  // 유효성 검사 통과 시 데이터 제출
  const formData = {
    name: name.value,
    nickname: nickname.value,
    email: email.value,
    password: password.value,
    positions: positions.value.map((position, index) => ({
      position: position.value,
      points: selectedPoints.value[index],
      isMain: selectedMain.value[index],
      isSub: selectedSub.value[index]
    }))
  }

  console.log('제출된 데이터:', formData)
}

// 실시간 에러 초기화 (watch 사용)
watch(name, () => {
  if (errorMessage.value.name) {
    errorMessage.value.name = ''
  }
})

watch(nickname, () => {
  if (errorMessage.value.nickname) {
    errorMessage.value.nickname = ''
  }
})

watch(email, () => {
  if (errorMessage.value.email) {
    errorMessage.value.email = ''
  }
})

watch(password, () => {
  if (errorMessage.value.password) {
    errorMessage.value.password = ''
  }
})

// 포지션 변경 시 에러 메시지 초기화
watch(
  [selectedMain, selectedSub],
  () => {
    if (mainCount.value > 0 && subCount.value > 0) {
      errorMessage.value.position = ''
    }
  },
  { deep: true }
)
</script>

<style lang="scss">
$opa: 0.6;
$color: #5282e6;

.signup__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 50px 0px;

  label {
    opacity: $opa;
    margin-bottom: 15px;
  }

  p {
    font-size: 15px;
    margin-bottom: 15px;
  }

  .signup__text {
    font-size: 30px;
    margin-bottom: 20px;
    opacity: $opa;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    label {
      opacity: 1;
    }
    input {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 15px 0px;
      width: 500px;
      margin-bottom: 20px;
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
    margin: 20px 0px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

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
          margin: 0px;
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
      background-color: $color;
      padding: 20px 15px;
      border-radius: 12px;
      color: white;
      font-size: 17px;
      transition: all 0.5s ease-in-out;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        color: $color;
      }
    }
  }
  .error__message {
    color: red;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 15px;
  }
}
</style>
