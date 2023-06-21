import { Button, Drawer, Form, Input, Switch, Row, Col, Typography, Space } from 'antd';
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
        onClose={handleCancel}>
        <Space direction='vertical' style={{ width: '100%', marginBottom: 10 }}>
          <Typography.Title level={5}>Alias</Typography.Title>
          <Input
            size='middle'
            placeholder='Escriba un alias para la seccion'
            value={item.label}
            onChange={(e) => setItemEdit({ ...item, label: e.target.value })}
          />

          <Typography.Title level={5}>Habilitado</Typography.Title>
          <Switch
            checkedChildren={'si'}
            unCheckedChildren={'No'}
            checked={item.checked}
            onChange={(value) => setItemEdit({ ...item, checked: value })}
          />
        </Space>
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
      </Drawer>
    </div>
  );
}
