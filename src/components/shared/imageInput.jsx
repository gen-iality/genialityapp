import React, {Component} from 'react';
import Dropzone from 'react-dropzone'

export default class ImageInput extends Component {

    render() {
        const props = this.props;
        return (
            <div key="file">
                {
                    props.picture?
                        <div>
                            <img src={props.picture} alt={'Imagen Perfil'}/>
                            <div className="field is-grouped is-grouped-right">
                                <div className="control">
                                    <Dropzone accept="image/*" onDrop={props.changeImg} style={estilos.zone}>
                                        <button className="button is-outlined is-primary">Change</button>
                                    </Dropzone>
                                </div>
                                <div className="control">
                                    <button onClick={props.cancelImg} className="button is-outlined is-danger">Delete</button>
                                </div>
                            </div>
                        </div>:
                        props.imageFile ?
                            <div>
                                <img src={props.imageFile.preview} alt={'Imagen Perfil'}/>
                                <button className="button is-outlined is-primary" onClick={props.uploadImg}>Upload!</button>
                                <button className="button is-outlined is-warning" onClick={props.cancelImg}>Cancel</button>
                            </div>
                            :<div style={estilos.block}>
                                <Dropzone accept="image/*" onDrop={props.handleFileChange} style={estilos.zone}>
                                    <div style={estilos.info}>
                                        <div>.png/.jpeg</div>
                                        <div>Upload new picture.</div>
                                    </div>
                                </Dropzone>
                                <span>{props.errImg}</span>
                            </div>
                }
            </div>
        );
    }
}

const estilos = {
    block : {marginTop: '1rem'}, zone  : {width: '30%'},
    info  : {display: 'flex', border: '2px solid blue', borderRadius: '2px', flex: 1, fontSize: '12px', height: '2.125rem', cursor: 'pointer'}
};
