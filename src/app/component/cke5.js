'use client';

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function CKEditorComponent({ value, onChange, readonly = false }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        toolbar: readonly
          ? []
          : [
              'heading', '|',
              'bold', 'italic', 'link', '|',
              'bulletedList', 'numberedList', 'blockQuote', '|',
              'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
              'undo', 'redo'
            ],
        isReadOnly: readonly,
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}
