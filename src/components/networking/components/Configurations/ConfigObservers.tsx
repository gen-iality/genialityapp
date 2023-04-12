import { DeleteOutlined, InfoCircleOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Divider, Form, List, Modal, Row, Select, Typography , Space, Alert, Tooltip } from 'antd';
import React, { useState , useContext } from 'react';
import { NetworkingContext } from '../../context/NetworkingContext';
import { CreateObservers } from '../../interfaces/configurations.interfaces';


export default function ConfigObservers() {
  const [modalConfig, setModalConfig] = useState(false);
  const { attendeesList , createObserver ,deleteObserver, observers} = useContext(NetworkingContext)

  const closeModal = () => {
    setModalConfig(false);
  };
  const onCreate = (data : CreateObservers) =>{
    setModalConfig(false)
    createObserver(data)
  }

  return (
    <>
      { modalConfig &&
        <Modal
          visible={modalConfig}
          title={'Agregar observador'}
          footer={false}
          onCancel={closeModal}
          okText={'Guardar'}>
          <>
            <Form onFinish={onCreate}>
              <Form.Item 
                name={'data'} 
                rules={[{required : true , message: 'Debe seleccionar un participante'}]} 
                initialValue={[]}
                help={
                  <Typography.Text type='secondary'>
                    <InfoCircleOutlined /> Puede seleccionar más de un observador
                  </Typography.Text>
                }
              >
                <Select allowClear mode='multiple' options={attendeesList()} defaultValue={[]} placeholder='Seleccione un observador' style={{paddingBottom: '5px'}} showArrow={true}/>
              </Form.Item>
              <Row justify='end'>
                <Button type='primary' icon={<SaveOutlined />} htmlType='submit'>
                  Guardar
                </Button> 
              </Row>
            </Form>
          </>
        </Modal>
      }
      <Row justify='end' style={{paddingBottom: '10px'}}>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          size='middle'
          onClick={() => {
            setModalConfig(true);
          }}>
          Agregar
        </Button>
      </Row>
      {/* <Divider orientation='left'>Lista de observadores</Divider> */}
      <List
        pagination={observers.length > 5 && {pageSize : 5}}
        header={<div>Observadores</div>}
        bordered
        dataSource={observers}
        renderItem={(item) => (
          <List.Item actions={[<Tooltip placement='topLeft' title='Eliminar'><Button onClick={()=>deleteObserver(item.id)} icon={<DeleteOutlined />} danger type='primary'/></Tooltip>]}>
            <Space size={'large'}>
            <Typography.Text>{item.label}</Typography.Text>
            </Space>
          </List.Item>
        )}
      />
    </>
  );
}
