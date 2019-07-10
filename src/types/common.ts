import { Store } from 'redux';
import { NextPageContext } from 'next';
import { Request } from 'express';

export interface ConnectedInitializeProps extends NextPageContext {
  store: Store;
  req?: Request;
}
