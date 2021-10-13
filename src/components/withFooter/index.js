import React from 'react';
import Footer from '../../containers/footer';
import { ToastContainer } from 'react-toastify';

export default function WithFooter({ children}) {  
  return (
    <>
      {children}
      <Footer />
      <ToastContainer autoClose={2000} newestOnTop pauseOnVisibilityChange />
    </>
  );
}
