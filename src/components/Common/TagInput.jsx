import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Tag,
  Input,
  Tooltip
} from 'antd';

export default class TagInput extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || [])
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || [];
    this.state = {
      tags: value,
      inputValue: ''
    };
  }

  handleClose = (removedTag) => {
    const {
      tags
    } = this.state;
    const newTags = tags.filter(tag => tag !== removedTag);
    this.setState({ tags: newTags });
  };

  showInput = () => {
    this.input.focus();
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.triggerChange(tags);
    this.setState({
      tags,
      inputValue: ''
    });
  };

  saveInputRef = (input) => {
    this.input = input;
    return input;
  };

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render() {
    const { tags, inputValue } = this.state;
    return (
      <div className="ant-input tags-input" onClick={this.showInput}>
        {tags.map((tag) => {
          const isLongTag = tag.length > 50;
          const tagElem = (
            <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 50)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip key={tag} title={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        <Input
          ref={this.saveInputRef}
          className="ant-tag-addnew-input"
          onBlur={this.handleInputConfirm}
          onChange={this.handleInputChange}
          onPressEnter={this.handleInputConfirm}
          placeholder={this.props.placeholder}
          size="small"
          type="text"
          value={inputValue}
        />
      </div>
    );
  }
}

TagInput.propTypes = {
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

TagInput.defaultProps = {
  onChange: () => {},
  placeholder: ''
};
