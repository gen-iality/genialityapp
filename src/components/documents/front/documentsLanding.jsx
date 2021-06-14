import { notification } from 'antd';
import React, { Component } from 'react';

//custom
import { getFiles } from '../services';

import { Col, Card, Result } from 'antd';

import Loading from '../../loaders/loading';

import DocumentsList from '../documentsList';
import { DocumentsApi } from '../../../helpers/request';

// Estructura de boton para descargar documentos

// const IconText = ({ icon, text, onSubmit }) => (
//     <Button
//         htmlType="submit"
//         type="link"
//         href={onSubmit}
//         target="_blank"
//     >

//         {React.createElement(icon, { style: { marginRight: 8 } })}
//         {text}
//     </Button>
// );

class documentsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      loading: true,
      category_id: null,
      previewImage: '',
      data: [],
      folders: []
    };
  }

  async componentDidMount() {
    let { documents } = this.state;
    let data = [];

    try {
      let eventId = this.props.event?._id;
      let folders = await DocumentsApi.getAll(eventId);
      documents = await getFiles(eventId);

      this.setState({
        folders: folders.data
      });

      //Se itera para poder pasar un array al componente List de ant
      for (const document in documents) {
        data.push(documents[document]);
      }

      this.setState({ data }, this.removeLoader);
    } catch (error) {
      console.error(error);

      notification.error({
        message: 'Error',
        description: 'Ha ocurrido un error obteniendo los documentos'
      });
    }
  }

  removeLoader = () => {
    this.setState({ loading: false });
  };

  render() {
    const { data, loading, folders } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <>
        <Col xs={24} sm={20} md={20} lg={20} xl={20} style={{ margin: '0 auto' }}>
          {folders && folders.length > 0 && <DocumentsList data={folders} files={data} />}

          {(!folders || !folders.length) && (
            <div className='site-card-border-less-wrapper'>
              <Card title='' bordered={false}>
                <Result title='Aún no se han agregado archivos.' />
              </Card>
            </div>
          )}
        </Col>
      </>
    );
  }
}

export default documentsDetail;
