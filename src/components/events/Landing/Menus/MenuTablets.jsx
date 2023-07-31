import { useState } from 'react'
import { Button, Drawer, Row, Image } from 'antd'
import { EyeOutlined, MenuOutlined } from '@ant-design/icons'
import { drawerButton } from '../helpers/csshelpers'
import { useEventContext } from '@context/eventContext'
import MenuEvent from './MenuEvent'
const MenuTablets = () => {
  const [isOpen, setIsOpen] = useState(false)
  const cEvent = useEventContext()

  return (
    <>
      <div className="hiddenMenuMobile_Landing">
        <Button onClick={() => setIsOpen(!isOpen)} block style={drawerButton}>
          <MenuOutlined style={{ fontSize: '15px' }} />
          <div>Menu</div>
        </Button>
      </div>

      <Drawer
        width="60%"
        zIndex={1000}
        title={cEvent.value.name}
        placement="left"
        closable={false}
        onClose={() => setIsOpen(!isOpen)}
        open={isOpen}
        maskClosable
        bodyStyle={{
          padding: '0px',
          backgroundColor:
            cEvent.value.styles && cEvent.value.styles.toolbarDefaultBg
              ? cEvent.value.styles.toolbarDefaultBg
              : 'white',
        }}
      >
        <Row justify="center">
          {cEvent.value.styles && cEvent.value.styles.event_image && (
            <Image
              preview={{ mask: <EyeOutlined /> }}
              alt="Logo"
              src={cEvent.value.styles.event_image}
              style={{
                backgroundColor: cEvent.value.styles.toolbarDefaultBg,
                objectFit: 'cover',
              }}
            />
          )}
        </Row>

        <MenuEvent isMobile />
      </Drawer>
    </>
  )
}

export default MenuTablets
