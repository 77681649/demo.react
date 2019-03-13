import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'

import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'

class Editor extends Component {
  state = {
    webDescription: ''
  }
  componentDidMount() {
    const { value } = this.props

    this.setState({
      webDescription: value
    })
  }
  render() {
    const { webDescription } = this.state

    return (
      <div className="App">
        <CKEditor
          editor={ClassicEditor}
          config={{
            builtinPlugins: [ Paragraph],
            language: 'zh-cn',
            toolbar: ['bold', 'italic']
          }}
          // data={webDescription}
          // onInit={editor => {
          //   console.log(editor)
          //   // You can store the "editor" and use when it is needed.
          //   // console.log( 'Editor is ready to use!', editor );
          // }}
          // onChange={(event, editor) => {
          //   const data = editor.getData()
          //   console.log({ event, editor, data })
          // }}
          // onBlur={editor => {
          //   console.log('Blur.', editor)
          // }}
          // onFocus={editor => {
          //   console.log('Focus.', editor)
          // }}
        />
      </div>
    )
  }
}

export default Editor
