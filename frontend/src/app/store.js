import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { setStore } from '../api/client';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

setStore(store);

export default store;
