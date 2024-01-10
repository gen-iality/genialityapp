import { Button, Modal, ModalProps, Row, Typography } from 'antd';

interface Props extends ModalProps {
  onCancel: () => void;
}
export const CapacityCompleted = ({ onCancel, ...modalProps }: Props) => {
  return (
    <Modal onCancel={onCancel} {...modalProps} footer={null}>
      <Typography.Title>Capacidad superada</Typography.Title>
      <Typography.Paragraph>La capacidad del evento ha llegado a su limite</Typography.Paragraph>
      <Row justify='end'>
        <Button type='primary' onClick={onCancel}>
          Aceptar
        </Button>
      </Row>
    </Modal>
  );
};
