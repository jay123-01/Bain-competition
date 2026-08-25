export type Hotel = {
  id: number; name: string; area: string; price: number; rating: number;
  freeCancellation: boolean; breakfast: boolean; reason: string;
};

export const hotels: Hotel[] = [
  { id: 1, name: "Shibuya Stay", area: "Shibuya", price: 220000, rating: 8.8, freeCancellation: true, breakfast: true, reason: "맛집 탐방과 밤 산책을 중요하게 생각하는 커플에게 추천해요." },
  { id: 2, name: "Ebisu Urban Hotel", area: "Ebisu", price: 195000, rating: 8.6, freeCancellation: true, breakfast: false, reason: "주요 일정까지 이동 시간을 줄이고 예산 균형을 맞추기 좋아요." },
  { id: 3, name: "Tokyo Central Hotel", area: "Ginza", price: 240000, rating: 9.0, freeCancellation: true, breakfast: true, reason: "미식과 쇼핑을 함께 즐기는 여유로운 여행 동선에 잘 맞아요." }
];
