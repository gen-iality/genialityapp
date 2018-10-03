import React, {Component} from 'react';
import Dropzone from 'react-dropzone'

export default class ImageInput extends Component {

    render() {
        const props = this.props;
        return (
            <div>
                {
                    props.picture?
                        <div className={props.divClass}>
                            {props.content}
                            <Dropzone accept="image/*" onDrop={props.changeImg} className={props.classDrop}>
                                {props.contentDrop}
                            </Dropzone>
                        </div>:
                        !props.imageFile &&
                            <div>
                                <Dropzone accept="image/*" onDrop={props.changeImg} style={props.style}>
                                    {props.contentZone}
                                </Dropzone>
                                <span>{props.errImg}</span>
                            </div>
                }
            </div>
        );
    }
}
