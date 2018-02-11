// @flow

import * as React from 'react';

async function importMDE(): Promise<any> {
  return import('simplemde-lite');
}

type Props = {|
  name: string,
  required?: boolean,
  value: string,
|};

// MDE is an uncontrolled component! - FIXME
export default class MDE extends React.Component<Props> {
  el: ?HTMLElement;
  simplemde: any;

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.el = document.querySelector(`textarea[name="${this.props.name}"]`);
    this.createEditor();
  }

  createEditor() {
    var component = this;

    (async function(): Promise<any> {
      const simplemde = await importMDE();
      component.simplemde = new simplemde({
        element: component.el,
        forceSync: true,
        hideIcons: ['heading', 'side-by-side', 'fullscreen'],
        indentWithTabs: false,
        lineWrapping: true,
        showIcons: ['code', 'table'],
        spellChecker: false,
        status: false,
      });
    })();
  }

  render(): React.Node {
    return (
      <textarea
        defaultValue={this.props.value}
        name={this.props.name}
        required={this.props.required}
      />
    );
  }
}
