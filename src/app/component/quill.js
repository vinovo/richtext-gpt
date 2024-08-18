'use client';

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles for the Quill editor

export default function QuillEditor({ value, onChange, readonly = false }) {
  const modules = {
    toolbar: readonly
      ? false
      : [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
          [{size: []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, 
           {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image', 'video'],
          ['clean']                                         
        ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      readOnly={readonly}
      theme="snow" // Use the "snow" theme for a nice looking editor
    />
  );
}
