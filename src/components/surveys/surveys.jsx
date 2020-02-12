import React, {Component} from "react";
import {Link, Redirect, withRouter} from "react-router-dom";

class Surveys extends Component {
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
                               
                            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScTzaDyxVBMwvwPw_bfacaBphGjLrAtC3d0qvrfxiaDzafTWA/viewform?embedded=true" width="100%" height="2179" frameborder="0" marginheight="0" marginwidth="0"></iframe>
                            </div>
                        </div>
                    </div>
        )
    }
}

export default withRouter(Surveys)
