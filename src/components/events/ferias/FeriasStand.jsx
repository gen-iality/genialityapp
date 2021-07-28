import { fromValue } from 'long';
import React from 'react'
import FeriasBanner from './feriaBanner'
import {Row, Col} from 'antd'
import { prop } from 'dom7';

function FeriasStand (props) {
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
        <div className='mini-banner'
          style={{ border:'2px solid #9e9e9e', borderRadius:'12px', width:'60%', display:'block', margin:'auto'}}>
            <img
                src={props.image}
                style={{
                width: '100%',
                border:'10px solid white', borderRadius:'15px',
                height:'20vh',
                objectFit:'contain'
                }}
            />  
            </div>
     </>
    ); 
}

export default FeriasStand;