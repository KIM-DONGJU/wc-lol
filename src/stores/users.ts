import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export type Position = 'top' | 'mid' | 'sup' | 'jungle' | 'adc'

export interface User {
  name: string
  nickname: string
  point: number
  position: Position
}

interface UserList {
  top: User[]
  mid: User[]
  sup: User[]
  jungle: User[]
  adc: User[]
}

interface PositionScore {
  top: number
  mid: number
  sup: number
  jungle: number
  adc: number
}

export interface GroupMember {
  groupId: number
  id: number
  joinedAt: string
  name: string
  nickname: string
  mainPosition: Position
  subPosition: Position | null
  userId: number | null
  positionScore: PositionScore
  role: 'member' | 'admin'
}

export const useUsersStore = defineStore(
  'users',
  () => {
    const userList = ref<UserList>({
      top: [
        {
          name: '김건우',
          nickname: '거뉴킹',
          point: 2,
          position: 'top'
        },
        {
          name: '김동주',
          nickname: '의로움',
          point: 3,
          position: 'top'
        },
        {
          name: '김지성',
          nickname: '조져버렸다',
          point: 4,
          position: 'top'
        },
        {
          name: '박진배',
          nickname: '살가움',
          point: 4,
          position: 'top'
        },
        {
          name: '성현명',
          nickname: '반가움',
          point: 2,
          position: 'top'
        },
        {
          name: '안일주',
          nickname: '엘올엘월즈',
          point: 3,
          position: 'top'
        },
        {
          name: '이종환',
          nickname: '푸우는바지안입어',
          point: 2,
          position: 'top'
        },
        {
          name: '이헌우',
          nickname: '늦어버렸다',
          point: 2,
          position: 'top'
        },
        {
          name: '정경수',
          nickname: '괴롭히지마십시오',
          point: 4,
          position: 'top'
        },
        {
          name: '유재경',
          nickname: '두꺼움',
          point: 2,
          position: 'top'
        },
        {
          name: '이승윤',
          nickname: 'du루와',
          point: 4,
          position: 'top'
        }
      ],
      mid: [
        {
          name: '김건우',
          nickname: '거뉴킹',
          point: 2,
          position: 'mid'
        },
        {
          name: '김동주',
          nickname: '의로움',
          point: 2,
          position: 'mid'
        },
        {
          name: '김석현',
          nickname: '주깐네',
          point: 4,
          position: 'mid'
        },
        {
          name: '백승민',
          nickname: '괴롭혀주십시오',
          point: 2,
          position: 'mid'
        },
        {
          name: '성현명',
          nickname: '반가움',
          point: 3,
          position: 'mid'
        },
        {
          name: '이수환',
          nickname: '피터팬',
          point: 4,
          position: 'mid'
        },
        {
          name: '이승윤',
          nickname: 'du루와',
          point: 5,
          position: 'mid'
        },
        {
          name: '이완호',
          nickname: '가까움',
          point: 2,
          position: 'mid'
        },
        {
          name: '정경수',
          nickname: '괴롭히지마십시오',
          point: 4,
          position: 'mid'
        },
        {
          name: '허준영',
          nickname: '부서진장난감',
          point: 2,
          position: 'mid'
        },
        {
          name: '이호경',
          nickname: '솟구쳐버렸다',
          point: 4,
          position: 'mid'
        }
      ],
      sup: [
        {
          name: '김수관',
          nickname: '키타카와 마린',
          point: 4,
          position: 'sup'
        },
        {
          name: '변정택',
          nickname: '놀라움',
          point: 2,
          position: 'sup'
        },
        {
          name: '우명수',
          nickname: '쌀보리링',
          point: 1,
          position: 'sup'
        },
        {
          name: '유재경',
          nickname: '두꺼움',
          point: 3,
          position: 'sup'
        },
        {
          name: '이헌우',
          nickname: '늦어버렸다',
          point: 2,
          position: 'sup'
        },
        {
          name: '이호경',
          nickname: '솟구쳐버렸다',
          point: 2,
          position: 'sup'
        },
        {
          name: '안일주',
          nickname: '엘올엘월즈',
          point: 2,
          position: 'sup'
        },
        {
          name: '이승윤',
          nickname: 'du루와',
          point: 4,
          position: 'sup'
        },
        {
          name: '이완호',
          nickname: '가까움',
          point: 2,
          position: 'sup'
        },
        {
          name: '김준현',
          nickname: '사랑시고백구행복동',
          point: 3,
          position: 'sup'
        }
      ],
      jungle: [
        {
          name: '김석현',
          nickname: '주깐네',
          point: 3,
          position: 'jungle'
        },
        {
          name: '김지성',
          nickname: '조져버렸다',
          point: 3,
          position: 'jungle'
        },
        {
          name: '우명수',
          nickname: '쌀보리링',
          point: 1,
          position: 'jungle'
        },
        {
          name: '유재훈',
          nickname: '따가움',
          point: 4,
          position: 'jungle'
        },
        {
          name: '박진배',
          nickname: '살가움',
          point: 4,
          position: 'jungle'
        },
        {
          name: '이승윤',
          nickname: 'du루와',
          point: 4,
          position: 'jungle'
        },
        {
          name: '김준현',
          nickname: '사랑시고백구행복동',
          point: 3,
          position: 'jungle'
        }
      ],
      adc: [
        {
          name: '김우진',
          nickname: '국가와맞먹는힘',
          point: 5,
          position: 'adc'
        },
        {
          name: '박종보',
          nickname: '꽉채움',
          point: 1,
          position: 'adc'
        },
        {
          name: '유재원',
          nickname: '해로움',
          point: 5,
          position: 'adc'
        },
        {
          name: '이종환',
          nickname: '푸우는바지안입어',
          point: 2,
          position: 'adc'
        },
        {
          name: '이수환',
          nickname: '피터팬',
          point: 4,
          position: 'adc'
        },
        {
          name: '이승윤',
          nickname: 'du루와',
          point: 4,
          position: 'adc'
        },
        {
          name: '전재학',
          nickname: '인사혁신부',
          point: 2,
          position: 'adc'
        },
        {
          name: '허준영',
          nickname: '부서진장난감',
          point: 1,
          position: 'adc'
        },
        {
          name: '유재훈',
          nickname: '따가움',
          point: 2,
          position: 'adc'
        },
        {
          name: '백승민',
          nickname: '괴롭혀주십시오',
          point: 3,
          position: 'adc'
        }
      ]
    })

    const groupMembers = ref<GroupMember[]>([])
    const setGroupMembers = (members: GroupMember[]) => {
      groupMembers.value = members
    }

    const getGroupMembers = async () => {
      try {
        const { data } = await supabase
          .from('groupmembers')
          .select<'', GroupMember>()
          .eq('groupId', 1)

        setGroupMembers(data || [])
      } catch (err) {
        console.log(err)
      }
    }

    return { userList, getGroupMembers, groupMembers }
  },
  {
    persist: [
      {
        storage: sessionStorage,
        paths: ['groupMembers']
      }
    ]
  }
)
