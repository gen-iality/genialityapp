import React, { Fragment , useContext } from 'react';
import { Form, Input, Button, Row, Transfer, DatePicker, Select } from 'antd';
import { filterOption, formLayout } from '../utils/utils';
import moment from 'moment';
import { useMeetingFormLogic } from '../hooks/useMeetingFormLogic';
import { NetworkingContext } from '../context/NetworkingContext';
import locale from 'antd/es/date-picker/locale/es_ES';

const { RangePicker } = DatePicker;

export default function MeetingForm() {
  const {
    onSubmit,
    formState,
    formRef,
    AttendeesKeyTarget,
    attendeesTransfer,
    selectedAttendesKeys,
    onChange,
    onSelectChange,
    closeModal,
  } = useMeetingFormLogic();

  const {typeMeetings} = useContext(NetworkingContext);

  return (
    <Fragment>
      <Form {...formLayout} autoComplete='off' ref={() => {}} onFinish={onSubmit}>
        <Form.Item hidden name={'id'} initialValue={formState.id}>
          <Input name='id' type='text' />
        </Form.Item>
        <Form.Item
          label={'Nombre'}
          name={'name'}
          initialValue={formState.name}
          rules={[{ required: true, message: 'Es necesario el nombre de la reunión' }]}>
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
          ]}
        >
          <Transfer
            /* style={{ width: '100%' }} */
            listStyle={{width: 500}}
            filterOption={filterOption}
            showSearch
            dataSource={attendeesTransfer}
            locale={{ 
              itemUnit: 'Participante', itemsUnit: 'Participantes', notFoundContent: 'La lista está vacía', searchPlaceholder: 'Buscar persona'
            }}
            titles={['Disponibles', 'Asignados']}
            targetKeys={AttendeesKeyTarget}
            selectedKeys={selectedAttendesKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            render={(item) => item.name}
            oneWay={true}
            showSelectAll={false}
          />
        </Form.Item>
        <Form.Item
          label={'Fecha de la reunión'}
          name='date'
          rules={[{ required: true, message: 'Es necesario seleccionar una fecha' }]}
          initialValue={
            formState.start !== '' && formState.end !== '' ? [moment(formState.start), moment(formState.end)] : []
          }>
          {/* @ts-ignore */}
          <RangePicker showTime={{ format: 'HH:mm A' }} format='YYYY-MM-DD HH:mm' style={{width: '100%'}} locale={locale} />
        </Form.Item>
        <Form.Item
          label={'Lugar'}
          name='place'
          rules={[{ required: true, message: 'Es necesario seleccionar el lugar de la reunión' }]}
          initialValue={formState.place}>
          <Input ref={formRef} name={'place'} type='text' placeholder={'Ej: Salón principal'} />
        </Form.Item>
        <Form.Item label={'Tipo'} name='type' initialValue={formState.type?.nameType}>
          <Select
            defaultValue=''
            onChange={() => {}}
            options={typeMeetings.map((item)=> ({label: item.nameType, value: item.id}))}
          />
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
