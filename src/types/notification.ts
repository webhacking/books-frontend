export interface Notification {
  landingUrl: string;
  deeplinkUrl: string | null;
  expireAt: number;
  imageUrl: string;
  imageType: string;
  createdAt: number;
  userIdx: number;
  message: string;
  tag: string;
  id: string;
  itemId: string;
  strCreatedAt: string;
}
