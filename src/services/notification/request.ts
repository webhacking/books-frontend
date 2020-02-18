import axios, { OAuthRequestType } from 'src/utils/axios';
import { Notification } from 'src/types/notification';

export interface NotificationAuthResponse {
  token: string;
  expired: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface NotificationUnreadCountResponse {
  success: boolean;
  count: number;
}

export const requestNotificationAuth = async () => {
  const tokenUrl = new URL(
    '/users/me/notification-token/',
    process.env.STORE_API,
  );

  const { data } = await axios.get<NotificationAuthResponse>(tokenUrl.toString(), {
    custom: { authorizationRequestType: OAuthRequestType.STRICT },
    withCredentials: true,
  });

  return data;
};

export const requestNotification = async (limit: number, token: string) => {
  const notificationUrl = new URL('/notification', process.env.STORE_API);

  const { data } = await axios.get<NotificationResponse>(notificationUrl.toString(), {
    params: { limit },
    custom: { authorizationRequestType: OAuthRequestType.STRICT },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const requestNotificationRead = async (token: string) => {
  const notificationUrl = new URL('/notification', process.env.STORE_API);

  const res = await axios.put(notificationUrl.toString(), null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const requestUnreadCount = async (token: string) => {
  const notificationUrl = new URL(
    '/notification/unread_count',
    process.env.STORE_API,
  );

  const { data } = await axios.get<NotificationUnreadCountResponse>(
    notificationUrl.toString(),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};
