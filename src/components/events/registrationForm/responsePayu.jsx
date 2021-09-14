import { Button, Card, Modal, Result, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import withContext from '../../../Context/withContext';


const ResponsePayu=(props)=>{
    const [referenceCode,setReferenceCode]=useState()
    const [response,setResponse]=useState()
    const [visible,setVisible]=useState(true)
    useEffect(()=>{
      const parameters = window.location.search;
      const urlParams = new URLSearchParams(parameters);
      //Accedemos a los valores
      var reference= urlParams.get('referenceCode');
      var lapResponseCode= urlParams.get('lapResponseCode');
      var polTransactionState= urlParams.get('polTransactionState');
      var polResponseCode= urlParams.get('polResponseCode');
      var lapTransactionState= urlParams.get('lapTransactionState');
      var message= urlParams.get('message');
      setResponse({
        reference,
        lapResponseCode,
        polTransactionState,
        polResponseCode,
        lapTransactionState,
        message
      })
      
      //lapResponseCode,polTransactionState,polResponseCode,lapTransactionState=DECLINED&message=DECLINED

      if(reference) setReferenceCode(reference)
      console.log("parameteres==>",referenceCode,urlParams,props.cEvent.value._id)

    },[])
    return(
         <Modal closable={false} visible={visible} footer={null}>
           <Result 
           title={
            response && (response?.lapTransactionState=="DECLINED" || response?.lapTransactionState=="ERROR" || response?.lapTransactionState=="EXPIRED"  )?<div>Transacción declinada</div>:
            response?.lapTransactionState=="APPROVED"?<div>Transacción Aceptada</div>:
             response?.lapTransactionState=="PENDING"?<div>Transacción Pending</div>:<div></div>
           }
           extra={<Button onClick={()=>{setVisible(false);
            window.location.href=`${window.location.origin}/landing/${props.cEvent.value._id}/evento`;
          }}>Aceptar</Button>}
           />          
           </Modal>
     

    );
}

export default withContext(ResponsePayu);