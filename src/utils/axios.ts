import axios, { AxiosInstance } from 'axios';
import { AbortError } from 'p-retry';
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
const TIME_OUT = 7000;

const globalAxiosConfig = () => {
  axios.defaults.timeout = TIME_OUT;
};
globalAxiosConfig();

export function wrapCatchCancel<F extends Function>(f: F): F {
  return (function (...args: any[]) {
    try {
      return f.apply(this, args);
    } catch (err) {
      if (axios.isCancel(err)) {
        // 취소되었다면 재시도하지 않음
        throw new AbortError(err);
      }
      throw err;
    }
  } as unknown) as F;
}

const createAxiosInstances = (): AxiosInstance => {
  const instance = axios.create({ timeout: TIME_OUT });
  instance.interceptors.response.use((onFulfilled) => onFulfilled, tokenInterceptor);
  if (process.env.SERVERLESS) {
    import('axios-logger').then((logger) => {
      instance.interceptors.request.use(logger.requestLogger, logger.errorLogger);
      instance.interceptors.response.use(logger.responseLogger, logger.errorLogger);
    });
  }
  return instance;
};
export default createAxiosInstances();
