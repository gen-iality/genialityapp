
import { Button, Card, Space, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';


const ProductCard=({galery,eventId,history})=>{  
  console.log("PRODUCT==>",galery)
  const {Title, Text} = Typography
 return (
  <Card   
  bordered={false}
  //  bodyStyle={{padding:'15px'}} 
  bodyStyle={{padding:'14px 0px'}}       
  key={"Cardgallery"+galery.id}
   style={{ margin:'30px', width:'300px'
  }}
  onClick={()=>history.push(`/landing/${eventId}/producto/${galery._id}/detailsproducts`)}
   cover={<img alt='example'  style={{width:'300px', objectFit:'contain'}} src={galery && galery.image && galery.image[0]} />}
  //  extra={<div onClick={null}key={'act-'+galery.id}>$ {galery.price}</div>}
  //  title={galery.name}
  //  actions={[              
  //    <div onClick={()=>this.props.cUser.value?this.pujar(galery):this.setState({isModalVisibleRegister:true})}  key={'act2-'+galery.id} ><SettingOutlined key='setting' /> Pujar</div>              
  //  ]}
   >
   <Meta            
     description={
     <Space direction='vertical'>
       <Title level={4} ellipsis={{ rows: 3}} >{galery.name}</Title>
       <div><span style={{fontWeight:'bold'}}>Artista:</span>{galery && galery.author?galery.author:"Sin artista"}</div>
       <div style={{fontWeight:'bold', fontSize:'18px'}} onClick={null}key={'act-'+galery.id}>{galery.price}</div>
       {/* <Button  type="primary" block onClick={()=>history.push(`/landing/${eventId}/producto/${galery._id}/detailsproducts`)}  key={'act2-'+galery.id}>
         Comprar
       </Button> */}
     </Space>
     }
   />
 </Card>   
 );
}


export default ProductCard;