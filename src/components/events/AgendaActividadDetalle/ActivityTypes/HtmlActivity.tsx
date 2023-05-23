import { useState, useEffect, useRef, type FunctionComponent } from 'react'
import HeaderColumnswithContext from '../HeaderColumns'

import { IBasicActivityProps } from './basicTypes'

const HtmlActivity: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props
  const [htmlData, setHtmlData] = useState<string>('')

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activity) return
    setHtmlData(activity.meeting_id || '<em>Contenido no <b>establecido</b></em>.')
  }, [activity?.meeting_id])

  useEffect(() => {
    if (!ref.current) return
    if (!htmlData.trim()) return
    if (htmlData !== ref.current.innerHTML) {
      console.debug('Update innerHTML')
      ref.current.innerHTML = htmlData
    }
  }, [ref.current, htmlData])

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activity} />
      <div ref={ref} style={{ width: '100%' }} />
    </>
  )
}

export default HtmlActivity
