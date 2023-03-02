import { ShopOutlined } from '@ant-design/icons';
import { Card, Result, Row } from 'antd';
import withContext from '@context/withContext';

import { useEffect, useState } from 'react';
import { OrderFunctions } from '@helpers/request';

export const PayForm = ({ eventId, ...props }) => {
  return (
    <Card>
      {eventId && eventId == '60cb7c70a9e4de51ac7945a2' && (
        <Result
          icon={<ShopOutlined />}
          title='Para completar el registro y poder hacer pujas por las obras, realiza el pago de la entrada en el siguiente botón de pago.'
          subTitle='En las próximas horas recibirás la confirmación del pago.'
          extra={
            <div style={{ width: '100%', textAlign: 'center' }}>
              {' '}
              <ButtonPayment user={props.cEventUser.value} eventId={eventId} />{' '}
            </div>
          }
        />
      )}
    </Card>
  );
};
export default withContext(PayForm);

export const ButtonPayment = ({ eventId, user }) => {
  const amount = '50000';
  const [referenceCode, setReferenceCode] = useState(null);
  const ApiKey = 'omF0uvbN3365dC2X4dtcjywbS7';
  const merchantId = '585044';
  const [signature, setSignature] = useState(null);
  const currency = 'COP';
  const responseUrl = 'https://api.evius.co/api/payment_webhook_response';

  //Función que permite crear la orden
  const createOrder = async (amount, user) => {
    const order = {
      items: [eventId],
      account_id: user?.account_id,
      amount: amount,
      item_type: 'event',
      discount_codes: [],
      event_id: eventId,
    };
    const respOrder = await OrderFunctions.createOrder(order);
    if (respOrder) {
      return respOrder?._id;
    }
  };

  useEffect(() => {
    if (user) {
      obtenerSignature();
    }
    async function obtenerSignature() {
      const referenceCodeResp = await createOrder(amount, user);
      setReferenceCode(referenceCodeResp);
      const stringforsignature = `${ApiKey}~${merchantId}~${referenceCodeResp}~${amount}~${currency}`;
      const signatureNew = await digestMessage(stringforsignature);
      setSignature(signatureNew);
    }
  }, [user, window.location]);

  async function digestMessage(message) {
    //var input = new TextEncoder('utf-8').encode(message);
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);

    // If you want to display the digest as a hexadecimal string, this will work:
    const view = new DataView(hash);
    let hexstr = '';
    for (let i = 0; i < view.byteLength; i++) {
      const b = view.getUint8(i);
      hexstr += '0123456789abcdef'[(b & 0xf0) >> 4];
      hexstr += '0123456789abcdef'[b & 0x0f];
    }
    return hexstr;
  }
  return (
    <>
      {
        <Row style={{ width: '100%' }} justify="center">
          <form
            style={{ width: '170px' }}
            method='post'
            action='https://checkout.payulatam.com/ppp-web-gateway-payu/'
            acceptCharset='UTF-8'>
            {' '}
            <input
              style={{ width: '100%' }}
              type='image'
              border='0'
              alt=''
              src='http://www.payulatam.com/img-secure-2015/boton_pagar_mediano.png'
              onClick='this.form.urlOrigen.value = window.location.href;'
            />{' '}
            <input name='merchantId' type='hidden' value='585044' />
            <input name='accountId' type='hidden' value='588020' />
            <input name='description' type='hidden' value='test' />
            <input name='referenceCode' type='hidden' value={referenceCode} />
            <input name='amount' type='hidden' value={amount} />
            <input name='tax' type='hidden' value='0.00' />
            <input name='taxReturnBase' type='hidden' value='0.00' />
            <input name='shipmentValue' value='0.00' type='hidden' />
            <input name='currency' type='hidden' value='COP' />
            <input name='lng' type='hidden' value='es' />
            <input name='responseUrl' type='hidden' value={responseUrl} />
            <input name='confirmationUrl' type='hidden' value='https://devapi.evius.co/test.php' />
            <input name='sourceUrl' id='urlOrigen' value='' type='hidden' />
            <input name='buttonType' value='SIMPLE' type='hidden' />
            <input name='signature' value={signature} type='hidden' />
            <input name='buyerEmail' type='hidden' value={user?.user.email} />
            <input name='algorithmSignature' value='SHA256' type='hidden' />
            <input name='tes1' value='1' type='hidden' />
          </form>
        </Row>
      }
    </>
  );
};
