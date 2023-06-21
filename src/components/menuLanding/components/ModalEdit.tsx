import { EditOutlined } from '@ant-design/icons';
import { Button, Modal, Drawer, Form, Input, Switch, Select, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { Menu, MenuLandingProps, PropsEditModal } from '../interfaces/menuLandingProps';
import { icon } from '@/helpers/constants';
import * as iconComponents from '@ant-design/icons';
export default function ModalEdit(props : PropsEditModal) {
  const [iconSelect, seticonSelect] = useState<any>(props.item.icons)
  const [form] = Form.useForm();

  useEffect(()=>{
      console.log();
      
  })
  const iconList = [
    { value: 'EditOutlined', label: 'Editar' },
    { value: 'DeleteOutlined', label: 'Eliminar' },
    { value: 'SearchOutlined', label: 'Buscar' },
  ];


  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    props.setVisibility(false);
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    //setIsModalVisible(false);
  };
  const renderIcon = (iconName: string) => {
    
    //@ts-ignore
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent /> : iconName;
  };
const IconList = (selected : any) => {
    let icons = Object.values(iconComponents);
    icons = icons.filter(item => typeof item === 'object')    
    // console.log(icons);
    
    return  icons
  };

  return (
    <div>
      <Drawer title={props.item.name} visible={props.visibility} width={500} onClose={handleCancel} footer={<Button type='primary'/>}>
        <Form form={form} onFinish={onFinish} layout='vertical'>
          <Form.Item label='Alias' name='label'>
            <Input size='middle' />
          </Form.Item>
          <Form.Item label='Habilitado' name='checked'>
            <Switch checkedChildren={'si'} unCheckedChildren={'No'} />
          </Form.Item>
        </Form>
        {/* {renderIcon(icons)} */}
        <Row style={{ overflow: 'auto', height: '400px', fontSize: 20}}>
        {IconList(iconSelect).map((Icon, index)=> (
          <Col span={2} key={`icon-key${index}`}>
            {/* @ts-ignore */}
            <div style={{ border :  Icon === iconComponents[props.item.icons]  ? '2px solid red' :`2px solid transparent`}}>
            {/* @ts-ignore */}
            <Icon/>
            </div>
          </Col>
        ))}
        </Row>
      </Drawer>
    </div>
  );
}
