import * as React from 'react';
import { AnchorHTMLAttributes } from 'react';
import { Link } from 'server/routes';

interface AnchorProps {
  // tslint:disable-next-line
  anchorProps?: AnchorHTMLAttributes<any>;
  linkProps?: string;
  isPartials: boolean;
}

const Anchor: React.FC<AnchorProps> = props => {
  if (!props.isPartials) {
    return <Link route={props.linkProps}>{props.children}</Link>;
  }
  return <>{props.children}</>;
};

export default Anchor;
