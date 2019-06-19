import React, {Component} from 'react';
import Dropzone from "react-dropzone";
import MediumEditor from 'medium-editor'
import '../editor.scss'

class EditarHtml extends Component {
    constructor(props){
        super(props);
        this.state = {
            html:'',
            video:'',
            active:'title',
            content:[],
            index:0,
            graf:0,
            showTooltipMenu:false,
            isActive:true,
            topButton:78
        };
        this.editor = [];
    }

    componentDidMount() {
        const line = <div className={`graf editable0`} ref={e=>this['content0']=e} onKeyDown={this.keyDownContent}></div>;
        this.setState(prevState=>{
            return {content:[...prevState.content,line]}
        },()=>{
            this.editor.push(new MediumEditor(`.editable0`,{toolbar:{buttons:['bold','italic','underline','anchor']}}));
            this['content0'].focus()
        })

    }
    //Cambio en el input
    emitChange=(e)=>{
        const {value,name} = e.target;
        if (value !== this.lastValue) {
            this.setState({[name]:value});
        }
        this.lastValue = value;
    };

    //Esuchcar tecla, si es enter y no hay bloques crea un nuevo bloque, si hay focusea el primero
    keyDownTitle = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if(this.state.content.length>0){
                document.querySelector(`.editable${this.state.n}`).focus();
                this.setState({isActive:true})
            }else{
                this.newLine();
            }
        }
    };
    //Escucha tecla, si es enter crea un nuevo bloque
    //Si borra, se revisa que esté vació, si lo está lo remueve y focusea el bloque anterior, sino está vació aparece boton
    keyDownContent = (e) => {
        this.setState({isActive:false});
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            this.newLine();
        }else if(e.key === 'Backspace'){
            const value = e.target.innerHTML;
            const splitted = value.split('<p>').pop().split('</p>');
            if(value === '<p><br></p>'){
                this.removeLine()
            }else if(splitted[0].length === 1){
                this.setState({isActive:true})
            }
        }
    };
    //Escucha tecla, si es enter reemplaza el input por iframe con el video
    //Si borra, elimina el iframe del arreglo y focusea el item anterior
    keyDownVideo = (e) => {
        if (e.key === 'Enter') {
            const content = [...this.state.content];
            content[this.state.index] = <iframe width="420" height="315" ref={el=>this[`content${this.state.index}`]=el} src={this.state.video} tabIndex={0}></iframe>;
            this.setState({content},()=>{
                this.newLine(true)
            });
            e.preventDefault();
            e.stopPropagation();
        }
        else if(e.key === 'Backspace'){
            const content = [...this.state.content];
            content.splice(this.state.index,1);
            this.setState((prevState)=>{
                return {content,topButton:prevState.topButton-62,index:prevState.index-1,isActive:true}
            },()=>{
                if(content.length>0){
                    this[`content${this.state.index}`].focus();
                }else{
                    document.querySelector(`.contentEditable`).focus()
                }
            })
            e.preventDefault();
            e.stopPropagation();
        }
    };
    keyDownImage = (e) => {
        if (e.key === 'Enter') {
            this.newLine();
            e.preventDefault();
            e.stopPropagation();
        }
        else if(e.key === 'Backspace'){
            const content = [...this.state.content];
            content.splice(this.state.index,1);
            this.setState((prevState)=>{
                return {content,topButton:prevState.topButton-62,index:prevState.index-1,isActive:true}
            },()=>{
                if(content.length>0){
                    this[`content${this.state.index}`].focus();
                }else{
                    document.querySelector(`.contentEditable`).focus()
                }
            })
            e.preventDefault();
            e.stopPropagation();
        }
    };

    //Remueve bloque, focusea el bloque anterior o el input del título
    removeLine = () => {
        const content = [...this.state.content];
        content.splice(this.state.index,1);
        this.editor.splice(this.state.graf,1);
        this.setState((prevState)=>{
            return {content,topButton:prevState.topButton-62,index:prevState.index===0?0:prevState.index-1,graf:prevState.graf-1,isActive:true}
        },()=>{
            if(content.length>0){
                this[`content${this.state.index}`].focus()
            }else{
                document.querySelector(`.contentEditable`).focus()
            }
        })
    };

    /*
    BUTTON TOOL FUNCTIONS
     */
    //Agrega un nuevo parrafo
    newLine = (flag) => {
        this.setState((prevState)=>{
            let index = prevState.index+1;
            let graf = flag ? prevState.graf : prevState.graf+1;
            const line = <div ref={el=>this[`content${index}`] = el} className={`graf editable${graf}`} onKeyDown={this.keyDownContent} tabIndex={0}></div>;
            return {content:[...prevState.content,line],showTooltipMenu:false,graf,index,topButton:prevState.topButton+62,isActive:true}
        },()=>{
            this.editor.push(new MediumEditor(`.editable${this.state.graf}`,{
                toolbar:{buttons:['bold','italic','underline','anchor']},
                placeholder:false
            }));
            this[`content${this.state.index}`].focus();
        })
    };
    //Agrega un separador y un bloque nuevo
    newSeparator = () => {
        this.setState((prevState)=>{
            const [content,index,graf] = this.parseContent( 'graf');
            return {content,showTooltipMenu:false,graf,index,topButton:prevState.topButton+68,isActive:true}
        },()=>{
            this.editor.push(new MediumEditor(`.editable${this.state.index}`,{
                toolbar:{buttons:['bold','italic','underline','anchor']},
                placeholder:false
            }));
            this[`content${this.state.index}`].focus();
        })
    };
    //Agrega una nueva imagen
    newImg = (files) => {
        const file = files[0];
        if(file){
            this.setState((prevState)=>{
                const image = URL.createObjectURL(file);
                const [content,index] = this.parseContent('figure',image);
                return {content,showTooltipMenu:false,index,topButton:prevState.topButton+68,isActive:true}
            },()=>{
                this.newLine(true)
                //Subir imagen al server ?
                /*this.setState({imageFile: file,
                    event:{...this.state.event, picture: null}});
                const uploaders = files.map(file => {
                    let data = new FormData();
                    data.append('file',file);
                    return Actions.post(url,data).then((image) => {
                        console.log(image);
                        if(image) path.push(image);
                    });
                });
                axios.all(uploaders).then((data) => {
                    console.log(path);
                    console.log('SUCCESSFULL DONE');
                    self.setState({event: {
                            ...self.state.event,
                            picture: path[0]
                        },fileMsg:'Imagen subida con exito',imageFile:null,path});
                    toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!"/>);
                });*/
            })
        }
        else{
            this.setState({errImg:'Solo se permiten imágenes. Intentalo de nuevo'});
        }
    };
    //Agrega un input para que agregue un link
    newVideo = () => {
        this.setState((prevState)=>{
            const [content,index] = this.parseContent('video');
            return {content,showTooltipMenu:false,index,topButton:prevState.topButton+68,isActive:true}
        })
    };

    //Función se usa para poder revisar el array de content y reemplazar por el item que venga o lo agrega al arregla
    parseContent = (type,file) => {
        let index = this.state.index;
        let graf = this.state.graf;
        const content = [...this.state.content];
        const editorContent = this.editor[graf];
        if(editorContent && editorContent.getContent() !== '<p><br></p>'){
            index += 1;
            graf += 1;
        }
        this.editor.splice(index-1,1);
        const types = {
            'graf':<><hr/><div ref={el=>this[`content${index}`] = el} className={`graf editable${this.state.graf}`} onKeyDown={this.keyDownContent} tabIndex={0}></div></>,
            'figure':<figure className="graf-figure">
                <div className="graf-ratio" onKeyDown={this.keyDownImage} ref={el=>this[`content${index}`] = el} tabIndex={0}>
                    <img className="graf-image" data-image-id="1*BzVn0SfEKsl3Y5nWDDjVog.png" data-width="400"
                         data-height="400" src={file} alt={'image'}/>
                </div>
                <figcaption className="imageCaption" contentEditable="true" data-default-value="Type caption for image (optional)"></figcaption>
            </figure>,
            'video':<input type={'url'} className={`graf`} name={'video'} onKeyDown={this.keyDownVideo} onChange={this.emitChange}
                           placeholder={'Paste a video link and press Enter'} autoFocus={true}/>
        };
        console.log(types[type]);
        content[index] = types[type];
        return [content,index,graf]
    };

    submit = () => {
        this.editor.map(editor=>{
            console.log(editor.getContent());
            return editor
        })
    };

    render() {
        return(<React.Fragment>
                <div className="editorHtml">
                    <div className="sectionLayout">
                        <input className={`title ${this.state.active==='title'?'contentEditable':''}`} name={'html'} onKeyDown={this.keyDownTitle} onChange={this.emitChange} placeholder={'Title'}/>
                        {this.state.content}
                    </div>
                    <div className={`inlineTooltip ${this.state.showTooltipMenu?'is-scaled':''} ${this.state.isActive?'is-active':''}`}
                         style={{top: `${this.state.topButton}px`, left: "100px"}}>
                        <button
                            className="button" onClick={e=>this.setState({showTooltipMenu:!this.state.showTooltipMenu})}
                            title="Add an image, video, embed, or new part"
                            aria-label="Add an image, video, embed, or new part" data-action="inline-menu" tabIndex="-1">
                            <svg width="25" height="25"><path d="M20 12h-7V5h-1v7H5v1h7v7h1v-7h7" fill-rule="evenodd"></path></svg>
                        </button>
                        <div className="inlineTooltip-menu">
                            <button className="button" title="Add a new line" onClick={e=>this.newLine(false)} aria-label="Add a new line" tabIndex="-1">p</button>
                            <button className="button" title="Add a new part" onClick={this.newSeparator} aria-label="Add a new part" tabIndex="-1">
                                <svg width="25" height="25"><g fill-rule="evenodd"><path d="M8.45 12H5.3c-.247 0-.45.224-.45.5 0 .274.203.5.45.5h5.4c.247 0 .45-.226.45-.5 0-.276-.203-.5-.45-.5H8.45z"></path><path d="M17.45 12H14.3c-.247 0-.45.224-.45.5 0 .274.203.5.45.5h5.4c.248 0 .45-.226.45-.5 0-.276-.202-.5-.45-.5h-2.25z"></path></g></svg>
                            </button>
                            <button className="button" title="Add an image" aria-label="Add an image" tabIndex="-1">
                                <Dropzone accept="image/*" onDrop={this.newImg} multiple={false} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <svg width="25" height="25"><g fill-rule="evenodd"><path d="M4.042 17.05V8.857c0-1.088.842-1.85 1.935-1.85H8.43C8.867 6.262 9.243 5 9.6 5.01L15.405 5c.303 0 .755 1.322 1.177 2 0 .077 2.493 0 2.493 0 1.094 0 1.967.763 1.967 1.85v8.194c-.002 1.09-.873 1.943-1.967 1.943H5.977c-1.093.007-1.935-.85-1.935-1.937zm2.173-9.046c-.626 0-1.173.547-1.173 1.173v7.686c0 .625.547 1.146 1.173 1.146h12.683c.625 0 1.144-.53 1.144-1.15V9.173c0-.626-.52-1.173-1.144-1.173h-3.025c-.24-.63-.73-1.92-.873-2 0 0-5.052.006-5 0-.212.106-.87 2-.87 2l-2.915.003z"></path><path d="M12.484 15.977a3.474 3.474 0 0 1-3.488-3.49A3.473 3.473 0 0 1 12.484 9a3.474 3.474 0 0 1 3.488 3.488c0 1.94-1.55 3.49-3.488 3.49zm0-6.08c-1.407 0-2.59 1.183-2.59 2.59 0 1.408 1.183 2.593 2.59 2.593 1.407 0 2.59-1.185 2.59-2.592 0-1.406-1.183-2.592-2.59-2.592z"></path></g></svg>
                                </Dropzone>
                            </button>
                            <button className="button" title="Add a video" aria-label="Add a video" tabIndex="-1" onClick={this.newVideo}>
                                <svg width="25" height="25"><path d="M18.8 11.536L9.23 5.204C8.662 4.78 8 5.237 8 5.944v13.16c0 .708.662 1.165 1.23.74l9.57-6.33c.514-.394.606-1.516 0-1.978zm-.993 1.45l-8.294 5.267c-.297.213-.513.098-.513-.264V7.05c0-.36.218-.477.513-.264l8.294 5.267c.257.21.257.736 0 .933z" fill-rule="evenodd"></path></svg></button>
                            {/*<button className="button" title="Add an embed"
                                    aria-label="Add an embed" tabIndex="-1">
                                <svg width="25" height="25"><g fill-rule="evenodd"><path d="M9.826 7.698l-4.828 4.828 4.828 4.828.652-.7-4.08-4.128L10.53 8.4"></path><path d="M14.514 8.4l4.177 4.126-4.17 4.127.7.7 4.83-4.827-4.83-4.828"></path></g></svg>
                            </button>*/}
                        </div>
                    </div>
                </div>
                <button onClick={this.submit}>SUBMIT</button>
            </React.Fragment>
        )
    }

}

export default EditarHtml;