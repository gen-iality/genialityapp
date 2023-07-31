import { Button, Modal, Result, Typography } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { ButtonPayment } from '../registrationForm/payRegister'

const ModalRegister = ({ register, setRegister, event }) => {
  const titleModal = register == 4 ? `¡Información Actualizada!` : `Inscripción Exitosa!`

  const message =
    register == 1
      ? `Se ha mandado un correo de confirmación que te permitirá acceder al curso`
      : register == 2
      ? `Bienvenido al curso ${event?.name}.`.concat('')
      : register == 3
      ? `Su registro ha sido exitoso, click al siguiente enlace para realizar la donación`
      : `value ${register} is unknown!`
  // Recibirá en su correo el link de acceso al curso
  const infoButton =
    register == 1
      ? 'Cerrar'
      : register == 2
      ? `Disfrutar del curso`
      : register == 3
      ? `REGISTRO PAGO`
      : `Disfrutar del curso`

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', borderTop: '10px solid #52C41A' }}
      footer={null}
      zIndex={999999999}
      open={register !== null}
      closable={false}
    >
      <Result
        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
        status="success"
        title={<Typography.Text type="success"> {titleModal} </Typography.Text>}
        subTitle={<span style={{ fontSize: '18px' }}>{message}</span>}
        extra={[
          register != 3 ? (
            <Button
              onClick={() => setRegister(null)}
              style={{ backgroundColor: '#52C41A', color: '#FFFFFF', marginTop: '10px' }}
              size="large"
              key="console"
            >
              {infoButton}
            </Button>
          ) : (
            <ButtonPayment />
          ),
        ]}
      ></Result>
    </Modal>
  )
}

export default ModalRegister
