import { Button, Drawer, Form, Input, Switch, Row, Col, Typography, Space, Tooltip } from 'antd';
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
  const renderIcon = (iconName: string) => {
    //@ts-ignore
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent /> : iconName;
  };
  return (
    <div>
      <Drawer
        title={<Typography.Text strong>{item.name}</Typography.Text>}
        visible={visibility}
        width={600}
        footer={
          <Button loading={loading} type='primary' onClick={handleOk} key={'saveBtn'}>
            Guardar
          </Button>
        }
        extra={
          <Space direction='horizontal' style={{ display: 'flex', alignItems: 'start' }}>
            <Typography.Title level={5}>Habilitado:</Typography.Title>
            <Switch
              checkedChildren={'si'}
              unCheckedChildren={'No'}
              checked={item.checked}
              onChange={(value) => setItemEdit({ ...item, checked: value })}
            />
          </Space>
        }
        onClose={handleCancel}>
        <Space direction='vertical' style={{ width: '100%', marginBottom: 10 }}>
          <Typography.Title level={5}>Alias</Typography.Title>
          <Tooltip
            title='Aquí puedes cambiar el nombre que se visualizará en la landing menu del evento'
            overlayStyle={{ color: 'white', fontSize: '12px' }}>
            <Input
              size='middle'
              placeholder={item.name}
              value={item.label}
              max={15}
              min={4}
              onChange={(e) => setItemEdit({ ...item, label: e.target.value })}
            />
          </Tooltip>
        </Space>
        <Typography.Title level={5}>Iconos</Typography.Title>
        <div className='iconsContainer'>
          <div key={item.icon} className='iconCurrent animate__animated animate__bounceIn'>
            {renderIcon(item.icon)}
          </div>
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
        </div>
      </Drawer>
    </div>
  );
}
