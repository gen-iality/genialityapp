import React, {useState,useEffect } from 'react'
import { Alert, Button, Card, Col, Input, Row, Space, Spin, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { EventsApi } from '../../../helpers/request';
import { IssuesCloseOutlined } from '@ant-design/icons';



function DetailsProduct (props) {
  const {Title, Text} = Typography
  const [product, setProduct]=useState()
  const [loading, setLoading]=useState(true)

  useEffect(()=>{
    let idProduct=props.match.params.id;
    let eventId=props.match.params.event_id;

    if(idProduct && eventId ){
      obtenerDetalleProduct()
    }  
    async function obtenerDetalleProduct(){
      let detalleProduct=await  EventsApi.getOneProduct(eventId,idProduct);
      if(Object.keys(detalleProduct).length>0){       
        setProduct(detalleProduct)        
      }
      setLoading(false)
    }
  },[])

    return (
        <>
       { product && !loading && <Row style={{margin:'12px'}} gutter={[8,8]}>
          <Col xm={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              <div style={{width:'100%', height:'450px', display:'grid', justifyContent:'center'}}>
                  <img style={{height:'450px'}}src={product && product.image ?  product.image[0]:"https://aws.admagazine.com/prod/designs/v1/assets/620x818/68699.jpg"} alt="arte" />
              </div>
          </Col>
          <Col xm={24} sm={24} md={12} lg={14} xl={14} xxl={14}>
               <div>
                  <Space direction='vertical' style={{width:'100%'}}>  
                      <Title level={3}>{product && product.name?product.name :"Nombre de la obra"}</Title> 
                       <Title level={5}>Artista</Title>
                       <Text>{product && product.author ? product.author :"Sin Artista"} </Text>        
                      <Title level={5}>Descripcion</Title>
                      <Text><div
                        dangerouslySetInnerHTML={{ __html: product && product.description ? product.description:"Sin descripción" }}></div></Text>           
                    <Row gutter={[12,12]}> 
                      <Col span={12}>
                      <span><strong>Oferta actual</strong></span>
                      <Alert style={{padding:'4px 15px'}} type="success" message={product && product.price? product.price:"Sin precio"}/>  
                      </Col>
                      <Col span={12}> 
                        <span ><strong>Valor a ofrecer</strong></span>
                        <Input type='number' style={{width:'100%'}} min='1000' max={99999999} value=''  />
                       <span style={{color:'red',fontSize:8}}>Valor a ofrecer incorrecto</span>
                      </Col>            
                    </Row> 
                     <Button type='primary' size='middle'>
                         Pujar
                     </Button>
                    </Space> 

               </div>
          </Col>
        </Row> }
         {!product && !loading && <Card style={{textAlign:'center', marginLeft:30,marginRight:30,marginTop:60}}>
            <IssuesCloseOutlined  style={{marginRight:20, fontSize:20}} />No existe detalle de este producto
         </Card>}
         {loading && <Row style={{marginTop:60}} ><Spin style={{margin:'auto'}} /></Row>}
        </>
    )
}

export default withRouter(DetailsProduct);