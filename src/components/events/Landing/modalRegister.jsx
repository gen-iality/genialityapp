import React from 'react';
import {  Button, Drawer,Modal, Result, Typography } from 'antd';

const ModalRegister=({register,setRegister,event})=>{
  
    return (
        <Modal
        bodyStyle={{ textAlign: 'center', borderTop: '10px solid #52C41A' }}
        footer={null}
        zIndex={999999999}
        closable={false}
        visible={register!==null?true:false}>
        <Result
          status='success'
          title={<Typography.Text type='success'>Registro Exitoso!</Typography.Text>}
          subTitle={register==2?`Bienvenido al evento ${event?.name}`:register==1?`Registre su email`:`Registro pago`}
          extra={[
            <Button onClick={()=>setRegister(null)} style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }} size='large' key='console'>
              Disfrutar del evento
            </Button>,
          ]}></Result>
      </Modal>
    );
}

export default ModalRegister;