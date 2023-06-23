import { Button, Drawer, Form, Input, Switch, Row, Col, Typography, Space, Tooltip, Card } from 'antd';
import { PropsEditModal } from '../interfaces/menuLandingProps';
import * as iconComponents from '@ant-design/icons';
import '../styles/index.css';

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
        headerStyle={{ border: 'none' }}
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
                  <Typography.Text type='secondary'>
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
                <Card style={{borderRadius: 10}} bodyStyle={{padding: 0}}>
                  <Row gutter={[8, 8]} style={{height: 300, backgroundColor: 'red', overflowY: 'scroll'}}>
                    {IconList.map((Icon, index) => (
                      <Col span={4} key={`icon-key${index}`}>
                        <Card hoverable style={{border: 'none'}} onClick={() => changeIcon(index)}>
                          {<Icon />}
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
                

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
