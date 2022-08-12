import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { userReducer } from './reducers/user'

export const USER = userReducer

const reducer = combineReducers({
  USER
})

// const store = createStore(reducer, applyMiddleware(thunk))

// export default store
import { persistStore, persistReducer,  } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'wallet-download',
  storage,
  whitelist: [ 'USER' ]
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)