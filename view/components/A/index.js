// @flow

import * as React from 'react';

type Props = {|
  children: string,
  href?: string,
  onClick?: (SyntheticEvent<HTMLAnchorElement> => void),
|};

export default function A(props: Props): React.Node {
  return (
    <a
      className="link"
      href={props.href}
      onClick={props.onClick}
    >
      {props.children}
    </a>
  );
}
