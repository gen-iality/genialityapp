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
                                    <Dropzone accept="image/*" onDrop={props.changeImg} style={{}}>
                                        <button className="button is-outlined is-primary">Change</button>
                                    </Dropzone>
                                </div>
                                <div className="control">
                                    <button onClick={props.cancelImg} className="button is-outlined is-danger">Delete</button>
                                </div>
                            </div>
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
