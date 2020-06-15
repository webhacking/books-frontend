import axios, { AxiosError } from 'axios';

export const authorizeTokenFallback = async (rejectedError: AxiosError) => {
  await axios.get('/ridi/authorize/', {
    withCredentials: true,
    baseURL: process.env.NEXT_STATIC_ACCOUNT_API,
    params: {
      client_id: process.env.NEXT_STATIC_RIDI_OAUTH2_CLIENT_ID,
      response_type: 'code',
      redirect_uri: `${process.env.NEXT_STATIC_ACCOUNT_API}/ridi/complete`,
    },
  });

  // 원본 요청
  return axios(rejectedError.config);
};

export const refreshTokenFallback = async (rejectedError: AxiosError) => {
  try {
    await axios.post('/ridi/token', null, {
      baseURL: process.env.NEXT_STATIC_ACCOUNT_API,
      withCredentials: true,
    });
  } catch (error) {
    const { response } = error;
    if (!response) {
      return Promise.reject(error);
    }
    // Access-Token 확인
    return authorizeTokenFallback(rejectedError);
  }

  // 원본 요청
  return axios(rejectedError.config);
};

export const tokenInterceptor = (onRejected: AxiosError) => {
  const { response } = onRejected;
  if (!response) {
    return Promise.reject(onRejected);
  }

  const tokenUrl = `${process.env.NEXT_STATIC_ACCOUNT_API}/ridi/token/`;
  if (
    (response.status === 401 || response.status === 403)
    && response.config.url !== tokenUrl
  ) {
    return refreshTokenFallback(onRejected);
  }

  return Promise.reject(onRejected);
};
