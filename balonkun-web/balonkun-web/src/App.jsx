import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import AppRouter from './router';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ScrollToTop from './components/ScrollToTop';
import RouteScrollToTop from './components/RouteScrollToTop';
import AssistanceModal from './views/components/AssistanceModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

import './assets/scss/assistance-modal.scss';

function App() {
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [hasAutomaticallyOpened, setHasAutomaticallyOpened] = useState(false);

  useEffect(() => {
    // 3-second timer for the first-time nudge
    const timer = setTimeout(() => {
      if (!hasAutomaticallyOpened) {
        setIsAssistanceModalOpen(true);
        setHasAutomaticallyOpened(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasAutomaticallyOpened]);

  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Helmet>
        <title>Buy 2 Wheeler and 4 Wheelers Seat Covers and Accessories from Autofrom Brand Store | Shop Best Quality 2 Wheeler Accessories | Car Accessories Near Me</title>
        <meta name='description' content="Seat Cover and Accessories: Buy Exclusive Car Accessories at AutoForm Stores. Shop a Wide Range of Seat Covers and Accessories at the AutoFormIndia Brand Store." />
      </Helmet>
      <AppRouter />
      <ScrollToTop />
      <ToastContainer />

      <AssistanceModal 
        isOpen={isAssistanceModalOpen} 
        toggleModal={() => setIsAssistanceModalOpen(!isAssistanceModalOpen)} 
      />
    </BrowserRouter>
  );
}

export default App;
