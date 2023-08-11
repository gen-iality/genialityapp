import { CommentOutlined, FileProtectOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import React from 'react'
import { ButtonsContainerProps } from '../../interfaces/auction.interface'
import { getCorrectColor } from '@/helpers/utils'

export default function ButtonsContainer({
    validate,
    onClick,
	setshowDrawerChat = () => {},
	setshowDrawerRules = () => {},
	closedrawer,
    styles={
        backgroundColor: '#FFFFFF'
    },
}: ButtonsContainerProps) {
 const btnPujar = {
    width: '150px',
    height: '150px',
    border: `10px solid #CECECE`,
    boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)',
}

  return (
    <Card bordered={false} style={{ height: '100%', backgroundColor: 'transparent' }}>
    <Row gutter={[16, 16]}>
        <Col span={24}>
            <Row justify='center'>
                <Button
                    className={'animate__animated animate__heartBeat'}
                    shape='circle'
                    onClick={onClick}
                    style={validate ? {...btnPujar} : {...btnPujar,...styles}}
                    
                    disabled={validate}
                    type='default'>
                    <Space direction='vertical'>
                        <Typography.Text strong={true} style={{ color : getCorrectColor(styles.backgroundColor)}}>¡PUJAR!</Typography.Text>
                    </Space>
                </Button>
            </Row>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)', border: 'none' ,color: getCorrectColor(styles.backgroundColor), backgroundColor: styles.backgroundColor}}
                onClick={() => setshowDrawerRules(true)}
                icon={<FileProtectOutlined />}
                size='large'
                block>
                Reglas
            </Button>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)', border: 'none' ,color: getCorrectColor(styles.backgroundColor),backgroundColor: styles.backgroundColor}}
                onClick={() => setshowDrawerChat(true)}
                icon={<CommentOutlined />}
                size='large'
                block>
                Chat
            </Button>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)', border: 'none' , color: getCorrectColor(styles.backgroundColor),backgroundColor: styles.backgroundColor }}
                onClick={() => closedrawer()}
                size='large'
                block>
                Cerrar
            </Button>
        </Col>
    </Row>
</Card>
  )
}
