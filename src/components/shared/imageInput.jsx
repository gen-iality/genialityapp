import React, {Component} from 'react';
import Dropzone from 'react-dropzone'

export default class ImageInput extends Component {

    render() {
        const props = this.props;
        return (
            <div>
                {
                    props.picture?
                        <div className="imgRsvp">
                            <img src={props.picture} alt={'Imagen Perfil'}/>
                            <Dropzone accept="image/*" onDrop={props.changeImg} className="dropzone">
                                <button className={`button is-link is-inverted is-outlined ${props.imageFile?'is-loading':''}`}>Cambiar foto</button>
                            </Dropzone>
                        </div>:
                        !props.imageFile &&
                            <div>
                                <Dropzone accept="image/*" onDrop={props.changeImg} >
                                    <div>Subir foto</div>
                                </Dropzone>
                                <span>{props.errImg}</span>
                            </div>
                }
            </div>
        );
    }
}
