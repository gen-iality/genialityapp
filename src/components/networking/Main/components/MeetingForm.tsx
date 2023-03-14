import React, { useState, Fragment, createRef, useEffect } from 'react';
import { Form, Input,  Button, Row, Transfer, DatePicker, TimePicker } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { FormMeeting, PropsMeetingForm, TransferType, UsuariosArray } from '../interfaces/MeetingForm.interface';
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const filterOption=(inputValue:string, option:TransferType)=> {
  return option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
}



const initialTargetKeys:string[] =[] ;


export default function MeetingForm({ cancel, reunion_info}: PropsMeetingForm) {
  const formRef = createRef<any>();
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [dataTransfer, setDataTransfer] = useState<TransferType[]>([])
  const [form, setForm] = useState<FormMeeting>({
    id:reunion_info?.id,
    date:reunion_info?.date,
    // time:reunion_info?.time,
    place:reunion_info?.place,
    name:reunion_info?.name
  })


  useEffect(() => {
    const participants: TransferType[] = reunion_info?.participants.map((item) => ({
      key: item.id,
      title: item.name
    })) ??[];
    setDataTransfer(participants)
  }, [])
  
  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => {
  };


  return (
    <Fragment>
      <Form
        autoComplete='off'
        initialValues={() => {}}
        ref={() => {}}
        onFinish={(e) => {
          console.log(e)
          // setForm()
        }}
        {...formLayout}>
          <Form.Item hidden initialValue={reunion_info} name={'id'}>
            <Input name='id' type='text' />
          </Form.Item>
        <Form.Item
          label={'Nombre'}
          name={'name'}
          rules={[{ required: true, message: 'Es necesario el nombre de la reunion' }]}>
          <Input ref={formRef} name={'name'} type='text' placeholder={'Ej: Acuerdo productos'} />
        </Form.Item>
        <Form.Item
          label={'Participantes'}
          name='participants'
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
          <DatePicker showTime inputReadOnly={true} style={{ width: '100%' }} allowClear={false} format={'DD/MM/YYYY HH:mm:ss'} />
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