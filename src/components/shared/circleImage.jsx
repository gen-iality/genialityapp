
import React, {Component} from 'react';
import {TiArrowLoopOutline} from 'react-icons/ti'
import Dropzone from "react-dropzone";

class CircleImage extends Component {
    render() {
        const props = this.props;
        console.log(props);
        return (
            <div>
                {
                    props.picture?
                        <div className="circle-img">
                            <div style={{backgroundImage: `url(${props.picture.preview})`}} className="avatar-img"/>
                            <Dropzone accept="image/*" onDrop={props.changeImg} className="change-img is-size-2">
                                <TiArrowLoopOutline className="has-text-white"/>
                            </Dropzone>
                        </div>:
                        !props.imageFile &&
                        <div>
                            <Dropzone accept="image/*" style={{}} onDrop={props.changeImg} >
                                <figure className="image is-128x128">
                                    <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png"/>
                                </figure>
                            </Dropzone>
                            <span>{props.errImg}</span>
                        </div>
                }
            </div>
        );
    }
}

export default CircleImage;