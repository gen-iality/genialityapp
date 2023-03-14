import React, { useState, Fragment, createRef } from 'react';
import { Form, Input,  Button, Row, Transfer, DatePicker } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { PropsMeetingForm, TransferType, UsuariosArray } from '../interfaces/MeetingForm.interface';
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};



const filterOption=(inputValue:string, option:TransferType)=> {
  return option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
}


const mockData: TransferType[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));

const initialTargetKeys:string[] =[] ;


export default function MeetingForm({ cancel }: PropsMeetingForm) {
  const [form] = Form.useForm();
  const formRef = createRef<any>();
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
   console.log({sourceSelectedKeys,targetSelectedKeys})
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => {
  };


  return (
    <Fragment>
      <Form
        form={form}
        autoComplete='off'
        initialValues={() => {}}
        ref={() => {}}
        onFinish={(e) => {
          console.log(e);
        }}
        {...formLayout}>
        <Form.Item
          label={'Nombre'}
          name={'nombre'}
          rules={[{ required: true, message: 'Es necesario el nombre de la reunion' }]}>
          <Input ref={formRef} name={'nombre'} type='text' placeholder={'Ej: Acuerdo productos'} />
        </Form.Item>
        <Form.Item
          label={'Participantes'}
          name='participantes'
          rules={[{ required: true, message: 'Es necesario escoger al menos un participante' }]}>
          <Transfer
            filterOption={filterOption}
            showSearch
            dataSource={UsuariosArray}
            titles={['Disponibles', 'Asignados']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            onScroll={onScroll}
            render={item => item.title}
          />
          
        </Form.Item>
       
        <Form.Item
          label={'Fecha reunion'}
          name='fecha'
          rules={[{ required: true, message: 'Es necesario seleccionar una fecha' }]}>
            {/* @ts-ignore */} 
          <DatePicker inputReadOnly={true} style={{ width: '100%' }} allowClear={false} format={'DD/MM/YYYY'} />
        </Form.Item>
        <Form.Item
          label={'Lugar'}
          name='lugar'
          rules={[{ required: true, message: 'Es necesario seleccionar el lugar de la reunion' }]}>
          <Input ref={formRef} name={'lugar'} type='text' placeholder={'Ej: Salon principal'} />
        </Form.Item>

        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button type='primary' style={{ marginRight: 10 }} htmlType='submit'>
              Guardar
            </Button>
            <Button onClick={cancel} type='default' style={{ marginRight: 10 }}>
              Cancelar
            </Button>
          </Row>
      </Form>
    </Fragment>
  );
}