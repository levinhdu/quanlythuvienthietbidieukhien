import React, { PureComponent } from 'react';
import { Input as InputAnt, InputNumber as InputNumberAnt } from 'antd';
import PropTypes from 'prop-types';

const { TextArea, Group } = InputAnt;

export default class Input extends PureComponent {
  render() {
    if (this.props.type === 'textArea') {
      return (<TextArea {...this.props} />);
    }
    if (this.props.type === 'inputGroup') {
      return (<Group {...this.props} />)
    }
    if (this.props.type === 'numberVN') {
      if (this.props.step) {
        return (
          <InputNumberAnt
            step={this.props.step}
            {...this.props}
            ref={this.props.refcallback}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        )
      }
      // 1000 => 1,000
      return (
        <InputNumberAnt
          {...this.props}
          ref={this.props.refcallback}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      )
    }
    return (<InputAnt {...this.props} />);
  }
}

Input.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

Input.defaultProps = {
  type: '',
  refcallback: null
};
