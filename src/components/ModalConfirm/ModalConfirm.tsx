import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Modal, ModalProps, Result, Space, Typography } from 'antd';
import { useState } from 'react';

interface Props extends ModalProps {
  onCancel: () => void;
  onAction: () => void;
  nameItem: string;
  titleConfirm: string;
  descriptionConfirm: string;
}

//ToDo: [ Luis ] Hacer este modal usando el ModalConfirm de ant desing  
export const ModalConfirm = ({
  onCancel,
  nameItem,
  onAction,
  titleConfirm,
  descriptionConfirm,
  ...modalProps
}: Props) => {
  const [permit, setPermit] = useState(false);
  return (
    <Modal
      {...modalProps}
      onCancel={() => onCancel()}
      destroyOnClose={true}
      footer={[
        <Button key={'btnCancelar'} type='default' onClick={onCancel} icon={<CloseCircleOutlined />}>
          Cancelar
        </Button>,
        <Button
          key={'btnEliminar'}
          type='primary'
          danger
          onClick={() => {
            onAction();
            onCancel();
          }}
          disabled={!permit}
          icon={<DeleteOutlined />}>
          Eliminar
        </Button>,
      ]}>
      <Result
        status={'warning'}
        title={
          <Typography.Text strong type='warning' style={{ fontSize: 22 }}>
            {titleConfirm}
          </Typography.Text>
        }
        extra={
          <Input
            placeholder={nameItem}
            onChange={({ target: { value } }) => {
              if (value === nameItem) {
                setPermit(true);
              } else {
                setPermit(false);
              }
            }}
          />
        }
        subTitle={
          <Space style={{ textAlign: 'justify' }} direction='vertical'>
            <Typography.Paragraph>{descriptionConfirm}</Typography.Paragraph>

            <Typography.Paragraph>
              Para confirmar que deseas borrar el item, escribe la siguiente palabra:
              <Typography.Text strong type='danger'>
                {` ${nameItem}`}
              </Typography.Text>
            </Typography.Paragraph>
          </Space>
        }
      />
    </Modal>
  );
};
