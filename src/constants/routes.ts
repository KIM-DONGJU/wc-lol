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

export const MATCH_HISTORY = {
  path: '/match-history',
  name: 'matchHistory',
};
