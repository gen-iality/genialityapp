import './App.less'
import dayjs from 'dayjs'
import { useCurrentUser } from './../context/userContext'
import { firestore, app } from '@helpers/firebase'

import ContentContainer from '@containers/content'

import { PreloaderApp } from '@/PreloaderApp/PreloaderApp'
import { Layout } from 'antd'
import InternetConnectionAlert from '@components/InternetConnectionAlert/InternetConnectionAlert'
import { FB } from '@helpers/firestore-request'

const App = () => {
  const cUser = useCurrentUser()
  if (cUser.status == 'LOADING') return <PreloaderApp />

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <InternetConnectionAlert />
      <ContentContainer />
    </Layout>
  )
}

export default App

// @ts-expect-error
window.dayjs = dayjs
// @ts-expect-error
window.firestore = firestore
// @ts-expect-error
window.FB = FB
// @ts-expect-error
window.appFB = app
