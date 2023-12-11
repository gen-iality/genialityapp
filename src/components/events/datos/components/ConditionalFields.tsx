import { Button, Col, Modal, Row, Table, Tooltip } from 'antd';
import { Fragment, useState } from 'react';
import { columnsConditionalFields } from '../utils/conditional-fields.columns';
import { useModalLogic } from '@/hooks/useModalLogic';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ConditionalFieldForm } from './ConditionalFieldForm';
import { UseEventContext } from '@/context/eventContext';
import { IConditionalField } from '../types/conditional-form.types';
import { useGetConditionalFields } from '../hooks/useGetConditionalFields';
import { conditionalFieldsFacade } from '@/facades/conditionalFields.facode';
import { DispatchMessageService } from '@/context/MessageService';

export const ConditionalFields = () => {
  const { isOpenModal, closeModal, openModal, handledSelectedItem, selectedItem } = useModalLogic<IConditionalField>();
  const cEvent = UseEventContext();
  const eventId = cEvent.value._id;
  const { conditionalFieldsTable, isLoadingConditionalFields, fetchConditionalFields } = useGetConditionalFields({
    eventId,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const onOpenModal = (selectedItem?: any) => {
    handledSelectedItem(selectedItem);
    openModal();
  };

  const onCloseModal = () => {
    closeModal();
    handledSelectedItem(undefined);
  };

  const onDeleteConditionalField = async (conditionalFieldId: string | undefined) => {
    try {
      if (!conditionalFieldId) {
        return DispatchMessageService({
          action: 'show',
          type: 'error',
          msj: 'No se puede eliminar este evento ya que ya no existe',
        });
      }
      setIsDeleting(true);
      const { error } = await conditionalFieldsFacade.delete(eventId, conditionalFieldId);
      if (!error) fetchConditionalFields();
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Fragment>
      <Table
        loading={isLoadingConditionalFields}
        dataSource={conditionalFieldsTable}
        columns={[
          ...columnsConditionalFields,
          {
            title: 'Opciones',
            dataIndex: '',
            render: (key, item) => {
              return (
                <Row wrap gutter={[8, 8]}>
                  <Col>
                    <Tooltip placement='topLeft' title='Editar'>
                      <Button
                        key={``}
                        id={`edit`}
                        onClick={() => onOpenModal(item)}
                        icon={<EditOutlined />}
                        type='primary'
                        size='small'
                      />
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip placement='topLeft' title='Eliminar'>
                      <Button
                        loading={isDeleting}
                        key={``}
                        id={`delete`}
                        onClick={() => onDeleteConditionalField(item.id)}
                        icon={<DeleteOutlined />}
                        danger
                        size='small'
                      />
                    </Tooltip>
                  </Col>
                </Row>
              );
            },
          },
        ]}
        pagination={false}
        rowKey='index'
        size='small'
        title={() => (
          <Row justify='end' wrap gutter={[8, 8]}>
            <Col>
              <Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={() => onOpenModal()}>
                {'Nuevo campo condicional'}
              </Button>
            </Col>
          </Row>
        )}
      />
      {isOpenModal && (
        <Modal
          destroyOnClose
          visible={isOpenModal}
          title={selectedItem ? 'Editar Dato' : 'Agregar Dato'}
          footer={false}
          onCancel={onCloseModal}>
          <ConditionalFieldForm
            selectedConditionalField={selectedItem}
            eventId={eventId}
            onCloseModal={onCloseModal}
            fetchConditionalFields={fetchConditionalFields}
          />
        </Modal>
      )}
    </Fragment>
  );
};
