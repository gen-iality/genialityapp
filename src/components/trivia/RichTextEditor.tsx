import { FunctionComponent, useEffect, useRef, useState } from 'react'

import { toolbarEditor } from '@helpers/constants'
import ReactQuill from 'react-quill'
import { Input } from 'antd'

interface IRichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
}

const RichTextEditor: FunctionComponent<IRichTextEditorProps> = (props) => {
  const { value, onChange = () => {} } = props
  const [lastValue, setLastValue] = useState('')

  const ref = useRef<any>(null)

  useEffect(() => {
    if (ref.current && value) {
      const editor = ref.current.getEditor()
      console.log('editor', editor)
      if (lastValue !== value) {
        editor.setText(value)
      }
    }
  }, [value, ref])

  // return (
  //   <ReactQuill
  //     ref={ref}
  //     modules={toolbarEditor}
  //     onChange={(content) => {
  //       onChange(content)
  //       setLastValue(content)
  //     }}
  //   />
  // )
  return <Input.TextArea value={value} onChange={onChange} />
}

export default RichTextEditor
