import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NewsFeed, Actions } from "../../helpers/request";
import Loading from "../loaders/loading";
import Moment from "moment";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";
import TableAction from "../events/shared/tableAction";
import { handleRequestError, sweetAlert } from "../../helpers/utils";
import axios from "axios/index";
import ImageInput from "../shared/imageInput";
import { toast } from 'react-toastify';
import { FormattedMessage } from "react-intl";

class Survey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [{ Response: "", correct: "", question: "" }]
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    addClick() {
        this.setState(prevState => ({
            users: [...prevState.users, { Response: "", correct: ""}]
        }))
    }

    createUI() {
        return this.state.users.map((el, i) => (
            <div key={i}>
                <input placeholder="Response" name="Response" value={el.Response || ''} onChange={this.handleChange.bind(this, i)} />
                <input placeholder="True / false" name="correct" value={el.correct || ''} onChange={this.handleChange.bind(this, i)} />
                <input type='button' value='remove' onClick={this.removeClick.bind(this, i)} />
            </div>
        ))
    }

    handleChange(i, e) {
        const { name, value } = e.target;
        let users = [...this.state.users];
        users[i] = { ...users[i], [name]: value };
        this.setState({ users });
    }

    removeClick(i) {
        let users = [...this.state.users];
        users.splice(i, 1);
        this.setState({ users });
    }

    handleSubmit(event) {
        console.log('A name was submitted: ');
        console.log(this.state.users)
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    {
                        this.state.users.map((el,i)=>(
                            <div key={i}>
                                <input placeholder="question" name="question" value={el.question || ''} onChange={this.handleChange.bind(this, i)} />
                            </div>
                            
                        ))
                    }
                    
                </div>
                {this.createUI()}
                <input type='button' value='add more' onClick={this.addClick.bind(this)} />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
export default Survey
