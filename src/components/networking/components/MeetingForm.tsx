import React, { useState, Fragment, createRef, useEffect, useContext } from 'react';
import { Form, Input, Button, Row, Transfer, DatePicker, TimePicker } from 'antd';
import { NetworkingContext } from '../context/NetworkingContext';
import { IMeeting, IParticipants, typeAttendace, FormMeeting, TransferType } from '../interfaces/Meetings.interfaces';

import { filterOption, formLayout } from '../utils/utils';
import moment from 'moment';
import { useForm } from '@/hooks/useForm';

export default function MeetingForm() {
  const { attendees, meentingSelect, edicion, closeModal, createMeeting, updateMeeting } = useContext(
    NetworkingContext
  );

  const formRef = createRef<any>();

  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [dataTransfer, setDataTransfer] = useState<TransferType[]>([]);
  const { formState, onInputChange, onResetForm } = useForm<IMeeting>(meentingSelect);

  useEffect(() => {
    if (edicion) {
      setTargetKeys(meentingSelect.participants.map((item: any) => item.id));
    }

    //Tranformar todos los asistentes al evento para el transfer
    setDataTransfer(
      attendees.map((asistente: any) => ({
        id: asistente.user._id,
        name: asistente.user.names,
        key: asistente.user._id,
        email: asistente.user.email,
        attendance: typeAttendace.unconfirmed,
      }))
    );
  }, []);

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onSubmit = (datos: FormMeeting) => {
    try {
      //Buscar los datos de los asistentes
      const participants: IParticipants[] = dataTransfer.filter((item: any) => targetKeys.includes(item.key));

      //objeto de creacion
      const meeting: Omit<IMeeting, 'id'> = {
        name: datos.name,
        date: datos.date.toString(),
        participants: participants,
        place: datos.place,
        horas: [datos.horas[0].format('HH:mm').toString(), datos.horas[1].format('HH:mm').toString()],
      };

      if (edicion && datos.id) {
        updateMeeting(datos.id, { ...meeting, id: datos.id });
        return closeModal();
      }
      createMeeting(meeting);
      closeModal();
    } catch (error) {
      console.log(`Ocurrio un problema al ${edicion ? 'editar' : 'guardar'} la reunion`);
    }
  };

  return (
    <Fragment>
      <Form {...formLayout} autoComplete='off' ref={() => {}} onFinish={onSubmit}>
        <Form.Item hidden name={'id'} initialValue={edicion ? formState.id : ''}>
          <Input name='id' type='text' />
        </Form.Item>

        <Form.Item
          label={'Nombre'}
          name={'name'}
          initialValue={edicion ? formState.name : ''}
          rules={[{ required: true, message: 'Es necesario el nombre de la reunion' }]}>
          <Input ref={formRef} name={'name'} type='text' placeholder={'Ej: Acuerdo productos'} />
        </Form.Item>

        <Form.Item
          label={'Participantes'}
          name='participants'
          rules={[
            {
              validator: (_, value) => {
                if (!value && targetKeys.length === 0) {
                  return Promise.reject(new Error('Es necesario escoger al menos un participante'));
                }
                return Promise.resolve();
              },
            },
          ]}>
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
            render={(item) => item.name}
          />
        </Form.Item>

        <Form.Item
          label={'Fecha reunion'}
          name='date'
          rules={[{ required: true, message: 'Es necesario seleccionar una fecha' }]}
          initialValue={edicion ? moment(formState.date) : ''}>
          {/* @ts-ignore */}
          <DatePicker inputReadOnly={true} style={{ width: '100%' }} allowClear={false} format={'YYYY-MM-DD'} />
        </Form.Item>

        <Form.Item
          label={'Rango de horas'}
          name='horas'
          rules={[{ required: true, message: 'Es necesario seleccionar el rango de horas' }]}
          initialValue={[edicion ? moment(formState.horas[0]) : '', edicion ? moment(formState.horas[1]) : '']}>
          {/* @ts-ignore */}
          <TimePicker.RangePicker
            use12Hours
            placeholder={['Hora inicio', 'Hora fin']}
            format={'hh:mm a'}
            inputReadOnly={true}
            style={{ width: '100%' }}
            allowClear={false}
          />
        </Form.Item>

        <Form.Item
          label={'Lugar'}
          name='place'
          rules={[{ required: true, message: 'Es necesario seleccionar el lugar de la reunion' }]}
          initialValue={edicion ? formState.place : ''}>
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
