import { Row } from 'antd';
import React, { useEffect, useState } from 'react';
import withContext from '../../../Context/withContext';


const ResponsePayu=(props)=>{
    const [referenceCode,setReferenceCode]=useState()
    useEffect(()=>{
      const parameters = window.location.search;
      const urlParams = new URLSearchParams(parameters);
      //Accedemos a los valores
      var reference= urlParams.get('referenceCode');
      if(reference) setReferenceCode(reference)
      console.log("parameteres==>",referenceCode,urlParams,props.cEvent.value._id)

    },[])
    return(
     <Row justify={'center'}>
            Response payu {"=>"}{referenceCode && referenceCode}
     </Row>

    );
}

export default withContext(ResponsePayu);