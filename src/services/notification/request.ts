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
  const tokenUrl = `${process.env.NEXT_PUBLIC_STORE_API}/users/me/notification-token/`;
  const { data } = await axios.get<NotificationAuthResponse>(tokenUrl, {
    custom: { authorizationRequestType: OAuthRequestType.STRICT },
    withCredentials: true,
  });

  return data;
};

export const requestNotification = async (limit: number, token: string) => {
  const notificationUrl = `${process.env.NEXT_PUBLIC_STORE_API}/notification`;
  const { data } = await axios.get<NotificationResponse>(notificationUrl, {
    params: { limit },
    custom: { authorizationRequestType: OAuthRequestType.STRICT },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const requestNotificationRead = async (token: string) => {
  const notificationUrl = `${process.env.NEXT_PUBLIC_STORE_API}/notification`;
  const res = await axios.put(notificationUrl, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const requestUnreadCount = async (token: string) => {
  const notificationUrl = `${process.env.NEXT_PUBLIC_STORE_API}/notification/unread_count`;
  const { data } = await axios.get<NotificationUnreadCountResponse>(
    notificationUrl,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};
