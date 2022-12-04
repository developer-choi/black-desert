import React, {useEffect} from 'react';
import type {AppProps} from 'next/app';
import {ThemeProvider} from 'styled-components';
import {theme} from '@util/style/theme';
import {GlobalStyle} from '@util/style/global';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@component/layout/Layout';
import {useAppDispatch} from '@store/storeHooks';
import {initializeFeeSetting} from '@store/feeSetting';
import {Provider} from 'react-redux';
import {store} from '@store/store';

/**
 * https://github.com/vercel/next.js/blob/master/examples/with-styled-components/pages/_app.js
 */
export default function App(props: AppProps) {
  return (
    <>
      <GlobalStyle/>
      <Provider store={store}>
        <InnerApp {...props}/>
      </Provider>
      <ToastContainer/>
    </>
  );
}

function InnerApp({Component, pageProps}: AppProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeFeeSetting());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
