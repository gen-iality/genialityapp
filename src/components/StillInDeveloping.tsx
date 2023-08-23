import { Button, Result, Space } from 'antd'
import { FunctionComponent, PropsWithChildren, useState } from 'react'

interface IStillInDevelopingProps {
  disableTesting?: boolean
}

const StillInDeveloping: FunctionComponent<
  PropsWithChildren<IStillInDevelopingProps>
> = ({ children, disableTesting }) => {
  const [isShown, setIsShown] = useState(false)

  if (isShown && !disableTesting) return <>{children}</>

  return (
    <Result
      title="Sección en desarrollo"
      subTitle="Todavía esta sección está en desarrollo"
      status="500"
      extra={
        children && !disableTesting ? (
          <Space>
            <Button
              onClick={() => {
                setIsShown(true)
              }}
            >
              Probar de todas formas
            </Button>
          </Space>
        ) : undefined
      }
    />
  )
}

export default StillInDeveloping
