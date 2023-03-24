import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, List, Modal, Row, Select, Typography , Space } from 'antd';
import React, { useState , useContext } from 'react';
import { NetworkingContext } from '../../context/NetworkingContext';


export default function ConfigObservers() {
  const [modalConfig, setModalConfig] = useState(false);
  const { attendeesList , createObserver ,deleteObserver, observers} = useContext(NetworkingContext)

  const closeModal = () => {
    setModalConfig(false);
  };

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
            <Form onFinish={createObserver}>
              <Form.Item name={'data'} rules={[{required : true , message: 'debe seleccionar un participante'}]} initialValue={[]}>
                <Select allowClear mode='multiple' options={attendeesList()} defaultValue={[]}/>
              </Form.Item>
              <Button type='primary' style={{ marginRight: 10 }} htmlType='submit'>
                Guardar
              </Button> 
            </Form>
          </>
        </Modal>
      }
      <Row justify='end'>
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
      <Divider orientation='left'>Lista de observadores</Divider>
      <List
        header={<div>Obervadores</div>}
        bordered
        dataSource={observers}
        renderItem={(item) => (
          <List.Item actions={[<Button onClick={()=>deleteObserver(item.id)} icon={<DeleteOutlined />}/>]}>
            <Space size={'large'}>
            <Typography.Text>{item.label}</Typography.Text>
            </Space>
          </List.Item>
        )}
      />
    </>
  );
}
