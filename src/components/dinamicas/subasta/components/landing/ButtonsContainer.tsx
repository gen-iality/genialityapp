import { CloseOutlined, CommentOutlined, FileProtectOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Statistic, Typography, Grid } from 'antd'
import React, { useState } from 'react'
import { ButtonsContainerProps } from '../../interfaces/auction.interface'
import { getCorrectColor } from '@/helpers/utils'
import Cash100Icon from '@2fd/ant-design-icons/lib/Cash100'
import { FaGavel } from 'react-icons/fa'

const { Countdown } = Statistic;
const { useBreakpoint } = Grid;

export default function ButtonsContainer({
    validate,
    onClick,
	setshowDrawerChat = () => {},
	setshowDrawerRules = () => {},
	closedrawer,
    styles={
        backgroundColor: '#FFFFFF'
    },
    timer = 10,
}: ButtonsContainerProps) {
    const screens = useBreakpoint();
    const btnPujar = {
        width: '150px',
        height: '150px',
        border: `10px solid #CECECE`,
        boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)',
    }

    return (
    <>
        {screens.xs ? 
            <Row justify={'space-around'} gutter={[16, 16]} align='middle'>
                <Col>
                    <Button
                        style={{ 
                            border: 'none', 
                        }}
                        onClick={() => closedrawer()}
                        size='large'
                        type='ghost'
                        icon={<CloseOutlined style={{fontSize: '28px', color : getCorrectColor(styles.backgroundColor)}}/>}>
                    </Button>
                </Col>
                <Col>
                    <Button
                        style={{ 
                            border: 'none',
                        }}
                        onClick={() => setshowDrawerRules(true)}
                        icon={<FileProtectOutlined style={{fontSize: '28px', color : getCorrectColor(styles.backgroundColor)}}/>}
                        size='large'
                        type='ghost'
                        >
                    </Button>
                </Col>
                <Col>
                    <Button
                        style={{ 
                            border: 'none',
                        }}
                        onClick={() => setshowDrawerChat(true)}
                        icon={<CommentOutlined style={{fontSize: '28px', color : getCorrectColor(styles.backgroundColor)}}/>}
                        size='large'
                        type='ghost'
                        >
                    </Button>
                </Col>
                <Col>
                    {!validate ? 
                        <Button 
                            onClick={onClick}
                            style={{ 
                                border: 'none',
                            }}
                            type='ghost'
                            size='large'
                            icon={<FaGavel className={'animate__animated animate__heartBeat'} style={{fontSize: '32px', transform: 'rotate(270deg)', color : getCorrectColor(styles.backgroundColor)}} />}
                        />
                        :
                        <Countdown value={timer} valueStyle={{color : getCorrectColor(styles.backgroundColor)}}  format="s" />
                    }
                </Col>
            </Row>
            :
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
                                { !validate ? <Typography.Text strong style={{ color : getCorrectColor(styles.backgroundColor)}}>¡PUJAR!</Typography.Text>
                                : (<Countdown value={timer}  format="s" /> )
                                }
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
                            icon={<CloseOutlined />}
                            block>
                            Cerrar
                        </Button>
                    </Col>
                </Row>
            </Card>
        }
    </>
  )
}
