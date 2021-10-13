import React, { Component } from 'react';
import { NewsFeed, Actions } from '../../helpers/request';
import Loading from '../loaders/loading';
import Moment from 'moment';
import EventContent from '../events/shared/content';
import EvenTable from '../events/shared/table';
import TableAction from '../events/shared/tableAction';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import axios from 'axios/index';
import ImageInput from '../shared/imageInput';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.event,
      list: [],
      data: {},
      id: '',
      deleteID: '',
      title: '',
      description_complete: '',
      linkYoutube: '',
      description_short: '',
      time: '',
      isLoading: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchItem();
  }

  changeImg = (files) => {
    const file = files[0];
    const url = '/api/files/upload',
      path = [],
      self = this;
    if (file) {
      this.setState({
        imageFile: file,
        event: { ...this.state.event, picture: null },
      });

      //envia el archivo de imagen como POST al API
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append('file', file);
        return Actions.post(url, data).then((image) => {
          if (image) path.push(image);
        });
      });

      //cuando todaslas promesas de envio de imagenes al servidor se completan
      axios.all(uploaders).then(() => {
        self.setState({
          event: {
            ...self.state.event,
            picture: path[0],
          },
          fileMsg: 'Imagen subida con exito',
          imageFile: null,
          path,
        });

        toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
      });
    } else {
      this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
    }
  };

  fetchItem = async () => {
    const data = await NewsFeed.byEvent(this.props.eventId);    
    this.setState({ list: data, loading: false });
  };


  onChange = () => {
    const titles = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const notice = document.getElementById('description_short').value;
    const time = document.getElementById('time').value;
    const linkYoutube = document.getElementById('linkYoutube').value;

    this.setState({
      title: titles,
      description_complete: desc,
      description_short: notice,
      time: time,
      linkYoutube: linkYoutube,
    });
  };

  newRole = () => {
    /*if (!this.state.list.find(({ _id }) => _id === 'new')) {
      this.setState((state) => {
        const list = state.list.concat({
          title: '',
          description_complete: '',
          description_short: '',
          linkYoutube: '',
          pricture: '',
          time: '',
          created_at: new Date(),
          _id: 'new',
        });
        return { list, id: 'new' };
      });
    }*/
    
    this.props.history.push(`/eventadmin/${this.props.eventId}/news/addnoticia`)
  };

  removeNewRole = () => {
    this.setState((state) => {
      const list = state.list.filter((item) => item._id !== 'new');
      return {
        list,
        id: '',
        title: '',
        description_complete: '',
        description_short: '',
        linkYoutube: '',
        picture: '',
        time: '',
      };
    });
  };

  saveRole = async () => {
    try {
      if (this.state.id !== 'new') {
        await NewsFeed.editOne(
          {
            title: this.state.title,
            description_complete: this.state.description_complete,
            description_short: this.state.description_short,
            linkYoutube: this.state.linkYoutube,
            picture: this.state.path,
            time: this.state.time,
          },
          this.state.id,
          this.props.eventId
        );
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.title = state.title;
              item.description_complete = state.description_complete;
              item.description_short = state.description_short;
              item.linkYoutube = state.linkYoutube;
              item.image = state.path;
              item.time = state.time;
              toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
              return item;
            } else return item;
          });
          return {
            list,
            id: '',
            title: '',
            description_complete: '',
            description_short: '',
            linkYoutube: '',
            time: '',
          };
        });
      } else {
        const newRole = await NewsFeed.create(
          {
            title: this.state.title,
            description_complete: this.state.description_complete,
            description_short: this.state.description_short,
            linkYoutube: this.state.linkYoutube,
            image: this.state.path,
            time: this.state.time,
          },
          this.props.eventId
        );
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.title = newRole.title;
              item.description_complete = newRole.description_complete;
              item.description_short = newRole.description_short;
              item.linkYoutube = newRole.linkYoutube;
              item.image = newRole.path;
              item.time = newRole.time;
              item.created_at = newRole.created_at;
              item._id = newRole._id;
              toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
              return item;
            } else return item;
          });
          return {
            list,
            id: '',
            title: '',
            description_complete: '',
            description_short: '',
            linkYoutube: '',
            time: '',
          };
        });
      }
    } catch (e) {
      e;
    }
  };

  editItem = (cert) =>{
    this.props.history.push(`/event/${this.props.eventId}/news/addnoticia/${cert._id}`)
  }
    
  

  removeItem = (id) => {
    alert(id)
    
    sweetAlert.twoButton(`Está seguro de borrar este espacio`, 'warning', true, 'Borrar', async (result) => {
      console.log("RESULT==>",result)
      try {
        if (result) {
          sweetAlert.showLoading('Espera (:', 'Borrando...');          
         let resp= await NewsFeed.deleteOne(this.props.eventId,id);
         console.log("RESPUESTA DELETE==>",resp)
          this.setState(() => ({
            id: '',
            title: '',
            description_complete: '',
            description_short: '',
            linkYoutube: '',
            picture: '',
            time: '',
          }));
          this.fetchItem();
          sweetAlert.hideLoading();
        }
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    });
  };

  goBack = () => this.props.history.goBack();

  render() {
    console.log(this.state.list)
    return (
      <React.Fragment>
        <div className='column is-12 is-desktop'>
          <EventContent
            title='Noticias'
            closeAction={this.goBack}
            description_complete={'Agregue o edite las Noticias que se muestran en la aplicación'}
            addAction={this.newRole}
            addTitle={'Nuevo espacio'}>
            {this.state.loading ? (
              <Loading />
            ) : (
              <EvenTable head={['Titulo', 'Fecha publicación','']} headStyle={[{"width":"300px"},{"width":"200px"}]} >
                {this.state.list.map((cert, key) => {
                  return (
                    <tr className='ant-table-row ant-table-row-level-0' key={key}>
                      <td className='ant-table-cell'>
                        {this.state.id === cert._id ? (
                          <input
                            className='input is-small'
                            type='text'
                            id='title'
                            value={this.state.title}
                            onChange={this.onChange}
                          />
                        ) : (
                          <p>{cert.title}</p>
                        )}
                      </td>                 
                      <td className='ant-table-cell'>
                        {this.state.id === cert._id ? (
                          <input
                            className='input is-small'
                            type='date'
                            id='time'
                            value={this.state.time}
                            onChange={this.onChange}
                          />
                        ) : (
                          <p>{cert.time}</p>
                        )}
                      </td>                     
                     {/* <td>
                        {this.state.id === cert._id ? (
                          <div className='column is-5'>
                            <ImageInput
                              picture={this.state.picture}
                              imageFile={this.state.imageFile}
                              divClass={'drop-img'}
                              content={<img src={this.state.picture} alt={'Imagen Perfil'} />}
                              classDrop={'dropzone'}
                              contentDrop={
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                  className={`button is-primary is-inverted is-outlined ${
                                    this.state.imageFile ? 'is-loading' : ''
                                  }`}>
                                  Cambiar foto
                                </button>
                              }
                              contentZone={
                                <div className='has-text-grey has-text-weight-bold has-text-centered'>
                                  <span>Subir foto</span>
                                  <br />
                                  <small>(Tamaño recomendado: 1280px x 960px)</small>
                                </div>
                              }
                              changeImg={this.changeImg}
                              errImg={this.state.errImg}
                              style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                height: '50%',
                                width: '40%',
                                borderWidth: 2,
                                borderColor: '#b5b5b5',
                                borderStyle: 'dashed',
                                borderRadius: 10,
                              }}
                            />
                            {this.state.fileMsg && <p className='help is-success'>{this.state.fileMsg}</p>}
                          </div>
                        ) : (
                          <p>{cert.picture ? 'Imagen Registrada' : 'No hay ninguna imagen Guardada'}</p>
                        )}
                      </td>*/}
                   
                      <TableAction
                        id={this.state.id}
                        object={cert}
                        saveItem={this.saveRole}
                        editItem={this.editItem}
                        removeNew={this.removeNewRole}
                        removeItem={this.removeItem}
                        discardChanges={this.discardChanges}
                      />
                    </tr>
                  );
                })}
              </EvenTable>
            )}
          </EventContent>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(News);
