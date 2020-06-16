import { Store } from 'redux';
import { NextPageContext } from 'next';

export interface ConnectedInitializeProps extends NextPageContext {
  store: Store;
}
