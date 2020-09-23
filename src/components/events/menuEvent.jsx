import React from "react";
import WithLoading from "./../shared/withLoading";
import { Menu,Spin } from "antd";

//Se importan todos los iconos a  un Objeto para llamarlos dinámicamente
import * as iconComponents from "@ant-design/icons";
import { Component } from "react";
import * as Cookie from "js-cookie";


const stylesMenuItems = {
  height: "100%",
  padding: "30px 0",
  backgroundColor: "transparent",
}

class MenuEvent extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      isEnabledLogin: true,
      loading:false,
      itemsMenu: this.props.itemsMenu ? this.props.itemsMenu : this.menuDefault,
      user: null,
      showSection: this.props.showSection,
      logged: false,
      email: false,
      section: 'evento'     
    }
    this.menuDefault = {
      evento: {
        name: "Evento",
        section: "evento",
        icon: "CalendarOutlined",
        checked: false,
        permissions: "public"
      },
      agenda: {
        name: "Agenda",
        section: "agenda",
        icon: "ReadOutlined",
        checked: false,
        permissions: "public"
      },
      speakers: {
        name: "Conferencistas",
        section: "speakers",
        icon: "AudioOutlined",
        checked: false,
        permissions: "public"
      },
      tickets: {
        name: "Boletería",
        section: "tickets",
        icon: "CreditCardOutlined",
        checked: false,
        permissions: "public"
      },
      certs: {
        name: "Certificados",
        section: "certs",
        icon: "FileDoneOutlined",
        checked: false,
        permissions: "public"
      },
      documents: {
        name: "Documentos",
        section: "documents",
        icon: "FolderOutlined",
        checked: false,
        permissions: "public"
      },
      wall: {
        name: "Muro",
        section: "wall",
        icon: "TeamOutlined",
        checked: false,
        permissions: "public"
      },
      survey: {
        name: "Encuestas",
        section: "survey",
        icon: "FileUnknownOutlined",
        checked: false,
        permissions: "public"
      },
      faqs: {
        name: "Preguntas Frecuentes",
        section: "faqs",
        icon: "QuestionOutlined",
        checked: false,
        permissions: "public"
      },
      networking: {
        name: "Networking",
        section: "networking",
        icon: "LaptopOutlined",
        checked: false,
        permissions: "public"
      },        
      my_section: {
        name: "Seccion Personalizada",
        section: "my_section",
        icon: "EnterOutlined",
        checked: false,
        permissions: "public"
      },
      companies: {
        name: "Empresas",
        section: "companies",
        icon: "ApartmentOutlined", // ApartmentOutlined
        checked: false,
        permissions: "public"
      },
      interviews: {
        name: "Vende / Mi agenda",
        section: "interviews",
        icon: "UserOutlined",
        checked: false,
        permissions: "public"
      }
    }    
  }

  async componentDidMount () {

    const isExistCookie = Cookie.get('evius_token');

    if(isExistCookie){
      this.setState({isEnabledLogin: false})
    }

    if ( this.props.user ) {
      this.setState( { user: this.props.user } )
    }

    this.setState({ loading:true});
    
    await this.handleInitialSection()
    
    this.setState({ loading:false});   
    
    this.state.showSection(this.state.section)
    
}
  
handleInitialSection(){
  let itemsMenu = this.state.itemsMenu || {}

  itemsMenu = Object.keys(itemsMenu).map((key)=>{
    
    if ( ( this.state.itemsMenu[ key ] && this.state.itemsMenu[ key ].permissions == "assistants" ) && !this.state.user ) { return null; }
    
    return this.state.itemsMenu[ key ].section
  })
  
  const initialSection = itemsMenu.filter(item => item !== null)
  this.setState({section: initialSection[0]})    
  
}
  
  
  async componentDidUpdate (prevProps, prevState) {
    
    if ( this.props.user && !this.state.user ) {
      this.setState( { user: this.props.user } )
    }
    if(prevState.section !== this.state.section){
      this.handleInitialSection()
    }   
    
  } 


    render () {
    const { loading } = this.state
    return (
      <Menu
        mode="inline"
        // theme="dark"
        defaultSelectedKeys={ [ "1" ] }
       // defaultOpenKeys={['sub1']}
        style={stylesMenuItems}
        >       

        { loading &&(<div className="columns is-centered"><Spin tip="Cargando Menú..."></Spin></div>)}
        {this.state.itemsMenu && Object.keys(this.state.itemsMenu).map((key)=>{
          if ( ( this.state.itemsMenu[ key ] && this.state.itemsMenu[ key ].permissions == "assistants" ) && !this.state.user ) {
            return null; 
          }

          if(this.state.itemsMenu[ key ].section === 'login' && !this.state.isEnabledLogin){
            return null; 
          }

          let IconoComponente = iconComponents[ this.state.itemsMenu[ key ].icon ];
          return (
            <Menu.Item key={ this.state.itemsMenu[ key ].section } onClick={ () => this.state.showSection( this.state.itemsMenu[ key ].section ) }>
              <IconoComponente />
              <span> { this.state.itemsMenu[ key ].name }</span>
        </Menu.Item>
      );
    })}        
      </Menu>
    );
  }

}

export default WithLoading( MenuEvent );
