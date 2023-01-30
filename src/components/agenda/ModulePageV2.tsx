import { useState, useEffect } from 'react';

/** Antd imports */
import { Modal, Form, Input, Button, Table, Row, Col, Tooltip } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import Header from '@antdComponents/Header';
import CMS from '../newComponent/CMS';

/** Helpers and utils */
import { ModulesApi } from '@helpers/request';
import { DispatchMessageService } from '@context/MessageService';
import { handleRequestError } from '@helpers/utils';

const { confirm } = Modal;

function ModulePage(props: any) {
  const [columnsData, setColumnsData] = useState({});

  const [currentEditingItem, setCurrentEditingItem] = useState<any | null>(null);
  const [modulesData, setModulesData] = useState([]);

  const [isOpened, setIsOpened] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [form] = Form.useForm();

  async function getModules() {
    const modules = await ModulesApi.byEvent(props.event._id);
    setModulesData(modules);
    setIsLoading(false);
    console.debug('Get Modules', { modules });
  }

  const openModal = () => {
    setIsOpened(true);
  };

  const closeModal = () => {
    setIsOpened(false);
  };

  const cancelModal = () => {
    form.resetFields();
    setCurrentEditingItem(null);
    closeModal();
  };

  const addModule = () => {
    setCurrentEditingItem(null);
    openModal();
  };

  const editModule = (item: object) => {
    setCurrentEditingItem(item);
    openModal();
  };

  const deleteModule = (item: object) => {
    console.log('item delete', item);
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (item) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await ModulesApi.deleteOne(item._id);
              setIsDeleted(true);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e).message,
                action: 'show',
              });
            }
          };
          onHandlerRemove();
        },
      });
    }
  };

  useEffect(() => {
    if (currentEditingItem) {
      form.setFields([{ name: 'moduleName', value: currentEditingItem.module_name }]);
      openModal();
    }
  }, [currentEditingItem]);

  useEffect(() => {
    console.log('UseEffect');
    getModules();
    setIsDeleted(false);
  }, [isOpened, isDeleted]);

  useEffect(() => {
    console.log(columnsData);
  }, [columnsData]);

  const columns: any[] = [
    {
      title: 'Modulo',
      dataIndex: 'module_name',
    },
    {
      title: 'Opción',
      dataIndex: 'index',
      fixed: 'right',
      width: 80,
      render: (val: any, item: any, index: any) => {
        return (
          <>
            <Tooltip title='Editar'>
              <Button
                style={{ marginRight: '5px' }}
                id={`editAction${index}`}
                type='primary'
                size='small'
                onClick={(e) => editModule(item)}
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title='Eliminar'>
              <Button
                id={`editAction${index}`}
                danger
                type='primary'
                size='small'
                onClick={(e) => deleteModule(item)}
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      {console.log('Empeza el render')}
      <Header title={'Modules'} />

      <Table
        columns={columns}
        dataSource={modulesData}
        size='small'
        rowKey='index'
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={addModule}>
                {'Agregar'}
              </Button>
            </Col>
          </Row>
        )}
      />

      <Modal
        visible={isOpened}
        title={currentEditingItem === null ? 'Agregar nuevo modulo' : 'Editar módulo'}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={cancelModal}
      >
        <Form
          form={form}
          onFinish={(values) => {
            values.event_id = props.event._id;
            console.log('finish', values);

            if (currentEditingItem === null) {
              ModulesApi.create(values.moduleName, props.event._id).finally(() => {
                closeModal();
                form.resetFields();
              });
            } else {
              ModulesApi.update(currentEditingItem._id, values.moduleName).finally(() => {
                closeModal();
                setCurrentEditingItem(null);
                form.resetFields();
              });
            }
          }}
        >
          <Form.Item
            name='moduleName'
            label='Nombre del módulo'
            rules={[{ required: true, message: 'Es necesario el nombre de módulo' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit'>{currentEditingItem === null ? 'Agregar' : 'Editar'}</Button>
          </Form.Item>
        </Form>
      </Modal>
      {console.log('Termina el render')}
    </>
  );
}

export default ModulePage;
