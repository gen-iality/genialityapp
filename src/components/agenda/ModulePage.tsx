import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, Space, Typography, Tooltip } from 'antd';
import { ModulesApi } from '@helpers/request';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

function ModulePage(props: any) {
  const [columnsData, setColumnsData] = useState<ColumnsType<any>>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);

  const [currentEditingItem, setCurrentEditingItem] = useState<any | null>(null);
  const [isOpened, setIsOpened] = useState(false);

  const [form] = Form.useForm();

  const openModal = () => {
    setIsOpened(true);
  };

  const closeModal = () => {
    setIsOpened(false);
  };

  const cancelModel = () => {
    form.resetFields();
    setCurrentEditingItem(null);
    closeModal();
  };
  
  const loadAllModules = async () => {
    const modules = await ModulesApi.byEvent(props.event._id)
    setDataSource(modules)
  }

  const onFormFinish = (values: any) => {
    values.event_id = props.event._id;
    console.log('finish', values);

    if (currentEditingItem === null) {
      ModulesApi.create(values.moduleName, props.event._id).finally(() => {
        closeModal();
        form.resetFields();
        loadAllModules();
      });
    } else {
      ModulesApi.update(currentEditingItem._id, values.moduleName).finally(() => {
        closeModal();
        setCurrentEditingItem(null);
        form.resetFields();
        loadAllModules();
      });
    }
  }

  useEffect(() => {
    const columns: ColumnsType = [
      {
        key: 'name',
        title: 'Module',
        render: (module: any) => module.module_name,
      },
      {
        key: 'options',
        title: 'Opciones',
        render: (module: any) => (
          <Space direction="horizontal">
            <Tooltip title="Editar módulo">
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={() => {
                  setCurrentEditingItem(module)
                  openModal();
                }}
              />
            </Tooltip>

            <Tooltip title="Eliminar módulo">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  ModulesApi.deleteOne(module._id).finally(loadAllModules)
                }}
              />
            </Tooltip>
          </Space>
        )
      },
    ]
    setColumnsData(columns)
    loadAllModules()
  }, [])

  useEffect(() => {
    if (currentEditingItem) {
      form.setFields([{ name: 'moduleName', value: currentEditingItem.module_name }]);
      openModal();
    }
  }, [currentEditingItem]);

  return (
    <>
      <Space direction="horizontal" style={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography.Text>
          Agregue o edite los modules disponibles en este curso
        </Typography.Text>
        <Button type="primary" onClick={openModal}>Agregar módulo</Button>
      </Space>
      <Table
        columns={columnsData}
        dataSource={dataSource}
      />
      <Modal
        visible={isOpened}
        title={currentEditingItem === null ? 'Agregar nuevo modulo' : 'Editar módulo'}
        onCancel={cancelModel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onFormFinish}>
          <Form.Item
            name='moduleName'
            label='Nombre del módulo'
            rules={[{ required: true, message: 'Es necesario el nombre de módulo' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ModulePage;
