import { createRoot } from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from "react-toastify";

// project imports
import App from 'App';
import { BASE_PATH } from 'config';
import { store, persister } from 'store';
import * as serviceWorker from 'serviceWorker';
import { ConfigProvider } from 'contexts/ConfigContext';
import "react-toastify/dist/ReactToastify.css";
import 'assets/scss/style.scss';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
            <ConfigProvider>
                <BrowserRouter basename={BASE_PATH}>
                    <App />
                    <ToastContainer />
                </BrowserRouter>
            </ConfigProvider>
        </PersistGate>
    </Provider>
);

serviceWorker.unregister();
