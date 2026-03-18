import React from 'react';
import { ToastContainer } from 'react-toastify';
import AppRouter from './router';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>Buy 2 Wheeler and 4 Wheelers Seat Covers and Accessories from Autofrom Brand Store | Shop Best Quality 2 Wheeler Accessories | Car Accessories Near Me</title>
        <meta name='description' content="Seat Cover and Accessories: Buy Exclusive Car Accessories at AutoForm Stores. Shop a Wide Range of Seat Covers and Accessories at the AutoFormIndia Brand Store." />
      </Helmet>
      <AppRouter />
      <ScrollToTop />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
