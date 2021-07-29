import React from 'react'
import { useHistory } from 'react-router';
import {Badge} from 'antd'

function FeriasStand (props) {
  const history = useHistory();
    return(
     <>
      {/* <div className='mini-banner'
       style={{ borderRadius:'12px', width:'60%', display:'block', margin:'auto', marginBottom:'25px'}}>
      <img
        src={'http://via.placeholder.com/1500x540/50D3C9/FFFFFF?text=Banner%20empresa'}
        style={{
          width: '100%',
          border:'15px solid white', borderRadius:'15px'
          // height:'50vh'
        }}
      />  
    </div> */}
    
    <div style={{position:'relative'}} 
     onClick={() => {
            history.push(`/landing/${props.eventId}/ferias/${props.companyId}/detailsCompany`);
          }}>
      <div className='mini-banner'
          style={{ border:`2px solid  ${props.color}`, 
          borderRadius:'12px', 
          width:'60%',
          position:'absolute', 
          left:'50%', 
          transform:'translateX(-50%)', 
          top:'2px',
          backgroundColor:'white'}}>
          <Badge.Ribbon text={props.text} color={props.color}>
            <img
                src={props.image}
                style={{
                width: '100%',
                border:`10px solid white`, borderRadius:'12px',
                height:'20vh',
                objectFit:'contain'
                }}
            /> </Badge.Ribbon>  
        </div>
            <img
                src={'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Stand_ferias%2Fstand.png?alt=media&token=4de289cb-5f22-4c9f-81b1-300df0815490'}
                style={{
                width: '100%',
                border:`10px solid white`, borderRadius:'12px',
                height:'70vh',
                objectFit:'contain'
                }}
            />  
    </div>
        

     </>
    ); 
}

export default FeriasStand;