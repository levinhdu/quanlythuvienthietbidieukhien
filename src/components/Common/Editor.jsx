import React, { PureComponent } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import PropTypes from 'prop-types';

export default class EditorCus extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || '')
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || '';
    const blocksFromHTML = convertFromHTML(value);
    let content;
    if (value) {
      content = ContentState.createFromBlockArray(blocksFromHTML);
    } else {
      content = ContentState.createFromText('');
    }
    this.state = {
      editorState: EditorState.createWithContent(content)
    };
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    });
    const contentState = (stateToHTML(editorState.getCurrentContent()));
    this.triggerChange(contentState);
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render() {
    return (
      <div>
        <Editor
          editorClassName="content-editor"
          editorState={this.state.editorState}
          onEditorStateChange={this.onChange}
          style={{ fontWeigh: 400 }}
          wrapperClassName="demo-wrapper"
        />
      </div>
    );
  }
}

EditorCus.propTypes = {
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.string,
  onChange: PropTypes.func
};

EditorCus.defaultProps = {
  onChange: null
};
