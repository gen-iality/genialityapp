import { Component } from 'react';
import '../editor.scss';

class EditarHtml extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
      video: '',
      active: 'title',
      content: [],
      index: 0,
      graf: 0,
      showTooltipMenu: false,
      isActive: true,
      topButton: 78,
    };
    this.editor = [];
  }

  componentDidMount() {}

  submit = () => {
    this.editor.map((editor) => {
      return editor;
    });
  };

  render() {
    return (
      <>
        <button onClick={this.submit}>SUBMIT</button>
      </>
    );
  }
}

export default EditarHtml;
