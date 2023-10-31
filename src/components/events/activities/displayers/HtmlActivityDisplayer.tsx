import { useState, useEffect, useRef, type FunctionComponent } from 'react'
import HeaderColumnswithContext from '../HeaderColumns'

import { IBasicActivityProps } from './basicTypes'
import { Alert } from 'antd'

const HtmlActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props

  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [htmlUrl, setHtmlUrl] = useState<string | null>(null)

  const htmlContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof onActivityProgress === 'function') onActivityProgress(100)
  }, [])

  useEffect(() => {
    if (!activity.content?.reference) return

    console.debug('will set', activity.content.type, 'content type')
    switch (activity.content.type) {
      case 'html_url':
        setHtmlUrl(activity.content.reference)
        break
      case 'html_content':
        setHtmlContent(activity.content.reference)
        break
      default:
        console.warn('The content type', activity.content.type, 'is unknown')
    }
  }, [activity.content])

  useEffect(() => {
    if (!htmlContentRef.current) return
    if (!htmlContent || !htmlContent.trim()) return
    if (htmlContent !== htmlContentRef.current.innerHTML) {
      console.debug('Update innerHTML')
      htmlContentRef.current.innerHTML = htmlContent
    }
  }, [htmlContentRef.current, htmlContent])

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activity} />
      {htmlContent ? (
        <div ref={htmlContentRef} style={{ width: '100%' }} />
      ) : htmlUrl ? (
        <iframe src={htmlUrl} />
      ) : (
        <Alert type="warning" message="No se ha configurado un contenido para esto" />
      )}
    </>
  )
}

export default HtmlActivityDisplayer
