import React from 'react';
import { Switch } from 'react-router-dom';
import Footer from '../../containers/footer';
import { ToastContainer } from 'react-toastify';

export default function WithFooter({ children }) {
  return (
    <>
      {/* <Switch> */}
      {children}
      <Footer />
      <ToastContainer autoClose={2000} newestOnTop pauseOnVisibilityChange />
      {/* </Switch> */}
    </>
  );
}
