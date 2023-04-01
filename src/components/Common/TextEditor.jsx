import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'code'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'code',
];

const TextEditor = ({ value, onChange, placeholder, readOnly, height, noToolbar, ...props }) => {
  const moduleFormat = noToolbar ? {modules: { toolbar: null }, formats: []} : {modules, formats};
  return (
    <>
      <ReactQuill
        theme="snow"
        value={value || ''}
        {...moduleFormat}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ height }}
        {...props}
      />
    </>
  );
};

TextEditor.defaultProps = {
  height: 200,
  readOnly: false,
  noToolbar: true
}

export default TextEditor;
