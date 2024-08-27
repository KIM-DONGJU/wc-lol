export const NOT_FOUND = {
  path: '/user-tier/:pathMatch(.*)*',
  name: 'notFound',
};

export const USER_TIER = {
  path: '/user-tier/:position',
  name: 'userTier',
};

export const CREATE_MATCH = {
  path: '/create-match',
  name: 'createMatch',
};

export const LOGIN = {
  path: '/login',
  name: 'login',
};

export const SIGN_UP = {
  path: '/sign-up',
  name: 'signUp',
};

export const MEMBER_LIST = {
  path: '/member-list',
  name: 'memberList',
};

export const USER_DETAIL = {
  path: '/user-detail/:id',
  name: 'userDetail',
};

export const MATCH_HISTORY = {
  path: '/match-history',
  name: 'matchHistory',
};
