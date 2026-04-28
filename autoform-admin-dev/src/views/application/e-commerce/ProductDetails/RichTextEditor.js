import * as React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

export default function RichTextEditor({ productInfo, name, onChangeEditor }) {
    return (
        <CKEditor
            editor={Editor}
            data={productInfo}
            config={{
                toolbar: {
                    shouldNotGroupWhenFull: true
                }
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChangeEditor(name, data);
            }}
        />
    );
}
