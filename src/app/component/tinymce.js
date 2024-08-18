'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TINYMCE_API_KEY = "tq9ywmke8tnt4fp3k7nlfu6slafmm644kx7fj7i56vk97nie";

export default function TinyMCEEditor({ value, onChange, readonly = false }) {
  return (
    <Editor
      apiKey={TINYMCE_API_KEY}
      value={value}
      init={{
        branding: false,
        height: '100%',
        menubar: false,
        placeholder: 'Start typing...',
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
          'paste', // Add the paste plugin
          'powerpaste', // Add the PowerPaste plugin
          'code', // Add the code plugin
          'table', // Add the table plugin
          'image', // Add the image plugin
          'media', // Add the media plugin
          'emoticons', // Add the emoticons plugin
        ],
        toolbar: readonly
          ? false
          : 'undo redo | formatselect | fontselect fontsizeselect | ' +
            'bold italic underline strikethrough | forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | ' +
            'link image media | code | table | emoticons',
        readonly: readonly,
        paste_as_text: false, // Ensure styles are retained
        paste_data_images: true, // Allow pasting images
        powerpaste_allow_local_images: true, // Enable local image handling
        powerpaste_word_import: 'merge', // Options: 'clean', 'merge'
        powerpaste_html_import: 'merge', // Options: 'clean', 'merge'
        powerpaste_googledocs_import: 'merge',
      }}
      onEditorChange={onChange}
    />
  );
}
