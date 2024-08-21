<template>
  <div class="signup__container">
    <h1 class="signup__text">회원가입</h1>
    <form>
      <div class="inputs">
        <label for="name">이름</label>
        <input
          type="text"
          id="name"
          placeholder="이름을 작성해주세요(예: 홍길동)"
          v-model="name"
          required
        />
        <label for="nickname">롤 닉네임</label>
        <input
          type="text"
          id="nickname"
          placeholder="롤 닉네임을 작성해주세요(예: 괴롭혀주십시오)"
          v-model="nickname"
          required
        />
        <label for="email">이메일</label>
        <input
          type="email"
          id="email"
          placeholder="이메일을 작성해주세요(예: example@example.com)"
          v-model="email"
          required
        />
        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          placeholder="최대12자로 작성해주세요"
          v-model="password"
          maxlength="12"
          required
        />
      </div>

      <div class="position__container">
        <div class="main__positions">
          <p class="position__text">주 포지션을 선택해주세요</p>
          <div class="select__position">
            <label for="main__top" class="main__position">
              탑
              <img :src="top" alt="top" class="position__img" />
              <input
                type="radio"
                id="main__top"
                value="top"
                v-model="selectedMainPosition"
                name="main-position"
                @change="mainPositionChecked"
              />
            </label>
            <label for="main__jungle" class="main__position">
              정글
              <img :src="jungle" alt="jungle" class="position__img" />
              <input
                type="radio"
                id="main__jungle"
                value="jungle"
                v-model="selectedMainPosition"
                name="main-position"
                @change="mainPositionChecked"
              />
            </label>
            <label for="main__mid" class="main__position">
              미드
              <img :src="mid" alt="mid" class="position__img" />
              <input
                type="radio"
                id="main__mid"
                value="mid"
                v-model="selectedMainPosition"
                name="main-position"
                @change="mainPositionChecked"
              />
            </label>
            <label for="main__adc" class="main__position">
              원딜
              <img :src="adc" alt="adc" class="position__img" />
              <input
                type="radio"
                id="main__adc"
                value="adc"
                v-model="selectedMainPosition"
                name="main-position"
                @change="mainPositionChecked"
              />
            </label>
            <label for="main__sup" class="main__position">
              서포터
              <img :src="sup" alt="sup" class="position__img" />
              <input
                type="radio"
                id="main__sup"
                value="sup"
                v-model="selectedMainPosition"
                name="main-position"
                @change="mainPositionChecked"
              />
            </label>
          </div>
          <span v-if="!selectedMainPosition" class="error-text"> 주 포지션을 선택해주세요. </span>
        </div>

        <div class="main__position-point" v-show="showMainPointBox">
          <p class="select__point-text">주 포지션의 점수를 선택하세요</p>
          <div class="select__point">
            <div class="main__point">
              <label for="main-one">1</label>
              <input
                type="radio"
                id="main-one"
                value="1"
                v-model="mainPositionScore"
                name="main-point"
              />
            </div>

            <div class="main__point">
              <label for="main-two">2</label>
              <input
                type="radio"
                id="main-two"
                value="2"
                v-model="mainPositionScore"
                name="main-point"
              />
            </div>

            <div class="main__point">
              <label for="main-three">3</label>
              <input
                type="radio"
                id="main-three"
                value="3"
                v-model="mainPositionScore"
                name="main-point"
              />
            </div>

            <div class="main__point">
              <label for="main-four">4</label>
              <input
                type="radio"
                id="main-four"
                value="4"
                v-model="mainPositionScore"
                name="main-point"
              />
            </div>

            <div class="main__point">
              <label for="main-five">5</label>
              <input
                type="radio"
                id="main-five"
                value="5"
                v-model="mainPositionScore"
                name="main-point"
              />
            </div>
          </div>
          <span v-if="!mainPositionScore" class="error-text"> 주 포지션 점수를 선택해주세요. </span>
        </div>

        <div class="sub__positions">
          <p class="position__text">부 포지션을 선택해주세요</p>
          <div class="select__position">
            <label for="sub__top" class="sub__position">
              탑
              <img :src="top" alt="top" class="position__img" />
              <input
                type="radio"
                id="sub__top"
                value="top"
                v-model="selectedSubPosition"
                name="sub-position"
                @change="subPositionChecked"
              />
            </label>

            <label for="sub__jungle" class="sub__position">
              정글
              <img :src="jungle" alt="jungle" class="position__img" />
              <input
                type="radio"
                id="sub__jungle"
                value="jungle"
                v-model="selectedSubPosition"
                name="sub-position"
                @change="subPositionChecked"
              />
            </label>

            <label for="sub__mid" class="sub__position">
              미드
              <img :src="mid" alt="mid" class="position__img" />
              <input
                type="radio"
                id="sub__mid"
                value="mid"
                v-model="selectedSubPosition"
                name="sub-position"
                @change="subPositionChecked"
              />
            </label>

            <label for="sub__adc" class="sub__position">
              원딜
              <img :src="adc" alt="adc" class="position__img" />
              <input
                type="radio"
                id="sub__adc"
                value="adc"
                v-model="selectedSubPosition"
                name="sub-position"
                @change="subPositionChecked"
              />
            </label>

            <label for="sub__sup" class="sub__position">
              서포터
              <img :src="sup" alt="sup" class="position__img" />
              <input
                type="radio"
                id="sub__sup"
                value="sup"
                v-model="selectedSubPosition"
                name="sub-position"
                @change="subPositionChecked"
              />
            </label>
          </div>
          <span v-if="!selectedSubPosition" class="error-text"> 부 포지션을 선택해주세요. </span>
        </div>

        <div class="sub__position-point" v-show="showSubPointBox">
          <p class="select__point-text">부 포지션의 점수를 선택하세요</p>
          <div class="select__point">
            <div class="sub__point">
              <label for="sub-one">1</label>
              <input
                type="radio"
                id="sub-one"
                value="1"
                v-model="subPositionScore"
                name="sub-point"
              />
            </div>
            <div class="sub__point">
              <label for="sub-two">2</label>
              <input
                type="radio"
                id="sub-two"
                value="2"
                v-model="subPositionScore"
                name="sub-point"
              />
            </div>
            <div class="sub__point">
              <label for="sub-three">3</label>
              <input
                type="radio"
                id="sub-three"
                value="3"
                v-model="subPositionScore"
                name="sub-point"
              />
            </div>
            <div class="sub__point">
              <label for="sub-four">4</label>
              <input
                type="radio"
                id="sub-four"
                value="4"
                v-model="subPositionScore"
                name="sub-point"
              />
            </div>
            <div class="sub__point">
              <label for="sub-five">5</label>
              <input
                type="radio"
                id="sub-five"
                value="5"
                v-model="subPositionScore"
                name="sub-point"
              />
            </div>
          </div>
          <span v-if="!subPositionScore" class="error-text"> 부 포지션 점수를 선택해주세요. </span>
        </div>

        <div class="remain__positions" v-show="showRemainPointBox">
          <p class="position__text">나머지 포지션의 점수를 선택해주세요</p>
          <div class="select__position" v-for="position in remainPositions" :key="position.value">
            <label :for="position.value" class="remain__position">
              {{ position.label }}
              <img :src="position.img" :alt="position.label" class="position__img" />
            </label>
            <div class="select__point">
              <div class="remain__point">
                <label :for="position.value + '-one'">1</label>
                <input
                  type="radio"
                  :id="position.value + '-one'"
                  :value="1"
                  :name="position.value + '-point'"
                  v-model="remainPoints[position.value]"
                />
              </div>
              <div class="remain__point">
                <label :for="position.value + '-two'">2</label>
                <input
                  type="radio"
                  :id="position.value + '-two'"
                  :value="2"
                  :name="position.value + '-point'"
                  v-model="remainPoints[position.value]"
                />
              </div>
              <div class="remain__point">
                <label :for="position.value + '-three'">3</label>
                <input
                  type="radio"
                  :id="position.value + '-three'"
                  :value="3"
                  :name="position.value + '-point'"
                  v-model="remainPoints[position.value]"
                />
              </div>
              <div class="remain__point">
                <label :for="position.value + '-four'">4</label>
                <input
                  type="radio"
                  :id="position.value + '-four'"
                  :value="4"
                  :name="position.value + '-point'"
                  v-model="remainPoints[position.value]"
                />
              </div>
              <div class="remain__point">
                <label :for="position.value + '-five'">5</label>
                <input
                  type="radio"
                  :id="position.value + '-five'"
                  :value="5"
                  :name="position.value + '-point'"
                  v-model="remainPoints[position.value]"
                />
              </div>
            </div>
            <span v-if="!remainPoints[position.value]" class="error-text">
              {{ position.label }} 점수를 선택해주세요.
            </span>
          </div>
        </div>
      </div>

      <div class="btns">
        <button @click="goBack">뒤로가기</button>
        <button @click="submitForm">가입하기</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import top from '../assets/images/icon/01-icon-01-lol-icon-position-top.svg'
