import React, { Component } from 'react';
import { icon } from '../../../../helpers/constants';
import { Actions } from '../../../../helpers/request';
import ImageInput from '../../imageInput';
import axios from 'axios/index';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import EditorHtml from './editorHtml';

class ModalCrud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValid: false,
      edit: false,
      formErrors: { email: '', name: '' },
      message: {},
      modalFields: [],
      newInfo: {},
      speaker: '',
      picture: null
    };
    this.estadoEditar = {};
    this.submitForm = this.submitForm.bind(this);
    this.handleChangeHtmlEditor = this.handleChangeHtmlEditor.bind(this);
    // this.currentDay= this.currentDay.bind(this)
  }

  componentDidMount() {
    //
    // this.refsEditor.current.focus();
    const fields = this.props.info.fieldsModal;
    this.setState({ modalFields: fields });
    let newInfo = {};
    /*
     * This is to create keys inside newInfo object and avoid uncontrolled input error
     */
    fields.map(
      (info) =>
        //cargamos la informacion en caso de que la queramos actualizar en el modal
        (newInfo[info.name] = this.props.itemInfo[info.name] || '')
    );
    this.setState({ newInfo, edit: false });
  }

  /*
   * This method is for save information from popup
   */
  async submitForm(e) {
    e.preventDefault();
    e.stopPropagation();
    const formData = this.state.newInfo;

    this.props.hideModal();

    let message = {};
    this.setState({ create: true });
    try {
      // let resp = await UsersApi.createOne(snap,this.props.eventId);

      let informacionEditar = Object.keys(this.props.itemInfo).length;
      const resp =
        informacionEditar < 1
          ? await Actions.create(this.props.config.ListCrud.urls.create(this.props.enventInfo._id), formData)
          : await Actions.edit(
              this.props.config.ListCrud.urls.edit(this.props.enventInfo._id),
              formData,
              this.props.itemInfo._id
            );
      // this.setState({newInfo: {}})
      this.props.updateTable();

      // let resp = "Testing";
      if (resp.message === 'OK') {
        this.props.addToList(resp.data);
        message.class = resp.status === 'CREATED' ? 'msg_success' : 'msg_warning';
        message.content = 'Speaker ' + resp.status;
      } else {
        message.class = 'msg_danger';
        message.content = 'Document can`t be created';
      }
      setTimeout(() => {
        message.class = message.content = '';
        this.props.hideModal();
      }, 1000);
    } catch (err) {
      message.class = 'msg_error';
      message.content = 'ERROR...TRYING LATER';
    }
    this.setState({ message, create: false });
  }

  handleChange = (e, type) => {
    const { value, name } = e.target;

    // return
    this.setState(
      { newInfo: { ...this.state.newInfo, [name]: value } },
      this.props.validForm(this.state.modalFields, this.state.newInfo)
    );
  };
  handleChangeHtmlEditor = (name, value) => {
    // this.estadoEditar = this.state.newInfo
    this.setState(
      { newInfo: { ...this.state.newInfo, [name]: value } },
      this.props.validForm(this.state.modalFields, this.state.newInfo)
    );
  };

  renderForm = () => {
    let formUI = this.state.modalFields.map((data, key) => {
      let type = data.type || 'text';
      let name = data.name;
      let label = data.label;
      let mandatory = data.mandatory;
      let target = name;
      let value = this.state.newInfo[target];
      let input = '';

      //    let input =  <input {...props}
      //                     className="input"
      //                     type={type}
      //                     key={key}
      //                     name={name}
      //                     value={value || ''}
      //                     onChange={value => this.handleChange(value, type)}
      // />;
      if (type === 'boolean') {
        input = (
          <React.Fragment>
            <input
              name={name}
              id={name}
              className='is-checkradio is-primary is-rtl'
              type='checkbox'
              // checked={value}
              onChange={(e) => {
                this.onChange(e, type);
              }}
            />
            <label className={`label has-text-grey-light is-capitalized ${mandatory ? 'required' : ''}`} htmlFor={name}>
              {name}
            </label>
          </React.Fragment>
        );
      }
      if (type === 'date') {
        input = (
          <React.Fragment>
            <input
              name={name}
              id={name}
              className='is-checkradio is-primary is-rtl'
              type='date'
              min='2018-01-15'
              value={value || ''}
              onChange={(e) => {
                this.handleChange(e, type);
              }}
            />
          </React.Fragment>
        );
      }
      if (type === 'time') {
        input = (
          <React.Fragment>
            <input
              name={name}
              id={name}
              className='is-checkradio is-primary is-rtl'
              type='time'
              value={value || ''}
              onChange={(e) => {
                this.handleChange(e, type);
              }}
            />
          </React.Fragment>
        );
      }
      if (type === 'text') {
        input = (
          <React.Fragment>
            <input
              name={name}
              id={name}
              className='is-checkradio is-primary is-rtl'
              type='text'
              value={value || ''}
              onChange={(e) => {
                this.handleChange(e, type);
              }}
            />
          </React.Fragment>
        );
      }
      if (type === 'htmlEditor') {
        input = (
          <EditorHtml
            name={name}
            value={value || ''}
            dataEditor={this.state.newInfo[name]}
            handleChangeHtmlEditor={this.handleChangeHtmlEditor}
          />
        );
        //    <Editor
        //    ref={this.refsEditor}
        //    editorState={editorState}
        //    onChange={this.onChange} />
        //    <CKEditor
        //        editor={ ClassicEditor }
        //        data="<p></p>"
        //        onChange={ ( event, editor ) => {
        //            const data = editor.getData();
        //            this.handleChange({e:{target:{name:'description ',value:data}}}, type)
        //        } }
        //    />
        //     <React.Fragment>
        //     <CKEditor
        //     editor={ ClassicEditor }
        //     data="<p></p>"

        //     onChange={ ( event, editor ) => {
        //         const data = editor.getData();
        //      alert('djj')
        //         // this.handleChangeHtmlEditor(name, data)
        //     } }
        // />
        //  </React.Fragment>
      }

      // if (type == "list") {
      //     input = data.options.map((o,key) => {
      //         return (<option key={key} value={o.value}>{o.value}</option>);
      //     });
      //     input = <div className="select">
      //         <select name={name}  onChange={(e)=>{this.onChange(e, type)}}>
      //             <option value={""}>Seleccione...</option>
      //             {input}
      //         </select>
      //     </div>;
      // }
      return (
        <div key={'g' + key} className='field'>
          {data.type !== 'boolean' && data.type !== 'image' && (
            <label
              className={`label has-text-grey-light is-capitalized ${mandatory ? 'required' : ''}`}
              key={'l' + key}
              htmlFor={key}>
              {label}
            </label>
          )}
          {data.type !== 'image' && <div className='control'>{input}</div>}
        </div>
      );
    });
    return formUI;
  };

  changeImg = (files) => {
    const file = files[0];
    const url = '/api/files/upload',
      path = [];
    if (file) {
      this.setState({ imageFile: file, picture: null });
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append('file', file);
        return Actions.post(url, data).then((image) => {
          if (image) path.push(image);
        });
      });
      axios.all(uploaders).then((data) => {
        this.setState({
          newInfo: { ...this.state.newInfo, picture: path[0] },
          fileMsg: 'Imagen subida con exito',
          imageFile: null,
          path
        });
        toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
      });
    } else {
      this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className={`modal modal-add-user ${this.props.modal ? 'is-active' : ''}`}>
          <div className='modal-background' />

          <div className='modal-card'>
            <header className='modal-card-head'>
              <div className='modal-card-title'>
                <div className='icon-header' dangerouslySetInnerHTML={{ __html: icon }} />
              </div>
              <button className='delete' aria-label='close' onClick={this.props.hideModal} />
            </header>
            <section className='modal-card-body'>
              <div className='modal-card-body-img'>
                <ImageInput
                  picture={this.state.speaker.picture}
                  imageFile={this.state.imageFile}
                  divClass={'rsvp-pic-img'}
                  content={<img src={this.state.speaker.image} alt={'Imagen Speaker'} />}
                  classDrop={'dropzone'}
                  contentDrop={
                    <button
                      className={`button is-primary is-inverted is-outlined ${
                        this.state.imageFile ? 'is-loading' : ''
                      }`}>
                      Cambiar foto
                    </button>
                  }
                  contentZone={
                    this.state.newInfo.picture ? (
                      <img src={this.state.newInfo.picture} alt='Pic' />
                    ) : (
                      <div>Subir foto</div>
                    )
                  }
                  changeImg={this.changeImg}
                  errImg={this.state.errImg}
                />
              </div>
              {this.renderForm()}
            </section>
            {
              <footer className='modal-card-foot'>
                {this.state.create ? (
                  <div>Guardando...</div>
                ) : (
                  <div className='modal-buttons'>
                    <button className='button is-primary' onClick={this.submitForm} disabled={this.props.validInfo}>
                      Guardar
                    </button>
                    {this.state.edit && (
                      <React.Fragment>
                        <button
                          className='button'
                          onClick={(e) => {
                            this.setState({ deleteModal: true });
                          }}>
                          Eliminar
                        </button>
                      </React.Fragment>
                    )}
                    <button className='button' onClick={this.props.hideModal}>
                      Cancelar
                    </button>
                  </div>
                )}
                <div className={'msg'}>
                  <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p>
                </div>
              </footer>
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ModalCrud;
