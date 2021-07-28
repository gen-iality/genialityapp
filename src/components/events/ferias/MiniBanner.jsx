import React from 'react'

function MiniBanner (props) {
    return(
     <>
      <div className='mini-banner'
       style={{ borderRadius:'12px', width:'60%', display:'block', margin:'auto', marginBottom:'25px'}}>
      <img
        src={'http://via.placeholder.com/1500x540/50D3C9/FFFFFF?text=Banner%20empresa'}
        style={{
          width: '100%',
          border:'15px solid white', borderRadius:'15px'
          // height:'50vh'
        }}
      />  
       </div>
     </>
    ); 
}

export default MiniBanner;