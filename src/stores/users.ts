import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  name: string
  nickName: string
  point: number
  position: 'top' | 'mid' | 'sup' | 'jungle' | 'adc'
}

interface UserList {
  top: User[]
  mid: User[]
  sup: User[]
  jungle: User[]
  adc: User[]
}

export const useUsersStore = defineStore('users', () => {
  const userList = ref<UserList>({
    top: [
      {
        name: '김건우',
        nickName: '거뉴킹',
        point: 2,
        position: 'top'
      },
      {
        name: '김동주',
        nickName: '의로움',
        point: 3,
        position: 'top'
      },
      {
        name: '김지성',
        nickName: '조져버렸다',
        point: 5,
        position: 'top'
      },
      {
        name: '박진배',
        nickName: '살가움',
        point: 4,
        position: 'top'
      },
      {
        name: '성현명',
        nickName: '반가움',
        point: 2,
        position: 'top'
      },
      {
        name: '안일주',
        nickName: '엘올엘월즈',
        point: 3,
        position: 'top'
      },
      {
        name: '이종환',
        nickName: '푸우는바지안입어',
        point: 2,
        position: 'top'
      },
      {
        name: '이헌우',
        nickName: '늦어버렸다',
        point: 2,
        position: 'top'
      },
      {
        name: '정경수',
        nickName: '괴롭히지마십시오',
        point: 4,
        position: 'top'
      },
      {
        name: '유재경',
        nickName: '두꺼움',
        point: 2,
        position: 'top'
      }
    ],
    mid: [
      {
        name: '김건우',
        nickName: '거뉴킹',
        point: 2,
        position: 'mid'
      },
      {
        name: '김동주',
        nickName: '의로움',
        point: 2,
        position: 'mid'
      },
      {
        name: '김석현',
        nickName: '주깐네',
        point: 4,
        position: 'mid'
      },
      {
        name: '백승민',
        nickName: '괴롭혀주십시오',
        point: 2,
        position: 'mid'
      },
      {
        name: '성현명',
        nickName: '반가움',
        point: 3,
        position: 'mid'
      },
      {
        name: '이수환',
        nickName: '피터팬',
        point: 4,
        position: 'mid'
      },
      {
        name: '이승윤',
        nickName: '만능오른',
        point: 4,
        position: 'mid'
      },
      {
        name: '이완호',
        nickName: '가까움',
        point: 2,
        position: 'mid'
      },
      {
        name: '정경수',
        nickName: '괴롭히지마십시오',
        point: 4,
        position: 'mid'
      },
      {
        name: '허준영',
        nickName: '부서진장난감',
        point: 2,
        position: 'mid'
      },
      {
        name: '이호경',
        nickName: '솟구쳐버렸다',
        point: 4,
        position: 'mid'
      }
    ],
    sup: [
      {
        name: '김수관',
        nickName: '키타카와 마린',
        point: 4,
        position: 'sup'
      },
      {
        name: '변정택',
        nickName: '놀라움',
        point: 2,
        position: 'sup'
      },
      {
        name: '우명수',
        nickName: '쌀보리링',
        point: 1,
        position: 'sup'
      },
      {
        name: '유재경',
        nickName: '두꺼움',
        point: 3,
        position: 'sup'
      },
      {
        name: '이헌우',
        nickName: '늦어버렸다',
        point: 2,
        position: 'sup'
      },
      {
        name: '이호경',
        nickName: '솟구쳐버렸다',
        point: 2,
        position: 'sup'
      },
      {
        name: '안일주',
        nickName: '엘올엘월즈',
        point: 2,
        position: 'sup'
      }
    ],
    jungle: [
      {
        name: '김석현',
        nickName: '주깐네',
        point: 3,
        position: 'jungle'
      },
      {
        name: '김지성',
        nickName: '조져버렸다',
        point: 4,
        position: 'jungle'
      },
      {
        name: '우명수',
        nickName: '쌀보리링',
        point: 1,
        position: 'jungle'
      },
      {
        name: '유재훈',
        nickName: '따가움',
        point: 5,
        position: 'jungle'
      },
      {
        name: '이완호',
        nickName: '가까움',
        point: 2,
        position: 'jungle'
      },
      {
        name: '박진배',
        nickName: '살가움',
        point: 3,
        position: 'jungle'
      }
    ],
    adc: [
      {
        name: '김우진',
        nickName: '국가와맞먹는힘',
        point: 5,
        position: 'adc'
      },
      {
        name: '박종보',
        nickName: '꽉채움',
        point: 1,
        position: 'adc'
      },
      {
        name: '유재원',
        nickName: '해로움',
        point: 5,
        position: 'adc'
      },
      {
        name: '이종환',
        nickName: '푸우는바지안입어',
        point: 2,
        position: 'adc'
      },
      {
        name: '이수환',
        nickName: '피터팬',
        point: 3,
        position: 'adc'
      },
      {
        name: '이승윤',
        nickName: '만능오른',
        point: 3,
        position: 'adc'
      },
      {
        name: '전재학',
        nickName: '인사혁신부',
        point: 2,
        position: 'adc'
      },
      {
        name: '허준영',
        nickName: '부서진장난감',
        point: 1,
        position: 'adc'
      },
      {
        name: '유재훈',
        nickName: '따가움',
        point: 2,
        position: 'adc'
      }
    ]
  })

  return { userList }
})
