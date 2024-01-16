import { Button, Drawer, Form, Input, Switch, Row, Col, Typography, Space, Tooltip, Card, Tag } from 'antd';
import * as iconComponents from '@ant-design/icons';
import '../styles/index.css';
import { MenuItem } from '../interfaces/menuLandingProps';
import { renderIcon } from '../utils';
import { MenuForm } from '../interfaces/menuForm.types';
import { useEffect, useMemo } from 'react';
import { useForm } from '@/hooks/useForm';
import { getIconKeys, iconKeyToComponent } from '@/Utilities/iconsAntDesing';

interface PropsEditModal {
  menuItem: MenuItem;
  closeDrawer: () => void;
  isOpenDrawer: boolean;
  editMenu: (menuItem: MenuItem) => void;
}

const initialFormValue: MenuForm = {
  checked: true,
  icon: '',
  label: '',
};

export default function EditMenuItem({ menuItem, closeDrawer, isOpenDrawer, editMenu }: PropsEditModal) {
  const { checked, icon, label, handledChange, setFieldsValue } = useForm(initialFormValue);

  const IconsKeys = useMemo(() => {
    return getIconKeys({ outlined: true });
  }, []);

  const IconList = useMemo(() => {
    //@ts-ignore
    return iconKeyToComponent(IconsKeys);
  }, [IconsKeys]);

  const getIcon = (index: number) => {
    return IconsKeys[index];
  };

  useEffect(() => {
    setFieldsValue({
      checked: menuItem.checked,
      icon: menuItem.icon,
      label: menuItem.label,
    });
  }, [menuItem]);

  return (
    <Drawer
      title={
        <Space wrap align='center'>
          <Typography.Text strong>{menuItem.name}</Typography.Text>
        </Space>
      }
      bodyStyle={{ padding: 15 }}
      headerStyle={{ border: 'none', padding: 15 }}
      footerStyle={{ border: 'none' }}
      visible={isOpenDrawer}
      width={450}
      closable={false}
      footer={
        <Row justify='end'>
          <Button
            type='primary'
            onClick={() => {
              editMenu({ ...menuItem, label, icon, checked });
              closeDrawer();
            }}
            key={'saveBtn'}
            icon={<iconComponents.SaveOutlined />}>
            Guardar
          </Button>
        </Row>
      }
      extra={
        <Tooltip placement='topLeft' title='Cerrar'>
          <Button icon={<iconComponents.CloseOutlined style={{ fontSize: 25 }} />} onClick={closeDrawer} type='text' />
        </Tooltip>
      }
      onClose={closeDrawer}>
      <Form layout='vertical'>
        <Space direction='vertical'>
          <Form.Item
            label={'Alias'}
            help={
              <Typography.Text type='secondary' style={{ fontSize: 12 }}>
                Aquí puedes cambiar el nombre que se visualizará en el menú la landing.
              </Typography.Text>
            }>
            <Input
              size='middle'
              placeholder={menuItem.name}
              max={15}
              min={4}
              value={label}
              onChange={(e) => handledChange({ name: 'label', value: e.target.value })}
            />
          </Form.Item>
          <Form.Item label={'Iconos'}>
            <Space direction='vertical'>
              <Tag color='default' style={{ padding: 5 /* , borderColor: '#2593FC50' */ }}>
                <Space wrap align='center'>
                  {renderIcon(icon, 25, 'animate__animated animate__heartBeat')} Icono seleccionado
                </Space>
              </Tag>

              <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 0 }}>
                <Row gutter={[8, 8]} style={{ height: 280, overflowY: 'scroll' }} className='desplazar'>
                  {IconList.map((Icon, index) => (
                    <Col span={4} key={`icon-key${index}`}>
                      <Card
                        hoverable
                        style={{
                          border: `2px solid ${getIcon(index) === menuItem.icon ? '#2593FC50' : 'transparent'}`,
                          borderRadius: 10,
                        }}
                        bodyStyle={{ padding: 15 }}
                        onClick={() => handledChange({ name: 'icon', value: getIcon(index) })}>
                        <Row justify='center' align='middle'>
                          {<Icon style={{ fontSize: 30 }} />}
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Space>
          </Form.Item>
          <Form.Item label={'Habilitado'}>
            <Switch
              checkedChildren={'Sí'}
              unCheckedChildren={'No'}
              checked={checked}
              onChange={(value) => handledChange({ name: 'checked', value })}
            />
          </Form.Item>
        </Space>
      </Form>
    </Drawer>
  );
}
