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
                                <Row gutter={[12, 12]}>
                                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                        <div className="imagen">
                                          <Title level={3}>1 primer lugar en las 5 categorías:</Title>
                                          <h1>Smartwatch</h1>
                                          <img onClick={() => this.onChangePage("agenda")} style={{cursor:'pointer'}} src="https://cdn.businessinsider.es/sites/navi.axelspringer.es/public/styles/1200/public/media/image/2019/12/amazfit-gts-smartwatch.jpg?itok=e08amQZS" />
                                        </div>
                                   </Col>
                                   <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                        <div className="imagen">
                                          <Title level={3}>2 segundo lugar en las 5 categorías:</Title>
                                          <h1>parlante Google Home Mini</h1>
                                          <img onClick={() => this.onChangePage("agenda")} style={{cursor:'pointer'}} src="https://media.aws.alkosto.com/media/catalog/product/cache/6/image/69ace863370f34bdf190e4e164b6e123/e/a/ean_193575003306_caja_home_mini_2.png" />
                                        </div>
                                   </Col>
                                   <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                        <div className="imagen">
                                          <Title level={3}>3 tercer lugar en las 5 categorías:</Title>
                                          <h1>Mobile Power Bank</h1>
                                          <img onClick={() => this.onChangePage("agenda")} style={{cursor:'pointer'}} src="https://www.sicos.es/wp-content/uploads/2019/11/cq5dam.web_.1000.1000-2-1.jpeg" />
                                        </div>
                                   </Col>                                        
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