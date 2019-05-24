import * as React from 'react';
import { AnchorHTMLAttributes } from 'react';
import { Link } from 'server/routes';

interface AnchorProps {
  // tslint:disable-next-line
  anchorProps?: AnchorHTMLAttributes<any>;
  path?: string;
  isPartials: boolean;
  shallow?: boolean;
  replace?: boolean;
}

const Anchor: React.FC<AnchorProps> = props => {
  if (!props.isPartials) {
    return (
      <Link shallow={props.shallow} replace={props.replace} route={props.path}>
        {props.children}
      </Link>
    );
  }
  return <>{props.children}</>;
};

export default Anchor;
