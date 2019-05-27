import * as React from 'react';

interface PartialSeparatorProps {
  name: string;
  wrapped: boolean;
}

export const PartialSeparator: React.FC<PartialSeparatorProps> = props => {
  const { name, wrapped } = props;
  if (wrapped) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: `<!-- ${name}_START -->` }} />
        {props.children}
        <style dangerouslySetInnerHTML={{ __html: `<!-- ${name}_END -->` }} />
      </>
    );
  }
  return <>{props.children}</>;
};
