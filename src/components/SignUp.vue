<template>
  <div class="signup__container">
    <h1 class="signup__text">회원가입</h1>
    <form>
      <div class="inputs">
        <label for="name">이름</label>
        <input
          type="text"
          id="name"
          placeholder="본인의 이름을 작성해주세요(예: 홍길동) "
          required
        />
        <label for="nickname">롤 닉네임</label>
        <input
          type="text"
          id="nickname"
          placeholder="롤 닉네임을 작성해주세요(예: 괴롭혀주십시오)"
          required
        />
        <label for="email">이메일</label>
        <input
          type="email"
          id="email"
          placeholder="사용할 이메일을 작성해주세요(예: example@example.com)"
          required
        />
        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          placeholder="최대15자로 작성해주세요"
          maxlength="15"
          required
        />
      </div>
      <div class="position__container">
        <div class="main__positions">
          <p class="position__text">주 포지션을 선택해주세요</p>
          <div class="select__position">
            <label for="main__top" class="main__position" @click="mainPositionChecked">
              탑
              <img :src="top" alt="top" class="position__img" />
              <input type="radio" id="main__top" value="top" name="main-position" />
            </label>
            <label for="main__jungle" class="main__position" @click="mainPositionChecked">
              정글
              <img :src="jungle" alt="jungle" class="position__img" />
              <input type="radio" id="main__jungle" value="jungle" name="main-position" />
            </label>
            <label for="main__mid" class="main__position" @click="mainPositionChecked">
              미드
              <img :src="mid" alt="mid" class="position__img" />
              <input type="radio" id="main__mid" value="mid" name="main-position" />
            </label>
            <label for="main__adc" class="main__position" @click="mainPositionChecked">
              원딜
              <img :src="adc" alt="adc" class="position__img" />
              <input type="radio" id="main__adc" value="adc" name="main-position" />
            </label>
            <label for="main__sup" class="main__position" @click="mainPositionChecked">
              서포터
              <img :src="sup" alt="sup" class="position__img" />
              <input type="radio" id="main__sup" value="sup" name="main-position" />
            </label>
          </div>
        </div>
        <div class="main__position-point hidden" v-show="showMainPointBox">
          <p class="select__point-text">주 포지션의 점수를 선택하세요</p>
          <div class="select__point">
            <div class="main__point">
              <label for="main-one">1</label>
              <input type="radio" id="main-one" value="one" name="main-point" />
            </div>

            <div class="main__point">
              <label for="main-two">2</label>
              <input type="radio" id="main-two" value="two" name="main-point" />
            </div>

            <div class="main__point">
              <label for="main-three">3</label>
              <input type="radio" id="main-three" value="three" name="main-point" />
            </div>

            <div class="main__point">
              <label for="main-four">4</label>
              <input type="radio" id="main-four" value="four" name="main-point" />
            </div>

            <div class="main__point">
              <label for="main-five">5</label>
              <input type="radio" id="main-five" value="five" name="main-point" />
            </div>
          </div>
        </div>

        <div class="sub__positions">
          <p class="position__text">부 포지션을 선택해주세요</p>
          <div class="select__position">
            <label for="sub__top" class="sub__position" @click="subPositionChecked"
              >탑
              <img :src="top" alt="top" class="position__img" />
              <input type="radio" id="sub__top" value="top" name="sub-position" />
            </label>

            <label for="sub__jungle" class="sub__position" @click="subPositionChecked"
              >정글
              <img :src="jungle" alt="jungle" class="position__img" />
              <input type="radio" id="sub__jungle" value="jungle" name="sub-position" />
            </label>

            <label for="sub__mid" class="sub__position" @click="subPositionChecked"
              >미드
              <img :src="mid" alt="mid" class="position__img" />
              <input type="radio" id="sub__mid" value="mid" name="sub-position" />
            </label>

            <label for="sub__adc" class="sub__position" @click="subPositionChecked"
              >원딜
              <img :src="adc" alt="adc" class="position__img" />
              <input type="radio" id="sub__adc" value="adc" name="sub-position" />
            </label>

            <label for="sub__sup" class="sub__position" @click="subPositionChecked"
              >서포터
              <img :src="sup" alt="sup" class="position__img" />
              <input type="radio" id="sub__sup" value="sup" name="sub-position" />
            </label>
          </div>
        </div>
        <div class="sub__position-point" v-show="showSubPointBox">
          <p class="select__point-text">부 포지션의 점수를 선택하세요</p>
          <div class="select__point">
            <div class="sub__point">
              <label for="sub-one">1</label>
              <input type="radio" id="sub-one" value="one" name="sub-point" />
            </div>
            <div class="sub__point">
              <label for="sub-two">2</label>
              <input type="radio" id="sub-two" value="two" name="sub-point" />
            </div>
            <div class="sub__point">
              <label for="sub-three">3</label>
              <input type="radio" id="sub-three" value="three" name="sub-point" />
            </div>
            <div class="sub__point">
              <label for="sub-four">4</label>
              <input type="radio" id="sub-four" value="four" name="sub-point" />
            </div>
            <div class="sub__point">
              <label for="sub-five">5</label>
              <input type="radio" id="sub-five" value="five" name="sub-point" />
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <button @click="goBack">뒤로가기</button>
        <button type="submit">가입하기</button>
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
import { ref } from 'vue'

const router = useRouter()
const goBack = () => {
  router.back()
}

const showMainPointBox = ref(false)
const showSubPointBox = ref(false)

const mainPositionChecked = () => {
  showMainPointBox.value = true
}

const subPositionChecked = () => {
  showSubPointBox.value = true
}
</script>

<style lang="scss">
$opa: 0.6;

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
        background-color: rgba(0, 0, 0, 0.1);
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
  }
  .btns {
    display: flex;
    justify-content: space-between;
    button {
      background-color: #5282e6;
      color: white;
      padding: 20px 30px;
      border-radius: 10px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        color: #5282e6;
      }
    }
  }
}
</style>
