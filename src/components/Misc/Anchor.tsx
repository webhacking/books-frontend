import React, { AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

interface AnchorProps {
  // tslint:disable-next-line
  anchorProps?: AnchorHTMLAttributes<any>;
  path?: string;
  isPartials: boolean;
  shallow?: boolean;
  replace?: boolean;
}

export const Anchor: React.FC<AnchorProps> = (props) => {
  if (!props.isPartials) {
    return (
      <Link shallow={props.shallow} replace={props.replace} href={props.path}>
        {props.children}
      </Link>
    );
  }
  return <>{props.children}</>;
};
