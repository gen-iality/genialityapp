import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import { Button, Card, Modal, Result, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import withContext from '../../../Context/withContext';
import { Actions } from '../../../helpers/request';

const ResponsePayu = (props) => {
  const [referenceCode, setReferenceCode] = useState();
  const [response, setResponse] = useState();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const parameters = window.location.search;
    const urlParams = new URLSearchParams(parameters);
    //Accedemos a los valores
    var reference = urlParams.get('referenceCode');
    var lapResponseCode = urlParams.get('lapResponseCode');
    var polTransactionState = urlParams.get('polTransactionState');
    var polResponseCode = urlParams.get('polResponseCode');
    var lapTransactionState = urlParams.get('lapTransactionState');
    var message = urlParams.get('message');
    setResponse({
      reference,
      lapResponseCode,
      polTransactionState,
      polResponseCode,
      lapTransactionState,
      message,
    });
    if(lapTransactionState=="APPROVED" && polTransactionState==4 && polResponseCode ==1){
      updateRolUser()
    }
     async function updateRolUser(){      
        let updateRol=await Actions.put(
          `/api/events/${props.cEvent.value?._id}/eventusers/${reference}/updaterol`,
          {
            rol_id:"60e8a8b7f6817c280300dc23"
          }        
        );        
      }
      //lapResponseCode,polTransactionState,polResponseCode,lapTransactionState=DECLINED&message=DECLINED
    if (reference) setReferenceCode(reference);    
  }, []);
  return (
    <Modal
      bodyStyle={{ textAlign: 'center', borderTop: `10px solid ${response &&
        (response?.lapTransactionState == 'DECLINED' ||
          response?.lapTransactionState == 'ERROR' ||
          response?.lapTransactionState == 'EXPIRED') ? (
         '#FF3830'
        ) : response?.lapTransactionState == 'APPROVED' ? (
          '#52C41A'
        ) : response?.lapTransactionState == 'PENDING' ? (
          '#518BFB'
        ) : (
          ''
        )}` }}
      closable={false}
      visible={visible}
      footer={null}>
      <Result
        icon={
          response &&
          (response?.lapTransactionState == 'DECLINED' ||
            response?.lapTransactionState == 'ERROR' ||
            response?.lapTransactionState == 'EXPIRED') ? (
            <CloseCircleFilled style={{color:'#FF3830'}} />
          ) : response?.lapTransactionState == 'APPROVED' ? (
            <CheckCircleFilled style={{color:'#52C41A'}} />
          ) : response?.lapTransactionState == 'PENDING' ? (
            <InfoCircleFilled style={{color:'#518BFB'}} />
          ) : (
            null
          )
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
        extra={[
          <Button
            key='action'
            style={{ marginTop: '10px' }}
            type='primary'
            size='large'
            onClick={() => {
              setVisible(false);
              window.location.href = `${window.location.origin}/landing/${props.cEvent.value._id}/evento`;
            }}>
            Aceptar
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default withContext(ResponsePayu);
