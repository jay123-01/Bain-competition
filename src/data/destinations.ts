export type Destination = {
  id: string;
  chipLabel: string;
  heroTitle: string;
  heroTag: string;
  heroLocation: string;
  promptTemplate: string;
};

export const destinations: Destination[] = [
  {
    id: "tokyo",
    chipLabel: "도쿄",
    heroTitle: "TOKYO",
    heroTag: "도쿄 여행 가이드",
    heroLocation: "Shibuya, Japan",
    promptTemplate: "여자친구와 11월에 도쿄 3박 4일, 예산 120만원"
  },
  {
    id: "paris",
    chipLabel: "파리",
    heroTitle: "PARIS",
    heroTag: "파리 여행 가이드",
    heroLocation: "Le Marais, France",
    promptTemplate: "친구들과 12월에 파리 4박 5일, 예산 180만원"
  },
  {
    id: "bali",
    chipLabel: "발리",
    heroTitle: "BALI",
    heroTag: "발리 여행 가이드",
    heroLocation: "Seminyak, Indonesia",
    promptTemplate: "혼자 다음 달 발리 5박 6일, 예산 150만원"
  },
  {
    id: "newyork",
    chipLabel: "뉴욕",
    heroTitle: "NEW YORK",
    heroTag: "뉴욕 여행 가이드",
    heroLocation: "Manhattan, USA",
    promptTemplate: "가족과 내년 초 뉴욕 4박 5일, 예산 250만원"
  }
];
