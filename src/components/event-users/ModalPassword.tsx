import { LockOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import useModal from 'antd/lib/modal/useModal'

interface IModalPasswordProps {
  onOk?: () => void
}

export default function ModalPassword({ onOk }: IModalPasswordProps) {
  const [modal, contextHolder] = useModal()

  const openModal = () => {
    modal.confirm({
      title: 'Enviar correo para cambiar contraseña',
      content: '¿Estás seguro de que deseas enviar el correo para cambiar la contraseña?',
      onOk,
    })
  }
  return (
    <Tooltip placement="topLeft" title="Enviar correo de cambio de contraseña">
      <Button type={'primary'} size="small" onClick={openModal} icon={<LockOutlined />} />
      {contextHolder}
    </Tooltip>
  )
}
