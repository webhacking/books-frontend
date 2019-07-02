export interface BookScheme {
  bId: string;
  imageUrl: string;
  title: string;
  author: string;
  serviceAtSelect?: boolean;
  isAdult?: boolean;
  avgRating?: number; // 평균 별점
  totalReviewer?: number; // 리뷰 한 사람 수
  tag?: 'novel' | 'comic';
  isSomeDeal: boolean;
}
