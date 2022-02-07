import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addLoginInformation } from '../../redux/user/actions';
//Libraries and stuffs
import { CategoriesApi, EventsApi, UsersApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import 'react-toastify/dist/ReactToastify.css';
import { ApiUrl } from '../../helpers/constants';
import ErrorServe from '../modal/serverError';
import { GetTokenUserFirebase } from 'helpers/HelperAuth';

class Compras extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: [],
      user: {},
      error: {},
      network: {},
      loading: true,
      valid: true,
      message: {
        class: '',
        content: '',
      },
    };
  }

  async componentDidMount() {
    let userId = this.props.match.params.id;
    try {
      const categories = await CategoriesApi.getAll();
      const events = await EventsApi.mine();
      const user = await UsersApi.getProfile(userId, true);
      //const tickets = await UsersApi.mineTickets();
      this.setState({ loading: false, user, events, categories, valid: false }, this.handleScroll);
    } catch (e) {
      this.setState({
        timeout: true,
        loading: false,
        errorData: { status: e.response.status, message: JSON.stringify(e.response.data) },
      });
    }
  }

  handleScroll = () => {
    const hash = this.props.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        let topOfElement = element.offsetTop + 60;
        window.scroll({ top: topOfElement });
      }
    }
  };

  render() {
    const { loading, timeout, errorData } = this.state;
    let userId = this.props.match.params.id;
    async function GetUserToken() {
      let token = await GetTokenUserFirebase();
      return token;
    }

    let evius_token = GetUserToken();
    return (
      <section className='section profile'>
        {loading ? (
          <Loading />
        ) : (
          <div className='container org-profile'>
            <div className='profile-data'>
              <h2 className='data-title'>
                <small className='is-italic has-text-grey-light has-text-weight-300'>Tus</small>
                <br />
                <span className='has-text-grey-dark is-size-3'>Compras</span>
              </h2>
              <iframe
                title={'Compras'}
                src={`${ApiUrl}/es/viewOrdersUsers/${userId}?evius_token=${evius_token}`}
                style={{ width: '100%', height: '600px' }}
              />
            </div>
          </div>
        )}
        {timeout && <ErrorServe errorData={errorData} />}
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addLoginInformation: bindActionCreators(addLoginInformation, dispatch),
});

export default connect(null, mapDispatchToProps)(withRouter(Compras));
