import './App.less';
import loadable from '@loadable/component';
import { useCurrentUser } from './../context/userContext';

import ContentContainer from '@containers/content';

import { PreloaderApp } from '@/PreloaderApp/PreloaderApp';
import { Layout } from 'antd';
import InternetConnectionAlert from '@components/InternetConnectionAlert/InternetConnectionAlert';

//Code splitting

const App = () => {
  const cUser = useCurrentUser();
  if (cUser.status == 'LOADING') return <PreloaderApp />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <InternetConnectionAlert />
      <ContentContainer />
    </Layout>
  );
};

export default App;
