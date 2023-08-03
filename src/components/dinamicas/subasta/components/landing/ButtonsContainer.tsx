import { CommentOutlined, FileProtectOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import React from 'react'
import { ButtonsContainerProps } from '../../interfaces/auction.interface'

export default function ButtonsContainer({
    validate,
    onClick,
	setshowDrawerChat = () => {},
	setshowDrawerRules = () => {},
	closedrawer,
}: ButtonsContainerProps) {
  return (
    <Card bordered={false} style={{ height: '100%', backgroundColor: 'transparent' }}>
    <Row gutter={[16, 16]}>
        <Col span={24}>
            <Row justify='center'>
                <Button
                    className={'animate__animated animate__heartBeat'}
                    shape='circle'
                    onClick={onClick}
                    style={{
                        width: '150px',
                        height: '150px',
                        border: `10px solid #CECECE`,
                        boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                    
                    disabled={validate}
                    type='default'>
                    <Space direction='vertical'>
                        <Typography.Text strong={true}>¡PUJAR!</Typography.Text>
                    </Space>
                </Button>
            </Row>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                onClick={() => setshowDrawerRules(true)}
                icon={<FileProtectOutlined />}
                size='large'
                block>
                Reglas
            </Button>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                onClick={() => setshowDrawerChat(true)}
                icon={<CommentOutlined />}
                size='large'
                block>
                Chat
            </Button>
        </Col>
        <Col span={24}>
            <Button
                style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
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
