
import { Button, Card, Space } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';


const ProductCard=({galery,eventId,history})=>{  
  console.log("PRODUCT==>",galery)
 return (
    <Card   
    //  bodyStyle={{padding:'15px'}}        
     key={"Cardgallery"+galery.id}
     style={{ marginLeft:20, width: 300,marginBottom:20,marginRight:20,
      boxShadow:' 0px 4px 4px 0px #00000040'
    }}
     cover={<img alt='example' src={galery && galery.image && galery.image[0]} />}
    //  extra={<div onClick={null}key={'act-'+galery.id}>$ {galery.price}</div>}
     title={galery.name}
    //  actions={[              
    //    <div onClick={()=>this.props.cUser.value?this.pujar(galery):this.setState({isModalVisibleRegister:true})}  key={'act2-'+galery.id} ><SettingOutlined key='setting' /> Pujar</div>              
    //  ]}
     >
     <Meta            
       description={
       <Space direction='vertical'>
         <div><span style={{fontWeight:'bold'}}>Artista:</span>{galery && galery.author?galery.author:"Sin artista"}</div>
         <div style={{fontWeight:'bold', fontSize:'18px'}} onClick={null}key={'act-'+galery.id}>$ {galery.price}</div>
         <Button  type="primary" block onClick={()=>history.push(`/landing/${eventId}/producto/${galery._id}/detailsproducts`)}  key={'act2-'+galery.id}>
           Comprar
         </Button>
       </Space>
       }
     />
   </Card>
 );
}


export default ProductCard;