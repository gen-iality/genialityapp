import React from 'react'

function MiniBanner (props) {
    return(
     <>
      <div className='mini-banner'
       style={{ borderRadius:'12px', width:'80%', display:'block', margin:'auto', marginBottom:'25px'}}>
      <img
        src={props.banner}
        style={{
          width: '100%',
          /* border:'15px solid white', borderRadius:'15px', */
          height:'450px', objectFit:'contain',
          // height:'50vh'
        }}
      />  
       </div>
     </>
    ); 
}

export default MiniBanner;