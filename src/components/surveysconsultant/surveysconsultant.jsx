import React, {Component} from "react";
import {Link, Redirect, withRouter} from "react-router-dom";
import Dropzone from "react-dropzone";
import ReactQuill from "react-quill";
import {FaChevronLeft} from "react-icons/fa";
import EventContent from "../events/shared/content_old";
import Loading from "../loaders/loading";
import {handleRequestError, sweetAlert, uploadImage} from "../../helpers/utils";
import {imageBox, toolbarEditor} from "../../helpers/constants";
import {SpeakersApi} from "../../helpers/request";

class Speaker extends Component {
    constructor() {
        super();
        this.state = {
            loading:true,
            isLoading:false,
            name:"",
            profession:"",
            description:"",
            image:"",
            imageData:"",
            networks:[]
        }
    }



    render() {
        return (
                    <div className="columns">
                        <div className="column is-8">
                            <div className="field">
                            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfwsmgT40XobkCGhgOKFuCqfij6EeFMxgDdQ5bvaKQUQsf3sw/viewform?embedded=true" width="640" height="3202" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
                                </div>
                        </div>
                    </div>
        )
    }
}

export default withRouter(Speaker)
