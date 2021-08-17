import { ShopOutlined } from '@ant-design/icons';
import { Card, Result } from 'antd';

import React from 'react';

export const PayForm=({eventId})=>{
    return  <Card>
    {eventId && eventId == '60cb7c70a9e4de51ac7945a2' && (
      <Result
      icon={<ShopOutlined />}
        title='Su registro ha sido exitoso, click al siguiente enlace para realizar la donación'
        extra={
          <div style={{ width: '100%', textAlign:'center' }}>
            {' '}
            <ButtonPayment  />
            {' '}
          </div>
        }
      />
    )}
  </Card>
}
export default PayForm;




 export const ButtonPayment=()=>{
    return (
        <form
        method='post'
        target={'_blank'}
        action='https://gateway.payulatam.com/ppp-web-gateway/pb.zul'
        acceptCharset='UTF-8'>
         {' '}
        <input
          style={{textAlign:'center', width:'100%',height:'46px',objectFit:'contain'}}
          type='image'
          border='0'
          alt=''
          src='http://www.payulatam.com/img-secure-2015/boton_pagar_mediano.png'
          onClick='this.form.urlOrigen.value = window.location.href;'
        />
         {' '}
        <input
          name='buttonId'
          type='hidden'
          value='EoWD0oG4B5RBZsfk85w2xpcGXj4HaXMobwad57IAKn8gvwD6jUhHuw=='
        />
          <input name='merchantId' type='hidden' value='519160' />
          <input name='accountId' type='hidden' value='520706' />
          <input name='description' type='hidden' value='entrada puja' />
          <input name='referenceCode' type='hidden' value='entrada puja' />
          <input name='amount' type='hidden' value='50000.00' />
          <input name='tax' type='hidden' value='0.00' />
          <input name='taxReturnBase' type='hidden' value='0.00' />
          <input name='shipmentValue' value='0.00' type='hidden' />
          <input name='currency' type='hidden' value='COP' />
          <input name='lng' type='hidden' value='es' />
          <input name='approvedResponseUrl' type='hidden' value='https://evius.co' />
          <input name='declinedResponseUrl' type='hidden' value='https://evius.co' />
          <input name='pendingResponseUrl' type='hidden' value='https://evius.co' />
          <input name='sourceUrl' id='urlOrigen' value='' type='hidden' />
          <input name='buttonType' value='SIMPLE' type='hidden' /> {' '}
        <input
          name='signature'
          value='369539171cf3b776a309aca17fc609287bd94401cafd00337db6d208c1b5da0f'
          type='hidden'
        />
      </form>
    );
}