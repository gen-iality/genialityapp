import React, { Component, Fragment } from 'react';
import { Button, Card } from 'antd';
import Parser from 'html-react-parser';
import { SearchOutlined } from '@ant-design/icons';

class InformativeSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markup: '',
      informativeSection: null
    };
  }

  componentDidMount() {
    this.setState({
      informativeSection: this.props.event.itemsMenu.informativeSection,
      markup: this.props.event.itemsMenu.informativeSection.markup
    });
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
              {this.props.event._id === '60797bfb2a9cc06ce973a1f4' && (
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
              {markup && Parser(markup)}
            </Card>
          </div>
        )}
      </Fragment>
    );
  }
}

export default InformativeSection;
