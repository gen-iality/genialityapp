import React, { useState, Fragment, createRef, useEffect, useContext } from 'react';
import { Form, Input,  Button, Row, Transfer, DatePicker } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { NetworkingContext } from '../context/NetworkingContext';
import { IMeeting, IParticipants, typeAttendace,FormMeeting,TransferType } from '../interfaces/meetings.interfaces';

import { filterOption, formLayout } from '../utils/utils';
import moment from 'moment';
import { useForm } from '@/hooks/useForm';


export default function MeetingForm() {

  const { 
    attendees, 
    meentingSelect, 
    edicion, 
    closeModal,
    createMeeting,updateMeeting} = useContext(NetworkingContext);

    const formRef = createRef<any>();

    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [dataTransfer, setDataTransfer] = useState<TransferType[]>([])
    const {formState,onInputChange,onResetForm} = useForm<IMeeting>(meentingSelect)

  useEffect(() => {
     if(edicion && meentingSelect?.participants) {
      setTargetKeys(meentingSelect?.participants.map((item:any)=>item.id))
     }

    setDataTransfer(attendees.map((asistente:any) =>(
      {
        id:asistente.user._id,
        name:asistente.user.names,
        key:asistente.user._id,
        email:asistente.user.email,
        attendance:typeAttendace.unconfirmed
      })))
  }, [])
  
  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onSubmit =(datos:FormMeeting)=>{
    const participants:IParticipants[] = dataTransfer.filter((item:any) =>datos.participants.includes(item.key))
    const meeting:Omit<IMeeting,'id'>={
        name:datos.name,
        date:datos.date.toString(),
        participants:participants,
        place:datos.place
    }
   try {
    if(edicion && datos.id){
      updateMeeting(attendees.event_id,datos.id,{...meeting,id:datos.id})
      return closeModal() 
    }
    createMeeting(meeting)
    closeModal()
   } catch (error) {
    console.log("Ocurrio un al guardar la reunion")
   }
    
  }
  const onEdit =(datos:FormMeeting)=>{
    
  }
  return (
    <Fragment>
      <Form
        {...formLayout}
        autoComplete='off'
        ref={() => {}}
        onFinish={onSubmit}
        // initialValues={formState}
        >
          <Form.Item hidden name={'id'} initialValue={edicion?formState.id:''}>
            <Input name='id' type='text' />
          </Form.Item>
        <Form.Item
          label={'Nombre'}
          name={'name'}
          initialValue={edicion?formState.name:''}
          rules={[{ required: true, message: 'Es necesario el nombre de la reunion' }]}>
          <Input ref={formRef} name={'name'} type='text' placeholder={'Ej: Acuerdo productos'} />
        </Form.Item>
        <Form.Item
          label={'Participantes'}
          name='participants'
          rules={[{ required: true, message: 'Es necesario escoger al menos un participante' }]}>
          <Transfer
            style={{ width: '100%' }}
            filterOption={filterOption}
            showSearch
            dataSource={dataTransfer}
            titles={['Disponibles', 'Asignados']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            render={item => item.name}
          />
          
        </Form.Item>
       
        <Form.Item
          label={'Fecha reunion'}
          name='date'
          rules={[{ required: true, message: 'Es necesario seleccionar una fecha' }]}
          initialValue={edicion?moment(formState.date):''}
          >
            {/* @ts-ignore */} 
          <DatePicker  showTime inputReadOnly={true} style={{ width: '100%' }} allowClear={false} format={'YYYY-MM-DD HH:mm'} />
        </Form.Item>
        <Form.Item
          label={'Lugar'}
          name='place'
          rules={[{ required: true, message: 'Es necesario seleccionar el lugar de la reunion' }]}
          initialValue={edicion?formState.place:''}
          >
          <Input ref={formRef} name={'place'} type='text' placeholder={'Ej: Salon principal'} />
        </Form.Item>

        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button type='primary' style={{ marginRight: 10 }} htmlType='submit'>
              Guardar
            </Button>
            <Button onClick={closeModal} type='default' style={{ marginRight: 10 }}>
              Cancelar
            </Button>
          </Row>
      </Form>
    </Fragment>
  );
}