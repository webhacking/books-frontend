import 'axios';

declare module 'axios' {
  import { CustomRequestConfig } from 'src/utils/axios';
  export interface AxiosRequestConfig {
    custom?: CustomRequestConfig;
  }
}
