import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import { Button, Card, Modal, Result, Row } from 'antd';
import { useEffect, useState } from 'react';
import withContext from '@context/withContext';
import { Actions } from '@helpers/request';

const ResponsePayu = (props) => {
  const [referenceCode, setReferenceCode] = useState();
  const [response, setResponse] = useState();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const parameters = window.location.search;
    const urlParams = new URLSearchParams(parameters);
    //Accedemos a los valores
    const reference = urlParams.get('referenceCode');
    const lapResponseCode = urlParams.get('lapResponseCode');
    const polTransactionState = urlParams.get('polTransactionState');
    const polResponseCode = urlParams.get('polResponseCode');
    const lapTransactionState = urlParams.get('lapTransactionState');
    const message = urlParams.get('message');
    setResponse({
      reference,
      lapResponseCode,
      polTransactionState,
      polResponseCode,
      lapTransactionState,
      message,
    });
    if (lapTransactionState == 'APPROVED' && polTransactionState == 4 && polResponseCode == 1) {
      updateRolUser();
    }
    async function updateRolUser() {
      const updateRol = await Actions.put(`/api/events/${props.cEvent.value?._id}/eventusers/${reference}/updaterol`, {
        rol_id: '60e8a8b7f6817c280300dc23',
      });
    }
    //lapResponseCode,polTransactionState,polResponseCode,lapTransactionState=DECLINED&message=DECLINED
    if (reference) setReferenceCode(reference);
  }, []);
  const isDeclined = () => {
    return response?.lapTransactionState == 'DECLINED' ||
      response?.lapTransactionState == 'ERROR' ||
      response?.lapTransactionState == 'EXPIRED'
      ? true
      : false;
  };
  return (
    <Modal
      bodyStyle={{
        textAlign: 'center',
        borderTop: `10px solid ${
          response &&
          (response?.lapTransactionState == 'DECLINED' ||
            response?.lapTransactionState == 'ERROR' ||
            response?.lapTransactionState == 'EXPIRED')
            ? '#FF3830'
            : response?.lapTransactionState == 'APPROVED'
            ? '#52C41A'
            : response?.lapTransactionState == 'PENDING'
            ? '#518BFB'
            : ''
        }`,
      }}
      closable={false}
      visible={visible}
      footer={null}>
      <Result
        icon={
          response &&
          (response?.lapTransactionState == 'DECLINED' ||
            response?.lapTransactionState == 'ERROR' ||
            response?.lapTransactionState == 'EXPIRED') ? (
            <CloseCircleFilled style={{ color: '#FF3830' }} />
          ) : response?.lapTransactionState == 'APPROVED' ? (
            <CheckCircleFilled style={{ color: '#52C41A' }} />
          ) : response?.lapTransactionState == 'PENDING' ? (
            <InfoCircleFilled style={{ color: '#518BFB' }} />
          ) : null
        }
        title={
          response &&
          (response?.lapTransactionState == 'DECLINED' ||
            response?.lapTransactionState == 'ERROR' ||
            response?.lapTransactionState == 'EXPIRED') ? (
            <div>Transacción Fallida</div>
          ) : response?.lapTransactionState == 'APPROVED' ? (
            <div>Transacción Exitosa</div>
          ) : response?.lapTransactionState == 'PENDING' ? (
            <div>Transacción Pendiente</div>
          ) : (
            <div></div>
          )
        }
        subTitle={
          response &&
          (response?.lapTransactionState == 'DECLINED' ||
            response?.lapTransactionState == 'ERROR' ||
            response?.lapTransactionState == 'EXPIRED') ? (
            <div>Lo sentimos, su transacción ha sido rechazada, intente realizar su transacción mas tarde.</div>
          ) : response?.lapTransactionState == 'APPROVED' ? (
            <div>Su transacción ha sido realizada correctamente, ahora podrás realizar pujas por las obras</div>
          ) : response?.lapTransactionState == 'PENDING' ? (
            <div>Su transacción está pendiente por confirmar</div>
          ) : (
            <div></div>
          )
        }
        extra={[
          <Button
            key='action'
            style={{ marginTop: '10px' }}
            type='primary'
            size='large'
            onClick={() => {
              setVisible(false);
              !isDeclined()
                ? (window.location.href = `${window.location.origin}/landing/${props.cEvent.value._id}/evento`)
                : (window.location.href = `${window.location.origin}/landing/${props.cEvent.value._id}/tickets`);
            }}>
            Aceptar
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default withContext(ResponsePayu);