import jungle from '../assets/images/icon/01-icon-01-lol-icon-position-jng.svg'
import mid from '../assets/images/icon/01-icon-01-lol-icon-position-mid.svg'
import adc from '../assets/images/icon/01-icon-01-lol-icon-position-bot.svg'
import sup from '../assets/images/icon/01-icon-01-lol-icon-position-sup.svg'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const router = useRouter()
const goBack = () => {
  router.back()
}

const name = ref('')
const nickname = ref('')
const email = ref('')
const password = ref('')

const showMainPointBox = ref(false)
const showSubPointBox = ref(false)
const showRemainPointBox = ref(false)

const selectedMainPosition = ref('')
const selectedSubPosition = ref('')

const mainPositionScore = ref(null)
const subPositionScore = ref(null)

const remainPoints = ref<Record<string, number | null>>({
  top: null,
  jungle: null,
  mid: null,
  adc: null,
  sup: null
})

const isFormValid = computed(() => {
  const allRemainPointsValid = remainPositions.value.every(
    (position) =>
      remainPoints.value[position.value] !== null &&
      typeof remainPoints.value[position.value] === 'number'
  )

  return (
    name.value.trim() !== '' &&
    nickname.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.length >= 8 &&
    selectedMainPosition.value &&
    mainPositionScore.value !== null &&
    selectedSubPosition.value &&
    subPositionScore.value !== null &&
    allRemainPointsValid
  )
})

