import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { store, persistor } from '../store/index'
import { Provider } from 'react-redux'
import DemoPage from './Demo'
import { PersistGate } from 'redux-persist/integration/react'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DemoPage />
        </PersistGate>
      </Provider>
    </div>
  )
}

export default Home
