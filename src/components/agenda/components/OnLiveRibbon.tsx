import { FunctionComponent, useEffect, useState } from 'react'
import { Badge, Space } from 'antd'
import AccessPointIcon from '@2fd/ant-design-icons/lib/AccessPoint'

interface IOnLiveRibbonProps {
  /**
   * You can pass a value of true or false
   */
  isOnLive?: boolean
  /**
   * You can pass a function that return a value or a promise of value
   */
  requestLiving?: () => Promise<boolean> | boolean
}

const OnLiveRibbon: FunctionComponent<IOnLiveRibbonProps> = (props) => {
  const { children, isOnLive, requestLiving } = props

  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (typeof requestLiving === 'function') {
      const result = requestLiving()
      if (result instanceof Promise) {
        // This is a promise, then we await it
        result
          .then((flag) => setIsLive(flag))
          .catch((err) => {
            console.error(err)
            setIsLive(false)
          })
      } else {
        setIsLive(result)
      }
    } else {
      setIsLive(!!isOnLive)
    }
  }, [isOnLive, requestLiving])

  return (
    <Badge.Ribbon
      className="animate__animated animate__bounceIn animate__delay-2s"
      placement="end"
      style={{ height: 'auto', padding: '3px', top: -5, lineHeight: '10px' }}
      color={isLive ? 'red' : 'transparent'}
      text={
        isLive ? (
          <Space direction="horizontal" style={{ padding: 0 }}>
            <AccessPointIcon
              className="animate__animated animate__heartBeat animate__infinite animate__slower"
              style={{ fontSize: '12px' }}
            />
            <span style={{ textAlign: 'center', fontSize: '12px' }}>
              {/* {<FormattedMessage id="live" defaultMessage="En vivo" />} */}
              En Vivo
            </span>
          </Space>
        ) : (
          ''
        )
      }
    >
      {children}
    </Badge.Ribbon>
  )
}

export default OnLiveRibbon
