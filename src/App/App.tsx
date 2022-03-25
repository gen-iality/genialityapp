import './App.less';
import loadable from '@loadable/component';
import { UseCurrentUserContext } from './../context/userContext';

// import MainRouter from '../containers/router';
import ContentContainer from '@/containers/content';

//import MainRouter from '../containers/router';
import { PreloaderApp } from '@/PreloaderApp/PreloaderApp';
import { Layout } from 'antd';

const { Footer, Sider, Content } = Layout;

//Code splitting
const Header = loadable(() => import('./../containers/header'));

const App = () => {
  const cUser = UseCurrentUserContext();
  if (cUser.status == 'LOADING') return <PreloaderApp />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* <Header /> */}
      {/* <MainRouter /> */}
      <ContentContainer />
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );
};

export default App;
