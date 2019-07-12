import { notifySentry } from './sentry';

// tslint:disable-next-line
export const safeJSONParse = (source: string | null, defaultValue: any) => {
  if (!source) {
    return defaultValue;
  }
  try {
    return JSON.parse(source);
  } catch (err) {
    notifySentry(err);
    return defaultValue;
  }
};

export const isJSON = (source: string) => {
  try {
    JSON.parse(source);
    return true;
  } catch (err) {
    return false;
  }
};

export const timeAgo = (timestamp: number) => {
  let diff = Date.now() - timestamp;

  // 분단위로 변환
  diff = Math.floor(diff / (60 * 1000));

  if (diff < 1) {
    return '방금 전';
  }

  if (diff < 60) {
    return `${diff}분 전`;
  }

  // 시간단위로 변환
  diff = Math.floor(diff / 60);
  if (diff < 24) {
    return `${diff}시간 전`;
  }

  // 일 단위로 변환
  diff = Math.floor(diff / 24);
  if (diff < 30) {
    return `${diff}일 전`;
  }

  // 월 단위로 변환
  diff = Math.floor(diff / 30);

  return `${diff}개월 전`;
};
