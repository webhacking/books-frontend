import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// eslint-disable-next-line no-process-env
const TIME_OUT = process.env.NODE_ENV !== 'production' ? 10000 : 3000;

class AxiosWrapper {
  public static instance;

  private axiosInstance: AxiosInstance;

  public constructor(axiosOption?: AxiosRequestConfig) {
    if (AxiosWrapper.instance) {
      return AxiosWrapper.instance;
    }
    this.axiosInstance = axios.create({
      ...axiosOption,
      timeout: axiosOption.timeout || TIME_OUT,
    });

    // this.axiosInstance.interceptors.response.use(null, error => {
    //   return Promise.reject(error);
    // });

    AxiosWrapper.instance = this;
  }

  public get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.axiosInstance.get(url, config);
  }

  public post<T, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.axiosInstance.post(url, data, config);
  }

  public delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.axiosInstance.delete(url, config);
  }
}
export default new AxiosWrapper({ timeout: TIME_OUT });
