import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCategories } from '../redux/categories/actions';
import { fetchTypes } from '../redux/types/actions';
import ContentContainer from './content';
import { UseCurrentUser } from '../context/userContext';

const MainRouter = (props) => {
  let cUser = UseCurrentUser();
  useEffect(() => {
    props.dispatch(fetchCategories());
    props.dispatch(fetchTypes());
  }, [cUser.value]);

  return (
    <Router
      basename='/'
      getUserConfirmation={() => {
        /* Empty callback to block the default browser prompt, it is necessary to be able to use in custon hook RouterPrompt */
      }}>
      <ContentContainer />
    </Router>
  );
};

export default connect()(MainRouter);
