import React, { PropTypes } from 'react';
import { addEventListener, removeEventListener } from 'consolidated-events';

const propTypes = {
  children: PropTypes.node,
  onOutsideClick: PropTypes.func,
};

const defaultProps = {
  children: <span />,
  onOutsideClick: () => {},
};

export default class OutsideClickHandler extends React.Component {
  constructor(props) {
    super(props);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  componentDidMount() {
    let placeholder = document.createElement('div');
    let isSupportedTouch = 'ontouchend' in placeholder;
    // cross-browser check
    if (!isSupportedTouch) {
      placeholder.setAttribute('ontouchend', 'return;');
      isSupportedTouch = typeof placeholder.ontouchend === 'function';
    }
    const event = isSupportedTouch ? 'touchstart' : 'click';
    placeholder = null;
    this.clickHandle = addEventListener(
      document,
      event,
      this.onOutsideClick,
      { capture: true },
    );
  }

  componentWillUnmount() {
    removeEventListener(this.clickHandle);
  }

  onOutsideClick(e) {
    const isDescendantOfRoot = this.childNode.contains(e.target);
    if (!isDescendantOfRoot) {
      this.props.onOutsideClick(e);
    }
  }

  render() {
    return (
      <div ref={(ref) => { this.childNode = ref; }}>
        {this.props.children}
      </div>
    );
  }
}

OutsideClickHandler.propTypes = propTypes;
OutsideClickHandler.defaultProps = defaultProps;
