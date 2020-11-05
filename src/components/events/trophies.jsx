import React,{Component,Fragment} from "react"
import { Row, Col, Typography } from 'antd';

class Trophies extends Component{
    render(){
        const { Title } = Typography;
        const { event } = this.props
        return(
            <Fragment>
               {
                    event._id === "5f4e41d5eae9886d464c6bf4" ? (
                        <div>
                            <div className="containerGaming" style={{backgroundColor:"white", padding:"2%"}}>
                            <Row align="middle"><Title>¿Cuáles son los premios del Torneo?</Title></Row> 
                                <Row gutter={[12, 12]} align="middle">
                                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                        <div className="imagen">
                                          <Title level={3}>1 primer lugar en las 5 categorías:</Title>
                                          <h1>Smartwatch</h1>
                                          <img style={{cursor:'pointer'}} alt="primer lugar" src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/image1.jpg?alt=media&token=1c8eef7b-7ad2-4dc6-b34a-59502529b44a" />
                                        </div>
                                   </Col>
                                   <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                        <div className="imagen">
                                          <Title level={3}>2 segundo lugar en las 5 categorías:</Title>
                                          <h1>parlante Google Home Mini</h1>
                                          <img style={{cursor:'pointer'}} alt="segundo lugar" src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/image2.jpg?alt=media&token=8e488dea-24e5-4419-bd13-6d906dd1ef50" />
                                        </div>
                                   </Col>
                                   <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                        <div className="imagen">
                                          <Title level={3}>3 tercer lugar en las 5 categorías:</Title>
                                          <h1>Power bank de 5,000 mah, texturizada</h1>
                                          <img  style={{cursor:'pointer', height: "389px"}} alt="tercer lugar" src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/imagePowerBank.jpg?alt=media&token=d97429d1-a938-4286-9778-6c393c73c5cb" />
                                        </div>
                                   </Col> 
                                   <Col span={24}><h1>Los premios serán entregados en un plazo máximo de 5 días después de la final del torneo</h1></Col>                                       
                                </Row>
                                </div>
                            </div>
                            ) : (<div></div>)
                }
            </Fragment>
        )
    }
}

export default Trophies