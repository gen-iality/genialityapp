import { LockOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import useModal from 'antd/lib/modal/useModal';
interface ModalPasswordProps {
  onOk: () => void;
}
export default function PasswordAssistant({ onOk }: ModalPasswordProps) {
  const [modal, contextHolder] = useModal();

  const openModal = () => {
    modal.confirm({
      title: 'Enviar correo para cambiar contraseña',
      content: '¿Estás seguro de que deseas enviar el correo para cambiar la contraseña?',
      onOk,
    });
  };
  return (
    <div>
      <Tooltip title='Cambiar contraseña'>
        <Button type={'primary'} size='small' onClick={openModal} icon={<LockOutlined />} />
      </Tooltip>
      {contextHolder}
    </div>
  );
}