const mainPositionChecked = () => {
  showMainPointBox.value = true
  remainPositionChecked()
}

const subPositionChecked = () => {
  showSubPointBox.value = true
  remainPositionChecked()
}

const remainPositionChecked = () => {
  if (selectedMainPosition.value && selectedSubPosition.value) {
    showRemainPointBox.value = true
  }
}

const allPositions = [
  { value: 'top', label: '탑', img: top },
  { value: 'jungle', label: '정글', img: jungle },
  { value: 'mid', label: '미드', img: mid },
  { value: 'adc', label: '원딜', img: adc },
  { value: 'sup', label: '서포터', img: sup }
]

const remainPositions = computed(() => {
  return allPositions.filter(
    (position) =>
      position.value !== selectedMainPosition.value && position.value !== selectedSubPosition.value
  )
})

const submitForm = (event: Event) => {
  event.preventDefault()
  if (!isFormValid.value || !remainPositions.value) {
    alert('모든 필드를 올바르게 작성해주세요.')
    return
  }

  const formData = {
    name: name.value,
    nickname: nickname.value,
    email: email.value,
    password: password.value,
    mainPosition: selectedMainPosition.value,
    mainPositionScore: mainPositionScore.value,
    subPosition: selectedSubPosition.value,
    subPositionScore: subPositionScore.value,
    remainPositionScores: {} as Record<string, number | null>
  }

  // 남은 포지션 점수를 formData에 추가
  remainPositions.value.forEach((position) => {
    formData.remainPositionScores[position.value] = remainPoints.value[position.value]
  })

  console.log('회원가입 데이터:', formData)
}
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
      border-bottom: 1px solid black;
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
  .position__container {
    display: flex;
    flex-direction: column;
    .main__positions {
      display: flex;
      flex-direction: column;
      .select__position {
        display: flex;
        justify-content: space-between;
        margin: 20px 0px;
        .main__position {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 80px;
            height: 80px;
          }
        }
      }
    }
    .main__position-point {
      display: flex;
      flex-direction: column;
      .select__point {
        display: flex;
        justify-content: space-between;
        padding: 0px 33px;
        margin: 20px 0px;
        .main__point {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          label {
            font-size: 18px;
            opacity: $opa;
          }
        }
      }
    }

    .sub__positions {
      display: flex;
      flex-direction: column;
      .select__position {
        display: flex;
        justify-content: space-between;
        margin: 20px 0px;
        .sub__position {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 80px;
            height: 80px;
          }
        }
      }
    }
    .sub__position-point {
      display: flex;
      flex-direction: column;
      .select__point {
        display: flex;
        justify-content: space-between;
        padding: 0px 33px;
        margin: 20px 0px;
        .sub__point {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          label {
            font-size: 18px;
            opacity: $opa;
          }
        }
      }
    }
    .remain__positions {
      display: flex;
      flex-direction: column;
      .remain__position {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        .position__img {
          width: 80px;
          height: 80px;
          margin-bottom: 10px;
        }
      }
    }
    .select__point {
      display: flex;
      justify-content: space-between;
      padding: 0px 33px;
      margin: 20px 0px;
      .remain__point {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        label {
          font-size: 18px;
          opacity: $opa;
        }
      }
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    button {
      background-color: $color;
      color: white;
      padding: 20px 30px;
      border-radius: 10px;
      transition: all 0.5s ease-in-out;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        color: $color;
      }
    }
  }
  .error-text {
    color: red;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 10px;
  }
}
</style>
