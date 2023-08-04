import { LockOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react'

export default function PasswordAssistant({ onOk }) {
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
        <Button type={'primary'} size='small' onClick={openModal} icon={<LockOutlined />}/>
        {contextHolder}
      </div>
    );
}
