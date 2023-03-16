import React, { Fragment } from 'react';
import { Form, Input, Button, Row, Transfer, DatePicker, TimePicker } from 'antd';
import { filterOption, formLayout } from '../utils/utils';
import moment from 'moment';
import { useMeetingFormLogic } from '../hooks/useMeetingFormLogic';

export default function MeetingForm() {
  const {
    onSubmit,
    edicion,
    formState,
    formRef,
    AttendeesKeyTarget,
    attendeesTransfer,
    selectedAttendesKeys,
    onChange,
    onSelectChange,
    closeModal
  } = useMeetingFormLogic();

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
                if (AttendeesKeyTarget.length === 0) {
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
            dataSource={attendeesTransfer}
            titles={['Disponibles', 'Asignados']}
            targetKeys={AttendeesKeyTarget}
            selectedKeys={selectedAttendesKeys}
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
