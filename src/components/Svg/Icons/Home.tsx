import * as React from 'react';
import { SVGAttributes } from 'react';

// tslint:disable-next-line
export default (props: SVGAttributes<any>) => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M12 2a.997.997 0 0 0-.707.293l-8.854 8.853a1.504 1.504 0 0 0-.44 1.06v9.38a1 1 0 0 0 1 1h5.998a1 1 0 0 0 1-1v-6h4.007v6a1 1 0 0 0 1 1H21a1 1 0 0 0 1-1v-9.38c0-.396-.157-.778-.438-1.06l-8.854-8.853A1 1 0 0 0 12 2m0 2.415l8 7.999v8.172h-3.996v-6a1 1 0 0 0-1-1H8.997a1 1 0 0 0-1 1v6H4v-8.172l8-8" />
  </svg>
);
