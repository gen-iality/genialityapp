import { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
} from 'antd';
import CMS from '../newComponent/CMS';
import { ModulesApi } from '@helpers/request';

function ModulePage(props: any) {
  const [columnsData, setColumnsData] = useState({});

  const [currentEditingItem, setCurrentEditingItem] = useState<any | null>(null);
  const [isOpened, setIsOpened] = useState(false);

  const [form] = Form.useForm();

  const openModal = () => {
    setIsOpened(true);
  }

  const closeModal = () => {
    setIsOpened(false);
  }

  const cancelModel = () => {
    form.resetFields();
    setCurrentEditingItem(null);
    closeModal();
  }

  useEffect(() => {
    if (currentEditingItem) {
      form.setFields([{name: 'moduleName', value: currentEditingItem.module_name}])
      openModal();
    }
  }, [currentEditingItem])

  useEffect(() => {
    console.log(columnsData)
  }, [columnsData])

  const columns = [
    {
      title: 'Modulo',
      dataIndex: 'module_name',
    },
  ];

  return (
    <>
    <p style={{color: 'red'}}>TODO: falta recargar el CMS cuando se agregue/edite cosas</p>
    <CMS
      API={ModulesApi}
      eventId={props.event._id}
      title={'Modules'}
      titleTooltip={'Agregue o edite los modules disponibles en este curso'}
      addFn={() => {
        openModal();
        console.log('agregar:', ...arguments);
      }}
      columns={columns}
      // key='_id'
      editFn={(item: any) => {
        setCurrentEditingItem(item);
        console.log('edit', item);
      }}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
      scroll={{ x: 'auto' }}
    />

    <Modal
      visible={isOpened}
      title={currentEditingItem === null ? 'Agregar nuevo modulo' : 'Editar módulo'}
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={cancelModel}
    >
      <Form
        form={form}
        onFinish={(values) => {
          values.event_id = props.event._id
          console.log('finish', values);

          if (currentEditingItem === null) {
            ModulesApi.create(values.moduleName, props.event._id)
            .finally(() => {
              closeModal();
              form.resetFields();
            })
          } else {
            ModulesApi.update(currentEditingItem._id, values.moduleName)
            .finally(() => {
              closeModal();
              setCurrentEditingItem(null);
              form.resetFields();
            })
          }
        }}
      >
        <Form.Item
          name="moduleName"
          label="Nombre del módulo"
          rules={[{ required: true, message: 'Es necesario el nombre de módulo' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit'>
            {currentEditingItem === null ? 'Agregar' : 'Editar'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
}

export default ModulePage;
