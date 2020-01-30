import React, { Component, useState } from "react";
import DynamicInput from "react-dynamic-input";
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

class Surveys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [{ response: "", right: "" }],
      survey: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addClick() {
    this.setState(prevState => ({
      options: [...prevState.options, { response: "", right: "" }]
    }))
  }

  createUI() {
    return this.state.options.map((el, i) => (
      <div key={i}>
        <input placeholder="Response" defaultValue={{ label: 'Si', value: true }} name="response" value={el.response || ''} onChange={this.handleChange.bind(this, i)} />
        <select name="right" value={el.right || ''} onChange={this.handleChange.bind(this, i)}>
          <option value={true}>Correcta</option>
          <option value={false}>Falsa</option>
        </select>
        <input type='button' value='remove' onClick={this.removeClick.bind(this, i)} />
      </div>
    ))
  }
  questionText() {
    let questionText = document.getElementById("questionText").value;
    this.setState({ questionText })

    this.setState({
      survey: {
        options:{ ...this.state.options},
        questionText:{...this.state.questionText}
      }
    })
  }

  handleChange(i, e) {
    const { name, value } = e.target;
    let options = [...this.state.options];
    options[i] = { ...options[i], [name]: value };
    this.setState({ options });
  }

  removeClick(i) {
    let options = [...this.state.options];
    options.splice(i, 1);
    this.setState({ options });
  }

  handleSubmit(event) {
    console.log(this.state.survey);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" id="questionText" placeholder="Preguntas" onChange={this.questionText.bind(this)} />
        {this.createUI()}
        <input type='button' value='add more' onClick={this.addClick.bind(this)} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Surveys