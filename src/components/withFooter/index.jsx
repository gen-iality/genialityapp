import Footer from '../../containers/footer';
/* import { ToastContainer } from 'react-toastify'; */

export default function WithFooter({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
