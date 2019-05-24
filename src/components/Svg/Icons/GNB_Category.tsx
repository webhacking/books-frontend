import * as React from 'react';
import { SVGAttributes } from 'react';

// tslint:disable-next-line
const Icon = (props: SVGAttributes<any>) => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M2 7.001h20V5H2v2.001zm3 6h14v-2H5v2zm3.999 6h6v-2h-6v2z" />
  </svg>
);

export default Icon;
