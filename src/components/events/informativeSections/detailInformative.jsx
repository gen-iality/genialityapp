import React, {useState} from 'react'
import { Alert, Button, Card, Col, Input, Row, Space, Typography } from 'antd';


function DetailInformation () {
  const {Title, Text} = Typography

    return (
        <>
        <Row style={{margin:'12px'}} gutter={[8,8]}>
          <Col xm={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
              <div style={{width:'100%', height:'450px', display:'grid', justifyContent:'center'}}>
                  <img style={{height:'450px'}}src="https://aws.admagazine.com/prod/designs/v1/assets/620x818/68699.jpg" alt="arte" />
              </div>
          </Col>
          <Col xm={24} sm={24} md={12} lg={14} xl={14} xxl={14}>
               <div>
                  <Space direction='vertical' style={{width:'100%'}}>  
                      <Title level={3}>Nombre de la obra</Title> 
                       <Title level={5}>Artista</Title>
                       <Text> Leonardo da Vinci </Text>        
                      <Title level={5}>Descripcion</Title>
                      <Text>El Retrato de Lisa Gherardini, esposa de Francesco del Giocondo,1​ más conocido como La Gioconda (La Joconde en francés) o La Mona Lisa, es una obra pictórica del polímata renacentista italiano Leonardo da Vinci. Fue adquirida por el rey Francisco I de Francia a comienzos del siglo XVI y desde entonces es propiedad del Estado francés. Se halla expuesta en el Museo del Louvre de París, siendo, sin duda, la «joya» de sus colecciones.

Su nombre, La Gioconda (la alegre, en castellano), deriva de la tesis más aceptada acerca de la identidad de la modelo: la esposa de Francesco Bartolomeo de Giocondo, que realmente se llamaba Lisa Gherardini, de donde viene su otro nombre: Mona (señora, en el italiano antiguo) Lisa. El Museo del Louvre acepta el título completo indicado al principio como el título original de la obra, aunque no reconoce la identidad de la modelo y tan solo la acepta como una hipótesis</Text>           
                    <Row gutter={[12,12]}> 
                      <Col span={12}>
                      <span><strong>Oferta actual</strong></span>
                      <Alert style={{padding:'4px 15px'}} type="success" message='mensaje'/>  
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
        </Row>
        </>
    )
}

export default DetailInformation;