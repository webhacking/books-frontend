import { Store } from 'redux';
import * as http from 'http';
import { Request } from 'express';

export interface RouteProps<T> {
  query: T;
  pathname: string;
  asPath: string;
  req?: Request;
  res?: http.ServerResponse;
}

export interface ConnectedInitializeProps<QueryParams> extends RouteProps<QueryParams> {
  isServer: boolean;
  store: Store;
}
