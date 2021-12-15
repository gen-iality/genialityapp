import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCategories } from '../redux/categories/actions';
import { fetchTypes } from '../redux/types/actions';
import ContentContainer from './content';
import { UseCurrentUser } from 'Context/userContext';

const MainRouter = (props) => {
  let cUser = UseCurrentUser();
  useEffect(() => {
    props.dispatch(fetchCategories());
    props.dispatch(fetchTypes());

    console.log('1. CUSER MAIN ROUTER==>', cUser.value);
  }, [cUser.value]);

  return (
    <Router basename='/'>
      <ContentContainer />
    </Router>
  );
};

export default connect()(MainRouter);
