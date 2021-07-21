import React, { Component, Fragment } from 'react';
import { Alert, Button, Card, Col, Input, Row, Space } from 'antd';
import withContext from '../../../Context/withContext';
import { EventsApi } from '../../../helpers/request';
import {  SettingOutlined, WarningOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import Modal from 'antd/lib/modal/Modal';
import { connect } from 'react-redux';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import { withRouter } from 'react-router';

class InformativeSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markup: '',
      informativeSection: null,
      galeries: [],
      isModalVisible:false,
      selectedGalery:null,
      value_oferta:null,
      valueoff:false,
      isModalVisibleRegister:false
    };
  }

  componentDidMount() {
    this.props.setVirtualConference(false)
    console.log(this.props)
    this.setState({
      informativeSection: this.props.cEvent.value.itemsMenu.informativeSection,
      markup: this.props.cEvent.value.itemsMenu.informativeSection.markup,
    });
    //OBTENER GALERIA
    EventsApi.getGallery(this.props.cEvent.value._id).then((resp) => {
      console.log('GALERIA');
      console.log(resp.data);
      if (resp && resp.data) {
        this.setState({
          galeries: resp.data,
        });
      }
    });
  }

  componentWillUnmount(){
    this.props.setVirtualConference(true)
  }

  showModal = () => {
   console.log( this.state.selectedGalery?.price)
   console.log(this.state.value_oferta) 
   console.log(this.inputOferta)      
    this.setState({     
      isModalVisible:true
    },);
    
  };
  // CUANDO SE OFRECE UN PRODUCTO
  handleOk = async () => { 
    //validación para campo oferta vacío  
    if(this.state.value_oferta===null || this.state.value_oferta===""){
      this.setState({
        valueoff:true
      })     
      return false;
      //validación para oferta mayor al precio base
    }else if(this.state.value_oferta!==null || this.state.value_oferta!==""){
      if ( parseFloat(this.state.value_oferta)<this.state.selectedGalery.price){
        this.setState({
          valueoff:true
        }) 
        return false;
      }else{
        //gestionar y guardar valor de oferta
        let items=this.state.galeries;
        let newPuja={...this.state.selectedGalery,price:this.state.value_oferta}
        let newItems=items.map((item)=>{if(item._id===this.state.selectedGalery._id){return newPuja}else{return item}})
        let oferta={valueOffered:parseFloat(this.state.value_oferta)}
        let resp=await EventsApi.storeGalley(this.props.cEvent.value._id,this.state.selectedGalery._id,oferta);
        console.log("RESPUESTA OFERTA")
        console.log(resp)
        this.inputOferta.value = "";        
        this.setState({         
          valueoff:false,
          galeries:newItems,
          value_oferta:null,
          selectedGalery:null,
          isModalVisible:false,
        })
      }    
    }    
  };
  //ir a registrar usuario
  registerUser=()=>{
    this.props.history.push(`/landing/${this.props.cEvent.value._id}/tickets`)
  }
  //Cerrar modal
  handleCancel = () => {
    this.setState({
      isModalVisible:false
    })
  };
  onChangeValue=(e)=> { 
    this.setState({
      value_oferta:e.target.value
     })    
  }

  pujar=(articulo)=>{    
    this.setState({
      value_oferta:articulo.price,
      selectedGalery:articulo,      
    },()=>this.showModal())
  }
  render() {
    const { markup, informativeSection } = this.state;
    return (
      <Fragment>
        {informativeSection !== null && (
          <div className='site-card-border-less-wrapper' style={{ marginTop: 35 }}>
            <Card
              title={informativeSection.name || 'clasificación'}
              bordered={false}
              style={{ width: 1000, margin: 'auto' }}>
              {this.props.cEvent.value._id === '60797bfb2a9cc06ce973a1f4' && (
                <>
                  <p>
                    Llega el momento que tanto hemos esperado 😃 Inscribite al #IIITorneodeAjedrezdelCaribeALaRuedaRueda
                    ♟️ del 15 de mayo al 30 de junio a través de www.fundacionalaruedarueda.org. Te invitamos a que te
                    conectes a nuestras redes sociales 🤳🏽 para conocer más información 🤓. ¡No te lo pierdas!
                    #AjedrezDesdeElCaribeParaColombia
                  </p>
                  <a
                    href='https://www.chesskid.com/es/login'
                    target='_blank'
                    rel='noreferrer'
                    className='ant-btn ant-btn-primary'
                    style={{ width: 180 }}>
                    Inscríbete
                  </a>
                </>
              )}
              {/*markup && Parser(markup)*/}
            </Card>
            
            <Row className='site-card-border-less-wrapper' style={{ width:'67vw',margin:'auto'}}>
            {this.state.galeries.length > 0 ? 
            <Row key={'container'}>
            {this.state.galeries.map((galery)=>
               <Card           
               key={"Cardgallery"+galery.id}
               style={{ marginLeft:20, width: 300,marginBottom:20,marginRight:20 }}
               cover={<img alt='example' src={galery.image} />}
               actions={[
                <div key={'act-'+galery.id}>$ {galery.price}</div>,
                 <div onClick={()=>this.props.cUser.value?this.pujar(galery):this.setState({isModalVisibleRegister:true})}  key={'act2-'+galery.id} ><SettingOutlined key='setting' /> Pujar</div>              
               ]}>
               <Meta               
                 title={galery.name}
                 description={galery.description}
               />
             </Card>)}
                <Modal okText='Ofrecer' cancelText='Cancelar' centered title={this.state.selectedGalery!=null && this.state.selectedGalery.name} visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                 <Row >
                   <Col span={16}>
                    <img src={this.state.selectedGalery!=null && this.state.selectedGalery.image}></img>
                    <Space align="end">            
                      <span className="mock-block">{this.state.selectedGalery!=null && <span><strong>Descripción: </strong> {this.state.selectedGalery.description}</span>}</span>
                    </Space>                 
                 </Col>
                 <Col span={8}>
                   <span><strong>Oferta actual</strong></span>
                   <Alert style={{marginBottom:30}} type="success" message={this.state.selectedGalery!=null && '$ '+this.state.selectedGalery.price} />
                   <span ><strong>Valor a ofrecer</strong></span>
                   <Input ref={el => this.inputOferta = el} type='number' style={{width:'100%'}} min={this.state.selectedGalery!==null && this.state.selectedGalery.price } max={99999999} value={this.state.value_oferta!==null && this.state.value_oferta } onChange={this.onChangeValue} />
                   {this.state.valueoff && <span style={{color:'red',fontSize:8}}>Valor a ofrecer incorrecto</span>}
                 </Col>
                 </Row>
                </Modal>

                <Modal okText='Registrarme' cancelText='Cancelar' centered title={"Iniciar sesión"} visible={this.state.isModalVisibleRegister} onOk={this.registerUser} onCancel={()=>this.setState({isModalVisibleRegister:false})}>
                 <Row justify={'center'}>
                 <WarningOutlined style={{ fontSize: '80px', color: '#08c',marginBottom:'20px' }}/>
                 </Row>
                 <Row justify='center'>               
                 <Col gutter={10}>
                     <p>Para poder realizar una oferta a este producto debes <strong>iniciar sesión</strong> ó  <strong>registrarte</strong></p>
                 </Col>
                 </Row>                 
                </Modal>
                </Row>
            : (
              <div>Aún no existen artículos en la galería</div>
            )}
            </Row>
          </div>
        )}
      </Fragment>
    );
  }
}
const mapDispatchToProps = {
  setVirtualConference
};

let InformativeSection2WithContext = connect(null,mapDispatchToProps)(withContext(withRouter( InformativeSection)));
export default InformativeSection2WithContext;
