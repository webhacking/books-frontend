import { Store } from 'redux';

export interface RouteProps<T> {
  query: T;
  pathname: string;
  asPath: string;
}

export interface ConnectedInitializeProps<QueryParams> extends RouteProps<QueryParams> {
  isServer: boolean;
  store: Store;
}
