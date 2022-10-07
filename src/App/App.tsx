import './App.less';
import loadable from '@loadable/component';
import { useCurrentUser } from './../context/userContext';

// import MainRouter from '../containers/router';
import ContentContainer from '@containers/content';

//import MainRouter from '../containers/router';
import { PreloaderApp } from '@/PreloaderApp/PreloaderApp';
import { Layout } from 'antd';
import InternetConnectionAlert from '@components/InternetConnectionAlert/InternetConnectionAlert';

const { Footer, Sider, Content } = Layout;

//Code splitting
const Header = loadable(() => import('./../containers/header'));

const App = () => {
  const cUser = useCurrentUser();
  if (cUser.status == 'LOADING') return <PreloaderApp />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <InternetConnectionAlert />
      {/* <Header /> */}
      {/* <MainRouter /> */}
      <ContentContainer />
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );
};

export default App;
