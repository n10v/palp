// @flow

import classnames from 'classnames';
import * as React from 'react';

type Props = {|
  children?: React.Node,
  className?: string,
  danger?: boolean,
  disabled?: boolean,
  iconName?: string,
  large?: boolean,
  onClick?: (SyntheticEvent<HTMLButtonElement> => void),
  primary?: boolean,
  type?: string,
|};

export default function Button(props: Props): React.Node {
  var iconClass: string;
  if (props.iconName != null) {
    iconClass = `pt-icon-${props.iconName}`;
  }

  const fullClassName = classnames({
    'pt-button': true,
    'pt-disabled': props.disabled,
    'pt-intent-danger': props.danger,
    'pt-intent-primary': props.primary,
    'pt-large': props.large,
    'button': true
  }, iconClass, props.className);

  return (
    <button
      className={fullClassName}
      onClick={props.onClick}
      type={props.type}
    >
      {props.children}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
};
