import axios, { AxiosInstance } from 'axios';
import { tokenInterceptor } from 'src/utils/axiosInterceptors';

export enum OAuthRequestType {
  NORMAL = 'NORMAL', // 실패하더라도 특별한 행동을 하지 않는다
  CHECK = 'CHECK', // rt 갱신 시도, at 확인 후 실패하더라도 실패한 결과를 반환
  STRICT = 'STRICT', // rt 갱신, at 확인 후 로그인되지 않았다면 로그인 페이지로 이동
}

export interface CustomRequestConfig {
  authorizationRequestType: OAuthRequestType;
}

// eslint-disable-next-line no-process-env
const TIME_OUT = process.env.NODE_ENV !== 'production' ? 10000 : 5000;

const globalAxiosConfig = () => {
  axios.defaults.timeout = TIME_OUT;
};
globalAxiosConfig();

const createAxiosInstances = (): AxiosInstance => {
  const instance = axios.create({ timeout: TIME_OUT });
  instance.interceptors.response.use(onFulfilled => onFulfilled, tokenInterceptor);
  return instance;
};
export default createAxiosInstances();
