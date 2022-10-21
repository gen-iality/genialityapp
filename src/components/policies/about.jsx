import { Component } from 'react';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ textaAlign: 'justify', padding: '0 150px' }}>
        <h1 className='title'> Quienes somos</h1>
        <p>
          <a href='https://drive.google.com/file/d/0B3lty2WUnoHtZXNNUzBIRENOTGM/view?ts=5c5b440c'>
            Click! Para conocer más sobre Evius
          </a>
        </p>
      </div>
    );
  }
}

export default About;
