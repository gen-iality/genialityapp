import React, { Component, useState } from 'react';
import { FaqsApi } from '../../helpers/request';
import { toolbarEditor } from '../../helpers/constants';
import ReactQuill from 'react-quill';
import Loading from '../loaders/loading';
import Moment from 'moment';
import EventContent from '../events/shared/content';
import EvenTable from '../events/shared/table';
import TableAction from '../events/shared/tableAction';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

/* Componente controlado tipo Input, todo esto para no pasar parametros usando arrow functions 
requiere:
@name nombre del campo
@valor valor del campo
@handleInputChange función que va a atender los cambios
*/
const ControlledInput = (props) => {
  const [value, setValue] = useState(props.value || '');
  const [name] = useState(props.name || 'generic');

  const handleInputChange = (e) => {
    let valor = e.target.value;
    setValue(valor);
    props.handleInputChange(valor, props.name);
  };

  return <input type='text' id={name || 'generic'} value={value} onChange={handleInputChange} />;
};

class Faqs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.event,
      list: [],
      data: {},
      id: '',
      deleteID: '',
      title: '',
      content: '',
      isLoading: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.getFaqs();
  }

  getFaqs = async () => {
    const data = await FaqsApi.byEvent(this.props.eventId);
    this.setState({ list: data, loading: false });
  };

  handleInputChange = (value) => {
    this.setState({ title: value });
  };

  HandleQuillEditorChange = (contents) => this.setState({ content: contents });

  newFaqs = () => {
    if (!this.state.list.find(({ _id }) => _id === 'new')) {
      this.setState((state) => {
        const list = state.list.concat({ title: '', content: '', _id: 'new' });
        return { list, id: 'new' };
      });
    }
  };

  removeFaqs = () => {
    this.setState((state) => {
      const list = state.list.filter((item) => item._id !== 'new');
      return { list, id: '', title: '', content: '' };
    });
  };

  saveFaqs = async () => {
    try {
      if (this.state.id !== 'new') {
        await FaqsApi.editOne(
          { title: this.state.title, content: this.state.content },
          this.state.id,
          this.props.eventId
        );
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.title = state.title;
              item.content = state.content;
              toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
              return item;
            } else return item;
          });
          return { list, id: '', title: '', content: '' };
        });
      } else {
        const newFaqs = await FaqsApi.create(
          { title: this.state.title, content: this.state.content },
          this.props.eventId
        );
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.title = newFaqs.title;
              item.content = newFaqs.content;
              item.created_at = newFaqs.created_at;
              item._id = newFaqs._id;
              toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
              return item;
            } else return item;
          });
          return { list, id: '', title: '', content: '' };
        });
      }
    } catch (e) {
      e;
    }
  };

  editFaqs = (cert) => this.setState({ id: cert._id, title: cert.title, content: cert.content });

  removeFaqs = (id) => {
    sweetAlert.twoButton(`Está seguro de borrar este espacio`, 'warning', true, 'Borrar', async (result) => {
      try {
        if (result.value) {
          sweetAlert.showLoading('Espera (:', 'Borrando...');
          await FaqsApi.deleteOne(id, this.props.eventId);
          this.setState(() => ({ id: '', title: '', content: '' }));
          this.getFaqs();
          sweetAlert.hideLoading();
        }
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className='column is-12'>
          <EventContent
            title='Preguntas Frecuentes'
            description_complete={'Agregue o edite las Preguntas Frecuentes que se muestran en la aplicación'}
            addAction={this.newFaqs}
            addTitle={'Nueva Pregunta'}>
            {this.state.loading ? (
              <Loading />
            ) : (
              <EvenTable head={['Titulo', 'Contenido', '']}>
                {this.state.list.map((cert, key) => {
                  return (
                    <tr key={key}>
                      <td>
                        {this.state.id === cert._id ? (
                          <ControlledInput
                            name='title'
                            value={this.state.title}
                            handleInputChange={this.handleInputChange}
                          />
                        ) : (
                          <p>{cert.title}</p>
                        )}
                      </td>

                      <td>
                        {this.state.id === cert._id ? (
                          <ReactQuill
                            id='desc'
                            value={this.state.content}
                            modules={toolbarEditor}
                            onChange={this.HandleQuillEditorChange}
                          />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: cert.content }} />
                        )}
                      </td>

                      <td>{Moment(cert.created_at).format('DD/MM/YYYY')}</td>
                      <TableAction
                        id={this.state.id}
                        object={cert}
                        saveItem={this.saveFaqs}
                        editItem={this.editFaqs}
                        removeNew={this.removeFaqs}
                        removeItem={this.removeFaqs}
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

export default Faqs;
