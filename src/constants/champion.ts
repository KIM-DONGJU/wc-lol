export type CHAMPION = {
  key: number;
  id: string;
  name: string;
  image_url: string;
  position: string[];
};

export const LOL_API_URL =
  'https://ddragon.leagueoflegends.com/cdn/14.17.1/data/ko_KR/champion.json';
