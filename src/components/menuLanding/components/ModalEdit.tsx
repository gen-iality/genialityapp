import { Button, Drawer, Form, Input, Switch, Row, Col, Typography, Space, Tooltip, Card, Tag } from 'antd';
import { PropsEditModal } from '../interfaces/menuLandingProps';
import * as iconComponents from '@ant-design/icons';
import '../styles/index.css';
import { fontSize } from '@/components/badge/constants';

export default function ModalEdit({ item, handleCancel, handleOk, visibility, setItemEdit, loading }: PropsEditModal) {
  const IconsKeys = Object.keys(iconComponents).filter((key) => key.includes('Outlined'));
  //@ts-ignore
  const IconList = IconsKeys.map((key) => iconComponents[key]);

  const changeIcon = (index: number) => {
    const icon = IconsKeys[index];
    if (icon) setItemEdit({ ...item, icon: icon });
  };

  const renderIcon = (iconName: string, size?: number) => {
    //@ts-ignore
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent style={size ? {fontSize: size} : {}} /> : iconName;
  };

  return (
    <div>
      <Drawer
        title={
          <Space wrap align='center'>
            {renderIcon(item.icon, 20)}
            <Typography.Text strong>{item.name}</Typography.Text>
          </Space>
        }
        bodyStyle={{ padding: 10}}
        headerStyle={{ border: 'none', padding: 10 }}
        footerStyle={{ border: 'none' }}
        visible={visibility}
        width={450}
        closable={false}
        footer={
          <Row justify='end'>
            <Button loading={loading} type='primary' onClick={handleOk} key={'saveBtn'} icon={<iconComponents.SaveOutlined />}>
              Guardar
            </Button>
          </Row>
        }
        extra={
          <Tooltip placement='topLeft' title='Cerrar'>
            <Button icon={<iconComponents.CloseOutlined style={{ fontSize: 25 }} />} onClick={handleCancel} type='text' />
          </Tooltip>
        }
        onClose={handleCancel}>
          <Form layout='vertical'>
            <Space direction='vertical'>
              <Form.Item label={'Alias'} 
                help={
                  <Typography.Text type='secondary' style={{fontSize: 12}}>
                    Aquí puedes cambiar el nombre que se visualizará en la landing menú del evento
                  </Typography.Text>}
                >
                <Input
                  size='middle'
                  placeholder={item.name}
                  value={item.label}
                  max={15}
                  min={4}
                  onChange={(e) => setItemEdit({ ...item, label: e.target.value })}
                />
              </Form.Item>
                <Form.Item label={'Iconos'}>
                  <Space direction='vertical'>
                    {/* <Card 
                      style={{borderRadius: 10}} 
                      bodyStyle={{padding: 10}}
                      title={renderIcon(item.icon, 20)} 
                      extra={<Typography.Text type='secondary'>Éste es el icono seleccionado</Typography.Text>}
                    >
                    </Card> */}
                    <Tag color='default' style={{padding: 5}}><Space wrap align='center'>{renderIcon(item.icon, 25)} Éste es el icono seleccionado</Space></Tag>
                    
                    <Card style={{borderRadius: 10}} bodyStyle={{padding: 0}}>
                      <Row gutter={[8, 8]} style={{height: 300, overflowY: 'scroll'}} className='desplazar'>
                        {IconList.map((Icon, index) => (
                          <Col span={4} key={`icon-key${index}`}>
                            <Card hoverable style={{border: `2px solid ${IconsKeys[index] === item.icon ? 'black' : 'transparent'}`, borderRadius: 10}} bodyStyle={{padding: 15}} onClick={() => changeIcon(index)}>
                              <Row justify='center' align='middle'>
                                {<Icon style={{fontSize: 30}} />}
                              </Row>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Space>
                
                
                {/* <div className='iconsContainer'>
                  <Row className='rowIcons'>
                    {IconList.map((Icon, index) => (
                      <Col style={{ margin: 6 }} key={`icon-key${index}`}>
                        <div
                          className={`icons ${
                            IconsKeys[index] === item.icon ? 'animate__animated animate__heartBeat animate__infinite' : ''
                          }`}
                          style={{
                            border: `4px solid ${IconsKeys[index] === item.icon ? 'black' : 'transparent'}`,
                          }}
                          onClick={() => changeIcon(index)}>
                          {<Icon />}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div> */}
              </Form.Item>
              <Form.Item label={'Habilitado'}>
                <Switch
                  checkedChildren={'Sí'}
                  unCheckedChildren={'No'}
                  checked={item.checked}
                  onChange={(value) => setItemEdit({ ...item, checked: value })}
                />
              </Form.Item>
            </Space>
          </Form>
        
      </Drawer>
    </div>
  );
}
