import { FunctionComponent, useEffect, useState } from 'react'

import ReactQuill from 'react-quill'

interface IRichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
}

const RichTextEditor: FunctionComponent<IRichTextEditorProps> = (props) => {
  const { value: incomingValue, onChange = () => {} } = props

  const [isLoaded, setIsLoaded] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => onChange(content), [content])

  useEffect(() => {
    if (incomingValue && !isLoaded) {
      setIsLoaded(true)
      setContent(incomingValue)
    }
  }, [incomingValue, isLoaded])

  return <ReactQuill value={content} onChange={(content) => setContent(content)} />
}

export default RichTextEditor
